---
title: "Protocol: box"
---
# Box Specification

## Abstract

A set of protocols to store files and folders on a VOLUME that is on S3 and managed by a third party who doesn't need to be trusted.

## Used services

Qabel Box uses an Accounting server which controls the access to S3. Every client who needs write access has to be authenticated by the server and then receives a set of credentials that he can use for direct access to the VOLUME.
Qabel Box also directly uses an S3 compatible server to store the blocks and metadata.

## Structure of a VOLUME

A Volume consists of a metadata file and blocks. Blocks have a blocksize of up to 10mb.

The metadata file stores information equivalent of this example JSON document, but stored in an SQLite database (the database schema is explained later):

```JSON
{
path: "/users/b5911736-9ace-a799-8e34-dd9c17acff9a/",
name: "index",
mtime: 1445432325,
objects: [
{ name: "foobar.jpg", type: "file", size: 6203434, mtime: 1445432325, blocks: [
	{blockno: 0, path: "0846C7C6-77F1-11E5-B21E-9CFF64691233"},
	{blockno: 2, path: "108FD832-77F1-1BF5-A3A4-987BF4696656"},
	{blockno: 1, path: "24F9611C-77F1-11D2-9423-9CFDFF876656"}
	]
},
{ name: "barfoo.txt", type: "file", size: 4568, mtime: 1445432120, blocks: [
	{blockno: 0, path: "8f5da4db-02ab-ca96-1824-3ba8d18a85be"}
	]
},
{ name: "some folder", type: "folder", mtime: 1445422120,
  path: "/users/b5911736-9ace-a799-8e34-dd9c17acff9a/aa8c3f39-edc5-00b0-ab8b-ba66d05b60db"
},
{ name: "external share", type: "external",mtime: 1445422120,
  path: "https://other_bucket.s3.amazonaws.com/users/a3fdc333-a143-85aa-edbf-43adf3ff7315/b6e78ecb-176d-031c-d1d4-eed608ae6e12"
},
```

### Metadata file

```JSON
{
path: STR, // whole prefix of the VOLUME
name: "index", // name of the file itself
mtime: LONG, // modification time as seconds since epoch
objects: // list of objects in this folder
[ objects* ]
}
```

### Objects

File:

```JSON
{
name: STR, // object name,
type: "file", // the type of file objects is always "file"
size: LONG, // uncompressed file size
mtime: LONG, // modification time as seconds since epoch
blocks: [block*] // unordered list of blocks that belong to the file
},
```

Folder:

```JSON
{
name: STR // object name,
type: "folder" // the type of folder objects is always "folder"
mtime: LONG, // modification time as seconds since epoch
path: STR // path to the metadata file that contains information about the folder
},
```

External:

```JSON
{
name: STR, // object name,
type: "external", // the type of external folders is always "file"
mtime: LONG, // modification time as seconds since epoch
path: STR // URL to the metadata file that contains information about the folder
},
```


### Block

```JSON
{
blockno: LONG, // number of the block starting from 0
path: STR // path to the block file
},
```
