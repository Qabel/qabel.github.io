---
title: "Components: Box"
---
# The box component

## Abstract

The box component is a core component of Qabel. It serves as a file storage for multiple clients and allows clients to share access to stored files.
The files are stored on AWS S3 and encrypted.

Features:
* Uploading single files or recursively uploading folders
* Downloading single files or folders
* Sharing read access to single files or folders
* Automatically uploading files from a local directory to a directory in the VOLUME
* Browsing the box without downloading everything
* Seeing how much space is used by the VOLUME

Every client that requires write access to S3 needs to be authenticated by the Qabel Accounting server which stores the account details for AWS. A client can request a [Federation Token](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetFederationToken.html) which is then used to talk to S3 directly. These credentials allow write and list access to a user specific prefix in the S3 bucket, which is used for his VOLUME.

All traffic and load intensive communication is only between the client and S3.

## Example - Sharing a file between the users desktop and android device

1. The user starts the box desktop application 
1. The box application downloads the newest metadata of his VOLUME
1. He browses his share and selects a file for uploading via drag & drop into a folder
1. The box application requests a Federation Token and opens a connection to S3
1. The box application inserts the information about the file into the local version of the metadata database
1. The box application uploads the file blocks and the new metadata file
1. The user starts the box android application
1. The box android application downloads the top level metadata from the VOLUME
1. He browses to the file on the VOLUME with the integrated VOLUME browser (the browser automatically downloads the relevant metadata files)
1. He selects the file and the box android application downloads it
