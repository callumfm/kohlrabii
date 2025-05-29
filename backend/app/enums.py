from enum import Enum


class Environment(str, Enum):
    TEST = "test"
    DEV = "dev"
    PROD = "prod"
