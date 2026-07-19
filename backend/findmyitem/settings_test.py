"""Temporary settings for local verification only (SQLite).

Used to prove the API works without needing the real PostgreSQL password.
The real/graded configuration is PostgreSQL in settings.py.
"""

from .settings import *  # noqa: F401,F403

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test_db.sqlite3',  # noqa: F405
    }
}
