import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

from app.config import config


def configure_sentry() -> None:
    sentry_sdk.init(
        dsn=config.SENTRY_DSN,
        enable_tracing=False,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
        environment=config.ENVIRONMENT,
        integrations=[
            FastApiIntegration(transaction_style="endpoint"),
        ],
    )
