#!/usr/bin/env python

# The original vector graphics for the Arashi logo and the Game Over logo are stored in PICT
# resources in STORM.rsrc of the original game source. These PICT resources can be copied over
# to the data fork of a new file, prepended with 512 dummy bytes and then processed by any tool
# that takes PICT files.

# Pict2SVG (http://habilis.net/pict2svg/) is a great tool that then takes these files, and spits
# out SVG. There's a bunch of cruft in the original vector images, but that can be eliminated by
# simply only taking the polygon elements from the image.

# That's exactly what this script does, and then spits out JSON in the format our BaseLogo class
# in logo.js expects. It only looks at the points attribute of polygons, and expects them in the
# specific format Pict2SVG outputs. (The actual standard may be more flexible.)

segments = []

import sys
fo = open(sys.argv[1], 'r')
data = fo.read()
fo.close()

import xml.parsers.expat
def start_element(name, attrs):
  global segments
  if name != 'polygon':
    return
  last = None
  for pointstr in attrs['points'].split():
    point = [int(x) for x in pointstr.split(',')]
    if last:
      segments.append(last + point)
    last = point
  segments[-1].append(-1)
p = xml.parsers.expat.ParserCreate()
p.StartElementHandler = start_element
p.Parse(data)

text = "[\n"
for segment in segments:
  if len(segment) == 4:
    text += "  [%s,%s, %s,%s],\n" % tuple(segment)
  else:
    text += "  [%s,%s, %s,%s, %s],\n" % tuple(segment)
text = text[:-2]
text += "\n]"
print text
