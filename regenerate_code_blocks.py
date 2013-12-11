#!/usr/bin/env python

import pygments
from pygments import lexers
from pygments import formatters

f = open('usage.js', 'r')
text = f.read()
f.close()

f = open('usage.html', 'w')
f.write(pygments.highlight(text, lexers.JavascriptLexer(), formatters.HtmlFormatter()))
f.close()

f = open('main-simplified.js', 'r')
text = f.read()
f.close()

f = open('main-simplified.html', 'w')
f.write(pygments.highlight(text, lexers.JavascriptLexer(), formatters.HtmlFormatter()))
f.close()
