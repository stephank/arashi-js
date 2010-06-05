#!/usr/bin/env python

# When given the Arashi resource fork, this script reads SPCE resources and reformats them as
# JavaScript Grid object instatiations.

# The resources contain angles in units of 3 degrees. Seems like this was done to 'scale' angles
# down into an 8-bit word? But then they were stored in 16-bit words in the resource fork...
# Either way, we convert them to regular 1 degree units here.

import sys, struct
from rfork import ResourceFork

rf = ResourceFork(sys.argv[1])
for resource in rf['SPCE'].itervalues():
  data = resource.read()
  numsegs, wraps, seglen, xoff, yoff = struct.unpack('>hbbbb', data[:6])
  if wraps == 1: wraps = 'true'
  else: wraps = 'false'
  segs = struct.unpack('>%dh' % numsegs, data[8:8+numsegs*2])

  if resource.name:
    print '// %s' % resource.name
  print """\
Grid%d = new Grid({ wraps: %s, twist: [%d,%d], angles: [
  %s
]});
""" % (resource.resid, wraps, xoff, yoff, ', '.join([str(x * 3) for x in segs]))
