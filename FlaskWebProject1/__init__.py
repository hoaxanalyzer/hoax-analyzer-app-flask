"""
The flask application package.
"""

from flask import Flask
from flask_babel import Babel
from flask_cache import Cache
from FlaskWebProject1.config import configure_app

app = Flask(__name__)

# Hook Babel
babel = Babel(app)

configure_app(app)

# Cache Config
cache = Cache()
cache.init_app(app)

import FlaskWebProject1.views
