# A filesys database for node
This module is no longer in used, it has following short commings:
- it creates many file and folders, and each of them take 4k in size...
- to avoid too many files in a directory, a long file name is break into number of chunks, e.g. test/123456789 -> test/123/456/789
- it required nfs if needed to access by multiple services
