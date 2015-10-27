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

A Volume consists of metadata files and blocks. Every VOLUME has a metadata file at VOLUME/\<index\> which is the starting point and contains references to other objects. All file names except for the index file are UUIDs.

All mtime values are seconds since epoch in UTC.

The metadata file stores information equivalent of this example JSON document, but stored in an SQLite database (the database schema is explained later):

```
{
root: "https://qabelbox.s3.amazonaws.com/users/b5911736-9ace-a799-8e34-dd9c17acff9a/",
name: "index",
spec_version: 0,
version: {version: 7, time:  1445963627},
last_change_by: "487a481f-4d93-cef0-4475-88ee576d37fd",
shared: [
	"aa8c3f39-edc5-00b0-ab8b-ba66d05b60db" : { read: [
		"feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
		"fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a"
		]},
	"8f5da4db-02ab-ca96-1824-3ba8d18a85be" : { read: [
		"fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a"
		]}
],
objects: [
{ name: "foobar.jpg", type: "file", size: 6203434, mtime: 1445432325,
  meta: null,
  key: "b43feebe528a56bb4f21ef3a8a617714aee2cabc0708c1702a98915ae852ad06",
  ref: "0846C7C6-77F1-11E5-B21E-9CFF64691233",
},
{ name: "barfoo.txt", type: "file", size: 4568, mtime: 1445432120,
  meta: "a9c6ce30-418b-e292-83bc-769a8c72f600",
  key: "042a77edb0d527816ddb3e74457d92e69302099881b9a3181a514696c0fc39bf",
  ref: "8f5da4db-02ab-ca96-1824-3ba8d18a85be"
},
{ name: "some folder", type: "folder",
  key: "fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a",
  ref: "aa8c3f39-edc5-00b0-ab8b-ba66d05b60db"
},
{ name: "external share", type: "external",
  owner: "feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
  key: "d570b7fcf9eda9daa648d5ec18ae04x9bd1f7b8d6acbd8764844df5aaae0ff91",
  url: "https://other_bucket.s3.amazonaws.com/users/a3fdc333-a143-85aa-edbf-43adf3ff7315/b6e78ecb-176d-031c-d1d4-eed608ae6e12"
},
```

### Directory Metadata [DM]


```
{
root: STR, // URL of the VOLUME
name: "index", // name of the file itself
last_change_by: UUID, // ID of the device that made the last change
spec_version: INT,  // version of the VOLUME spec
					// increment if migrations are needed
					// and/or the files are incompatible between versions
version: {version: LONG, time: LONG}, // metadata version and time of change, time should not be trusted
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
read: [KEY] // List of public keys of identities that this folder is read only shared with
},
```

### File Metadata [FM]

A file only has its own FM, if it is shared in a single file share.
The FM is stored in the path referenced as "meta" in the file object and encrypted
in a noise box with the public key of the recipient.

### Objects

File:

```
{
name: STR, // object name,
type: "file", // the type of file objects is always "file"
size: LONG, // uncompressed file size
mtime: LONG, // modification time as seconds since epoch
meta: STR|null, // path to the FM, if it exists
key: KEY, // symmetric key for the block
ref: STR // reference to the block in relation to the root of the VOLUME
},
```

Folder:

```
{
name: STR // object name,
type: "folder" // the type of folder objects is always "folder"
key: KEY // symmetric directory key
ref: STR // ref of the metadata file that contains information about the folder
},
```

External:

```
{
name: STR, // object name,
type: "external", // the type of external folders is always "external"
key: KEY // symmetric directory key
owner: STR, // public key of the owner of that VOLUME
url: STR // URL to the metadata file that contains information about the folder
},
```

### dk - Directory Key
The directory key is stored in the directory object of the parent folder, the index
file DM is encrypted with the public key of the owner.

### fk - File Key
File keys are stored in the directory metadata file

### Qabel Identities
Identities have a public key **pub** and a private key **priv**

### Device ID
Each client device has a unique ID which is a random generated UUID **devID**

### Path to VOLUME/\<index\>
\<index\> is calculated from the sha256 of the owners private key. Take the first 128bit of it
and format them like the canonical form of a UUID.
This means: 8-4-4-4-12 hexadecimal digits.
Example: e5cceedc-c222-d549-6211-1b6c684e0b2a


### Share notification drop message
The plaintext of the drop message is a JSON document with the url of the DM and the symmetric key.

```
{
	url: STR // url to the DM of the shared folder
	key: KEY // symmetric directory key
}
```

## Initializing a new VOLUME

### Task

Initialize a new VOLUME without any objects

### Prerequisites

* Valid federation token with write access to the VOLUME
* Device ID **devId0*

### Process

1. Create an empty metadata file

	```
	{
	path: STR, // prefix of the volume
	name: "index", // starting point of each VOLUME
	spec_version: 0,
	version: 0,
	last_change_by: **dk0**
	objects: []
	}
	```
1. Encrypt the file with **priv0** and upload it to VOLUME/\<index\>


## Uploading a new file

### Task

Upload a new file "example.jpg" from the client to the folder VOLUME/examples/.

### Prerequisites

* Valid federation token with write access to the VOLUME

### Process

1. Download VOLUME/index.key and try to decrypt the noise boxes with your private key k0 until you find yours, the plaintext is the directory key **dk0**
1. Retrieve VOLUME/index and decrypt it with **dk0**
1. Find the folder "examples" in the index and retrieve its metadata file, decrypt it with the stored directory key dk1
1. Create a new symmetric key **fk0**
1. Encrypt the file with **fk0**
1. Generate a new UUID, this is the ref of the file
1. Upload the block to VOLUME/\<uuid\>, note the "Date" header from the response and use it as mtime
1. Insert the new object, including its **fk0**, into the metadata file, using the mtime from the response and the original file size in bytes as size
1. Set `last_change_by` to your device id
1. Encrypt the metadata file with **dk1** and upload it to VOLUME/\<metadata-file\>


## Browsing a share and downloading a file

### Task

Starting with only a VOLUME path and a qabel identity, let the user browse the whole VOLUME.

### Prerequisites

* URL of the VOLUME

### Process

1. Download VOLUME/index.key and try to decrypt the noise boxes with your private key k0 until you find yours, the plaintext is the directory key **dk0**
1. Download VOLUME/index and decrypt it with **dk0**
1. Open the metadata file and show the directory listing to the user
1. If the user selects a directory or external share:
    1. Download the directory metadata file and decrypt it with the key stored in the parent folders metadata file
    1. Open the metadata file and show the directory listing to the user
1. If the user selects a file:
	1. Download the referenced block
	1. Read the symmetric file key **fk0** from the metadata file 
	1. Decrypt the block with **fk0**


## Deleting a file

### Task

Delete a file on the users VOLUME.

### Prerequisites

* URL of the VOLUME
* Valid federation token with write access to the VOLUME

### Process

1. Download and decrypt the metadata file
1. Remove the file object from the metadata file, increment the version
1. Set `last_change_by` to your device id
1. Encrypt the metadata file and upload it, overwriting the old metadata file
1. Delete the block of the deleted file on S3
1. If the file object has a reference to a FM, delete the FM


## Updating a file

### Task

Update an existing file on the users VOLUME.

### Prerequisites

* URL of the VOLUME
* Valid federation token with write access to the VOLUME


### Process

1. Download and decrypt the metadata file
1. Upload the file in a new block with a new UUID and a new key
1. Update the file object in the metadata with the new ref and key, increment the version
1. Set `last_change_by` to your device id
1. Encrypt the metadata file and upload it, overwriting the old metadata file
1. Delete the old block of the deleted file on S3


## Sharing a directory

### Task

Share a directory recursively to another identity

### Prerequisites

* Path and directory key
* Valid federation token with write access to the VOLUME
* Contact info of the other identity


### Process

1. Insert the share info in the index metadata file, increment the version, set the device id and upload it
1. Notify the other identity about the new share with a drop message.


## Unsharing a directory

### Task

Remove a share to another identity

### Prerequisites

* Path and directory key
* Valid federation token with write access to the VOLUME
* Public key pub1 of the other identity


### Process

1. Remove the identities public key from the share info of the folder in the index metadata file, set the device id and increment the version
1. Download recursively all DM
1. Upload an archive of all those DM, encrypted with **dk0**, the root directory key, as a new file to the VOLUME
1. Insert this file with the share ref+"_backup" as name into the root directory
1. Delete recursively all DM from the share (See [Delete Multiple Objects](https://docs.aws.amazon.com/AmazonS3/latest/API/multiobjectdeleteapi.html)
1. Wait until the deletion has propagated, check the progress by issuing HEAD requests for the files.
1. Create a new **dk\*** for each DM in the share and insert them in their parents
1. Upload all the new DM, encrypted with their new **dk\***, depth first
1. Check every uploaded DM with HEAD requests to ensure that no conflicts occurred.
1. Insert the new **dk\*** into the parent directory of the share and upload the DM
1. Remove the backup file from the root directory
1. Send the new **dk\*** of the share to all remaining identities

# SQLite Schema

Schema for the SQLite3 database which is used as a directory metadata file (DM).
The JSON documents can be directly translated into this schema.

```SQL
/*
The meta table includes the values
 * root (only needed in the index)
 * name
 * last_change_by
*/
CREATE TABLE meta
(
       name             VARCHAR(24) PRIMARY KEY,
       value            TEXT
);

/*
A one row table with only the current qabel-box specification version.
This version is 0 for now and should be checked everytime the databases is opened.
*/
CREATE TABLE spec_version
(
       version          INTEGER PRIMARY KEY
);

/*
Current version and the current time. The time is only used for displaying,
it should not be trusted.
*/
CREATE TABLE version
(
       version          INTEGER PRIMARY KEY,
       time             INTEGER NOT NULL
);

/*
Table of all shares in the VOLUME.
* 'id' is meaningless and only for record keeping purposes.
* 'ref' is the name of the metadata file
* 'recipient' is the public key of the recipient
* 'type' is 0 for a read only share and 1 for a writable share (not implemented yet)
*/
CREATE TABLE shares
(
       id               INTEGER PRIMARY KEY,
       ref              VARCHAR(255) NOT NULL,
       recipient        BLOB NOT NULL,
       type             INT NOT NULL
);

/*
Table of all file objects in the directory
* 'id' is meaningless and only for record keeping purposes.
* 'ref' is the name of the metadata file
* 'name' is the file name
* 'size' is the file size in bytes
* 'mtime' is the modification timestamp
* 'key' is the symmetric file key
*/
CREATE TABLE files
(
       id               INTEGER PRIMARY KEY,
       ref              VARCHAR(255) NOT NULL,
       name             VARCHAR(255) NOT NULL,
       size             LONG NOT NULL,
       mtime            INT NOT NULL,
       key              BLOB NOT NULL
);

/*
Table of all folder objects in the directory
* 'id' is meaningless and only for record keeping purposes.
* 'ref' is the name of the metadata file
* 'name' is the folder name
* 'key' is the symmetric directory key
*/
CREATE TABLE folders
(
       id               INTEGER PRIMARY KEY,
       ref              VARCHAR(255) NOT NULL,
       name             VARCHAR(255) NOT NULL,
       key              BLOB NOT NULL
);

/*
Table of all external objects in the directory
* 'id' is meaningless and only for record keeping purposes.
* 'owner' is the public key of the owner
* 'name' is the share name
* 'key' is the symmetric directory key
* 'url' is the url of the metadata file
*/
CREATE TABLE externals
(
       id              INTEGER PRIMARY KEY,
       owner           BLOB NOT NULL,
       name            VARCHAR(255) NOT NULL,
       key             BLOB NOT NULL,
       url             TEXT NOT NULL
);
```
