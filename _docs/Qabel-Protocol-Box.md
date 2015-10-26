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

A Volume consists of metadata files and blocks. Every VOLUME has a metadata file at VOLUME/index which is the starting point and contains references to other objects. All file names except for the index file are UUIDs.

All mtime values are seconds since epoch in UTC.

The metadata file stores information equivalent of this example JSON document, but stored in an SQLite database (the database schema is explained later):

```
{
root: "https://qabelbox.s3.amazonaws.com/users/b5911736-9ace-a799-8e34-dd9c17acff9a/",
name: "index",
spec_version: 0,
version: 7,
owner: "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a"
shared: [
	"aa8c3f39-edc5-00b0-ab8b-ba66d05b60db" : { read: [
		"feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
		"fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a"
	]}
],
objects: [
{ name: "foobar.jpg", type: "file", size: 6203434, mtime: 1445432325,
  ref: "0846C7C6-77F1-11E5-B21E-9CFF64691233",
},
{ name: "barfoo.txt", type: "file", size: 4568, mtime: 1445432120,
  ref: "8f5da4db-02ab-ca96-1824-3ba8d18a85be"
},
{ name: "some folder", type: "folder",
  ref: "aa8c3f39-edc5-00b0-ab8b-ba66d05b60db"
},
{ name: "external share", type: "external",
  owner: "feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
  url: "https://other_bucket.s3.amazonaws.com/users/a3fdc333-a143-85aa-edbf-43adf3ff7315/b6e78ecb-176d-031c-d1d4-eed608ae6e12"
},
```

### Metadata file


```
{
root: STR, // URL of the VOLUME
name: "index", // name of the file itself
spec_version: INT,  // version of the VOLUME spec
					// increment if migrations are needed
					// and/or the files are incompatible between versions
version: LONG, // metadata version
shared: // description of all shares
{ shares* },
objects: // list of objects in this folder
[ objects* ]
}
```

Note that folders that are not "index" do not have the "shared"-key, as all information about shares in a VOLUME are stored in "index".



### Shares

The index is the path to the metadata file of the share.

```
{
read: [STR] // List of public keys of identities that this folder is read only shared with
},
```


### Objects

File:

```
{
name: STR, // object name,
type: "file", // the type of file objects is always "file"
size: LONG, // uncompressed file size
mtime: LONG, // modification time as seconds since epoch
ref: STR // reference in relation to the root of the VOLUME
},
```

Folder:

```
{
name: STR // object name,
type: "folder" // the type of folder objects is always "folder"
ref: STR // ref of the metadata file that contains information about the folder
},
```

External:

```
{
name: STR, // object name,
type: "external", // the type of external folders is always "external"
owner: STR, // public key of the owner of that VOLUME
url: STR // URL to the metadata file that contains information about the folder
},
```

## Key names

### dk - Directory Key
Stored in <metadata-file>.key a noise box. Each Qabel identity has its own noise box.
The noise boxes are concatenated and of a fixed length.

### fk - File Key
File keys are encrypted, enclosed enclosed between `---QABEL BOX BLOCK KEY--` and `---QABEL BOX BLOCK KEY END--`.
The are stored as headers of blocks.

### Qabel Identities
Identities have a public key **pub** and a private key **priv**

## Initializing a new VOLUME

### Task

Initialize a new VOLUME without any objects

### Prerequisites

* Valid federation token with write access to the VOLUME

### Process

1. Create a new symmetric VOLUME key **dk0**
1. Create an empty metadata file

	```
	{
	path: STR, // prefix of the volume
	name: "index", // starting point of each VOLUME
	spec_version: 0,
	version: 0,
	objects: []
	}
	```
1. Encrypt the file with **dk0** and upload it to VOLUME/index
1. Encrypt **dk0** with your identity's public key as a noise box and upload it to VOLUME/index.key


## Uploading a new file

### Task

Upload a new file "example.jpg" from the client to the folder VOLUME/examples/.

### Prerequisites

* Valid federation token with write access to the VOLUME

### Process

1. Download VOLUME/index.key and try to decrypt the noise boxes with your private key k0 until you find yours, the plaintext is the directory key **dk0**
1. Retrieve VOLUME/index and decrypt it with **dk0**
1. Find the folder "examples" in the index and retrieve its metadata file and its key file
1. Decrypt the symmetric folder key **dk1** with your identities private key priv0
1. Create a new symmetric key **fk0**
1. Encrypt the file with **fk0**
1. Concatenate the encrypted fk0 and the encrypted file
1. Generate a new UUID, this is the ref of the file
1. Upload the blocks to VOLUME/<uuid>, note the "Date" header from the response and use it as mtime
1. Insert the new object into the metadata file, using the mtime from the response and the original file size in bytes as size
1. Encrypt the metadata file with **dk1** and upload it to VOLUME/<metadata-file>


## Browsing a share and downloading a file

### Task

Starting with only a VOLUME path and a qabel identity, let the user browse the whole VOLUME.

### Prerequisites

* URL to the VOLUME

### Process

1. Download VOLUME/index.key and try to decrypt the noise boxes with your private key k0 until you find yours, the plaintext is the directory key **dk0**
1. Download VOLUME/index and decrypt it with **dk0**
1. Open the metadata file and show the directory listing to the user
1. If the user selects a directory or external share:
	1. Let the directory path be **$PATH**
	1. Download ${PATH}.key and decrypt all noises boxes with **priv0** until you find a valid key **dk1**
1. If the user selects a file **$name**:
	1. Download the referenced block
	1. Read the symmetric block key that is prefixed to the block and decrypt it with the directory key **dk1** and call it **fk0**
	1. Decrypt the rest of the block with **fk0**

