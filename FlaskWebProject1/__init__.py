"""
The flask application package.
"""

from flask import Flask
from flask_babel import Babel

app = Flask(__name__)

# Hook Babel
babel = Babel(app)

import FlaskWebProject1.views
