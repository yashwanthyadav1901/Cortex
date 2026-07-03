from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    supabase_url: str = ""  # project URL, used for JWKS token verification
    supabase_jwt_secret: str = ""  # only needed on legacy HS256 projects
    allowed_email: str

    llm_base_url: str = "https://integrate.api.nvidia.com/v1"
    llm_api_key: str = ""
    llm_model: str = "meta/llama-3.3-70b-instruct"

    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
