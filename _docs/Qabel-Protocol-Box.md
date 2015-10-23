---
title: "Protocol: box"
---
# Box Specification

## Abstract

A set of protocols to store files and folders on a VOLUME that is on AWS S3 and managed by a third party who doesn't need to be trusted.

## Used services

Qabel Box uses an Accounting server which controls the access to AWS S3. Every client who needs write access has to be authenticated by the server and then receives a set of credentials that he can use for direct access to the VOLUME.
Qabel Box also directly uses AWS S3 to store the blocks and metadata.

## Structure of a VOLUME

A Volume consists of metadata files and blocks. Blocks have a block size of up to 10mb. Every VOLUME has a metadata file at VOLUME/index which is the starting point and contains references to other objects.

All mtime values are seconds since epoch in UTC.

The metadata file stores information equivalent of this example JSON document, but stored in an SQLite database (the database schema is explained later):

```JSON
{
root: "https://qabelbox.s3.amazonaws.com/users/b5911736-9ace-a799-8e34-dd9c17acff9a/",
name: "index",
version: 7,
owner: "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a"
shared: [
	"aa8c3f39-edc5-00b0-ab8b-ba66d05b60db" : { read: [
		"feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
		"fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a"
	]}
],
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
{ name: "some folder", type: "folder",
  path: "aa8c3f39-edc5-00b0-ab8b-ba66d05b60db"
},
{ name: "external share", type: "external",
  path: "https://other_bucket.s3.amazonaws.com/users/a3fdc333-a143-85aa-edbf-43adf3ff7315/b6e78ecb-176d-031c-d1d4-eed608ae6e12"
},
```

### Metadata file


```JSON
{
root: STR, // URL of the VOLUME
name: "index", // name of the file itself
version: LONG, // metadata version
owner: STR, // public key of the volume owner
shared: // description of all shares
{ shares* },
objects: // list of objects in this folder
[ objects* ]
}
```

Note that folders that are not "index" do not have the "shared"-key, as all information about shares in a VOLUME are stored in "index".



### Shares

The index is the path to the metadata file of the share.

```JSON
{
read: [STR] // List of public keys of identities that this folder is read only shared with
},
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
path: STR // path to the metadata file that contains information about the folder
},
```

External:

```JSON
{
name: STR, // object name,
type: "external", // the type of external folders is always "external"
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

## Initialising a new VOLUME

### Task

Intialize a new VOLUME without any objects

### Prerequisites

* Valid federation token with write access to the VOLUME
* Qabel identity

### Process

1. Create a new symmetric VOLUME key P0
1. Create an empty metadata file

	```JSON
	{
	path: STR, // prefix of the volume
	name: "index", // starting point of each VOLUME
	version: 0,
	objects: []
	}
	```
1. Encrypt the file with P0 and upload it to VOLUME/index
1. Encrypt P0 with your identities public key as a noise box and call it PK0
1. Upload PK0 to VOLUME.key


## Uploading a new file

### Task

Upload a new file "example.jpg" from the client to the folder VOLUME/examples/.

### Prerequisites

* Valid federation token with write access to the VOLUME
* The VOLUME is configured with a metadata file at VOLUME/index
* The VOLUME key P0 is known

### Process

1. Retrieve VOLUME/index and decrypt it with P0
1. Find the folder "examples" in the index and retrieve and decrypt its metadata file
1. Decrypt the symmetric folder key P1, stored at VOLUME/<metadata-file>.key, with your identities private key
1. Split up the file in chunks and encrypt each of them with a new symmetric key K0-K<N>
1. Encrypt the symmetric keys with P1. Concatenate each encrypted key with it's chunk and call it a block
1. Name the blocks with new UUIDs
1. Upload the blocks to VOLUME/<uuid>, note the "Date" header from the response and use it as mtime
1. Insert the new object into the metadata file, including all blocks, settings the mtime to the largest mtime of it's blocks, increment the version
1. Encrypt the metadata file with P1 and upload it to VOLUME/<metadata-file>


## Browsing a share and downloading a file

### Task

Starting with only a VOLUME path and a qabel identity, let the user browse the whole VOLUME.

### Prerequisites

* Qabel identity
* URL to the VOLUME

### Process

1. Download VOLUME/index.key
1. Decrypt all noise boxes with a fixed length of N bytes **TODO** in index.key with your identities private key **PP0** until you find a payload that starts with the token ---QABEL BOX DIRECTORY KEY--- and ends with ---QABEL BOX DIRECTORY KEY END---. The data between these tokens is the _directory key_ **P0**
1. Download VOLUME/index and decrypt it with **P0**
1. Open the metadata file and show the directory listing to the user
1. If the user selects a directory or external share:
	1. Let the directory path be **$PATH**
	1. Download ${PATH}.key and decrypt all noises boxes with **PP0** until you find a valid key **P1**
1. If the user selects a file **$name**:
	1. Sort the blocks of the file by **blockno**
	1. For each block:
		1. Download the block
		1. Read the symmetric block key between the token ---QABEL BOX BLOCK KEY-- and ---QABEL BOX BLOCK KEY END-- and decrypt it with the directory key **P0** and call it **k1**
		1. Decrypt the rest of the block with **k1**
	1. Concatenate all blocks and call the file **$name**

