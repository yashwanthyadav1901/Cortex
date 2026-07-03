import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings

_bearer = HTTPBearer(auto_error=False)
_jwks_client: jwt.PyJWKClient | None = None


def _get_jwks_client() -> jwt.PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        base = get_settings().supabase_url.rstrip("/")
        _jwks_client = jwt.PyJWKClient(
            f"{base}/auth/v1/.well-known/jwks.json", cache_keys=True
        )
    return _jwks_client


def _verify(token: str) -> dict:
    """Verify a Supabase access token.

    Projects on the new JWT signing keys issue ES256 tokens verified against
    the public JWKS endpoint; legacy projects issue HS256 tokens verified
    with the shared JWT secret.
    """
    settings = get_settings()
    alg = jwt.get_unverified_header(token).get("alg", "")
    if alg == "HS256":
        if not settings.supabase_jwt_secret:
            raise jwt.InvalidTokenError("SUPABASE_JWT_SECRET not configured")
        return jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
    signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
    return jwt.decode(
        token,
        signing_key.key,
        algorithms=["ES256", "RS256"],
        audience="authenticated",
    )


def require_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> dict:
    """Verify the Supabase JWT and confirm it belongs to the allowed account."""
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")

    try:
        payload = _verify(credentials.credentials)
    except jwt.PyJWTError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token") from exc

    if payload.get("email") != get_settings().allowed_email:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account not allowed")
    return payload
