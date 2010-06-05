# A tiny library for reading raw Macintosh resource forks.
# Basilisk II and SheepShaver store these in .rsrc directories.

# Typical usage:
#     rf = ResourceFork("path/to/.rsrc/file")
#     data = rf.read("TYPE", 1234)
#     data = rf["TYPE"][1234].read()

import sys, struct

class Resource:
  def __init__(self, fork, t, i, name, offset):
    self.fork = fork
    self.restype = t
    self.resid = i
    self.name = name
    self.offset = offset

  def read(self):
    return self.fork.read(self.restype, self.resid)

class ResourceFork(object):
  def __init__(self, path):
    self.resources = {}

    self.fo = fo = open(path, 'r')

    # Read the resource fork header.
    header = fo.read(16)
    dataOffset, mapOffset, dataLen, mapLen = struct.unpack('>iiii', header)

    # Read the resource map header.
    fo.seek(mapOffset + 24)
    mapHeader = fo.read(6)
    typeListOffset, nameListOffset, numTypes = struct.unpack('>hhh', mapHeader)
    # typeListOffset is off by two bytes? But offsets that are in turn relative to typeListOffset
    # seem correct. We don't seek to typeListOffset at all though, because we know it immediately
    # follows the resource map.
    typeListOffset += mapOffset
    nameListOffset += mapOffset

    # Read all the type list entries and build a dictionary.
    #fo.seek(typeListOffset)
    for i in range(numTypes):
      typeName = fo.read(4)
      typeHeader = fo.read(4)
      numResources, refListOffset = struct.unpack('>hh', typeHeader)
      numResources += 1
      refListOffset += typeListOffset
      self.resources[typeName] = (numResources, refListOffset)

    # Read all the reference list entries and rebuild the dictionary.
    for typeName in self.resources.keys():
      numResources, refListOffset = self.resources[typeName]
      references = {}
      fo.seek(refListOffset)
      for i in range(numResources):
        reference = fo.read(12)
        resourceId, nameEntryOffset, dataEntryOffset = struct.unpack('>hhi4x', reference)
        if nameEntryOffset != -1:
          nameEntryOffset += nameListOffset
        dataEntryOffset = (dataEntryOffset & 0x00ffffff) + dataOffset
        references[resourceId] = (nameEntryOffset, dataEntryOffset)
      self.resources[typeName] = references

    # Read all the name list entries and rebuild again.
    for typeName, references in self.resources.iteritems():
      for resourceId in references.keys():
        nameEntryOffset, dataEntryOffset = references[resourceId]
        if nameEntryOffset != -1:
          fo.seek(nameEntryOffset)
          length, = struct.unpack('>b', fo.read(1))
          name = fo.read(length)
        else:
          name = ''
        references[resourceId] = Resource(self, typeName, resourceId, name, dataEntryOffset)

  def __getitem__(self, item):
    return self.resources.__getitem__(item)

  def read(self, t, i):
    self.fo.seek(self.resources[t][i].offset)
    length, = struct.unpack('>i', self.fo.read(4))
    return self.fo.read(length)

