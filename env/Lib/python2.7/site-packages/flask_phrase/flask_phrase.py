from __future__ import print_function
try:
    from flask.ext.babel import gettext as gettext_original, ngettext as ngettext_original
    from flask import current_app
except ImportError:
    print("Flask-Babel is required.")

class Phrase(object):

    def __init__(self, app=None):
        self.app = app
        app.jinja_env.install_gettext_callables(
            gettext,
            ngettext,
            newstyle=True
        )

def phrase_enabled():
    return current_app.config['PHRASEAPP_ENABLED']

def phrase_key(msgid):
    return current_app.config['PHRASEAPP_PREFIX'] + 'phrase_' + msgid + current_app.config['PHRASEAPP_SUFFIX']

def gettext(msgid):
    if phrase_enabled():
        return phrase_key(msgid)
    else:
        return gettext_original(msgid)

def ngettext(msgid):
    if phrase_enabled():
        return phrase_key(msgid)
    else:
        return ngettext_original(msgid)
