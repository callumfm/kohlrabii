from enum import Enum


class Environment(str, Enum):
    LOCAL = "local"
    DEV = "dev"
    PROD = "prod"
