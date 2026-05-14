from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "KineTrack API"
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "kinetrack"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
