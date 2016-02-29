---
title: "Components: Box"
---
# The box component

## Abstract

The box component is a core component of Qabel. It serves as a file storage for multiple clients and allows clients to share access to stored files.
The files are encrypted and stored by the Qabel Block server on AWS S3.

Features:

* Uploading single files or recursively uploading folders
* Downloading single files or folders
* Sharing read access to single files or folders
* Automatically uploading files from a local directory to a directory in the VOLUME
* Browsing the box without downloading everything
* Seeing how much space is used by the VOLUME

Every client that requires write access its VOLUME needs to be authenticated by the Qabel Accounting server. A client can request an authentication token which is then used to talk to the block server directly. This token allows indirect write and list access to a user specific prefix in the S3 bucket, which is used for the users VOLUME.

All traffic and load intensive communication is only between the client and the Qabel Block server which directly accesses S3.