from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    supabase_url: str = ""  # project URL, used for JWKS token verification
    supabase_jwt_secret: str = ""  # only needed on legacy HS256 projects
    allowed_email: str
    timezone: str = "UTC"  # IANA name; anchors streak/activity day boundaries

    cors_origins: str = "http://localhost:3000"

    # ---- AI chat providers ----
    # Which backend answers topic chat: "nvidia" (dev, free) | "anthropic" (prod).
    llm_provider: str = "nvidia"
    nvidia_api_key: str = ""
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    nvidia_model: str = "nvidia/nemotron-3-super-120b-a12b"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-5"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
