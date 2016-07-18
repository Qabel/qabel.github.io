---
title: "Protocol: box"
---
# Box Specification

## Abstract

A set of protocols to store files and folders on a VOLUME that is (currently) stored on AWS S3 and managed by a third party who doesn't need to be trusted.

## Used services

Qabel Box uses the [Accounting server](../Qabel-Accounting) that
controls the access to the Qabel Block server which directly accesses
the files on AWS S3. Every client which needs write access, has to be
authenticated by the Accounting server and then receives an
authentication token for the communication with the Block server. The
Block server enforces the permissions that are connected to the
authentication tokens.  Qabel Box uses the Block server to store the
blocks and metadata.

## Block server

When the block server receives a request that requires authorization
it forwards the `Authorization` header to the
[authentication API](../Qabel-Accounting#authentication) to verify the
authorization token.

### Quota information

* Resource: /api/v0/quota
* Method: GET
* Requires valid `Authorization` header
* Request data: `{}`
* Response data: `{quota: LONG, size: LONG}`
  * `quota`: available storage quota
  * `size`: used storage

### Prefix
The prefix resource controls all prefixes of the user.

Create a new prefix:

* Resource: /api/v0/prefix
* Method: POST
* Requires valid `Authorization` header
* Request data: None
* Response data: `{prefix: STR}`

Get a list of available prefixes

* Resource: /api/v0/prefix
* Method: GET
* Requires valid `Authorization` header
* Request data: None
* Response data: `{prefixes: [STR]}`

### File transfer

The block server has a REST resource for files which is used for uploads, downloads and deletes on the storage backend.
Authentication is handled exactly like on the accounting server, with the Authentication header.

* Resource: /api/v0/files/\<prefix\>/\<path\>
* Method: GET|POST|DELETE
* Request data: None for GET and DELETE, the file itself for POST
* Response data: None for Post and Delete, the file itself for GET

A Reponse will have a status code of 204 or 200 if successfull,
404 if the file for a GET was not found and 403 if the request was not
authorized.

The server sends an ETag header on GET and POST and respects the 'If-None-Match'
header. If the ETag in the 'If-None-Match' header matches, a 304 with an empty body
is returned. Additionally an 'If-Match' header can be specified for POST requests,
which only executes the POST if the ETag in the header matches the current ETag
of the file. If this check fails HTTP 412 (Precondition failed) is returned.

POST and DELETE require a valid `Authorization` header, while GET does not.

## Structure of a VOLUME

A Volume consists of metadata files and blocks. Every VOLUME has a metadata file at VOLUME/\<index\> which is the starting point and contains references to other objects. All file names on S3 are UUIDs.

All mtime and ctime values are seconds since epoch in UTC. Blocks are stored at VOLUME/blocks/.
For files, the mtime is the mtime of the original file to be restored on download / sync
and the ctime is time (defined by the server) when the file block was uploaded.
For directories, the ctime is the time (defined by the server) when the Directory Metadata of this directory has been uploaded.

![Qabel Storage Structure](/images/qabelStorageStructure.png)

The metadata file stores information equivalent of this example JSON document, but stored in an SQLite database (the database schema is explained later):

```
{
root: "https://qabelbox.s3.amazonaws.com/users/b5911736-9ace-a799-8e34-dd9c17acff9a/",
spec_version: 0,
version: {version: "85bc5ead74c52df59c3abd3340ff9d6bd821acd61189950aec4f68c37b773a20",
          time:  1445963627},
last_change_by: "487a481f-4d93-cef0-4475-88ee576d37fd",
shared: [
{ ref: "aa8c3f39-edc5-00b0-ab8b-ba66d05b60db",
  recipient: "feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
  type: "READ"},
{ ref: "aa8c3f39-edc5-00b0-ab8b-ba66d05b60db",
  recipient: "fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a",
  type: "READ"},
{ ref:"a9c6ce30-418b-e292-83bc-769a8c72f600",
  recipient: "fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a",
  type: "READ"}
],
files: [
{ name: "foobar.jpg", size: 6203434, mtime: 1445432325, ctime: 1445432326,
meta: null,
metakey: null,
key: "b43feebe528a56bb4f21ef3a8a617714aee2cabc0708c1702a98915ae852ad06",
ref: "0846C7C6-77F1-11E5-B21E-9CFF64691233",
},
{ name: "barfoo.txt", size: 4568, mtime: 1445432120, ctime 1445432122,
meta: "a7c19151-b2cc-47d8-82e5-636d5c7ac00a/a9c6ce30-418b-e292-83bc-769a8c72f600",
metakey: "fbeaf7cc5560b5e38b5a37e5d8e104x38daa59a6ef97c0a868a3a193f2c089b9",
key: "042a77edb0d527816ddb3e74457d92e69302099881b9a3181a514696c0fc39bf",
ref: "8f5da4db-02ab-ca96-1824-3ba8d18a85be"
}],
folders: [
{ name: "some folder",
key: "fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a",
ref: "aa8c3f39-edc5-00b0-ab8b-ba66d05b60db"
}],
externals: [
{ name: "external share",
owner: "feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
key: "d570b7fcf9eda9daa648d5ec18ae04x9bd1f7b8d6acbd8764844df5aaae0ff91",
url: "https://other_bucket.s3.amazonaws.com/users/a3fdc333-a143-85aa-edbf-43adf3ff7315/b6e78ecb-176d-031c-d1d4-eed608ae6e12"
}]
}
```

### Directory Metadata [DM]

![Qabel File System Key Distribution](/images/qabelFileSystemKeyDistribution.png)


```
{
root: URL, // URL of the VOLUME, only in the index file
last_change_by: UUID, // ID of the device that made the last change
spec_version: INT,  // version of the VOLUME spec
					// increment if migrations are needed
					// and/or the files are incompatible between versions
version: {version: KEY, time: LONG}, // metadata version and time of change, time should not be trusted
shared: // description of all shares, only in the index file
{ shares* },
files: // list of files in this folder
[ file* ]
folders: // list of folders in this folder
[ folder* ]
externals: // list of external shares in this folder
[ external* ]
}
```

Note that folders that are not "index" do not have the "shared"-key, as all information about shares in a VOLUME are stored in "index". The index file also has the URL of the VOLUME in the "root" attribute

The version is a SHA-256 hash built with the following rule:
```
version(0) = SHA-256(0x00 || device-id)
version(n) = SHA-256(0x01 || version(n-1) || device-id)
```

The device-id is unique for each client and a 128-bit value.

### Shares

The index is the path to the metadata file of the share.

```
{
ref: STR // ref of the shared metadata file
recipient: KEY // public key of the recipient contact
type: "READ" // type is always READ for now
},
```

### File Metadata [FM]

A file only has its own FM, if it is shared in a single file share.
The FM is stored in the path referenced as "meta" in the file object and encrypted
with a new symmetric key

```
{
owner: STR, // owner of the file
name: STR, // filename
spec_version: INT,  // version of the VOLUME spec
size: LONG, // uncompressed file size
mtime: LONG, // modification time as seconds since epoch
ctime: LONG, // change time as seconds since epoch
key: KEY, // symmetric key for the block
block: STR // path to the block without the prefix \<root\>/blocks/
}
```

### Objects

File:

```
{
name: STR, // object name,
size: LONG, // uncompressed file size
mtime: LONG, // modification time as seconds since epoch
ctime: LONG, // change time as seconds since epoch
meta: STR, // ref of the FM, if it exists in the format prefix/block
metakey: KEY, // symmetric key of the FM, if it exists
key: KEY, // symmetric key for the block
block: STR // path to the block without the prefix \<root\>/blocks/
},
```

Folder/Directory:

```
{
name: STR, // object name
key: KEY, // symmetric directory key
ref: STR, // ref of the metadata file that contains information about the folder
ctime: LONG // change time as seconds since epoch
},
```

External:

```
{
is_folder: BOOL, // indicates if external is a folder or a file
name: STR, // object name,
key: KEY, // symmetric directory key
owner: STR, // public key of the owner of that VOLUME
url: URL, // URL to the metadata file that contains information about the folder
},
```

### dk - Directory Key
The directory key is stored in the directory object of the parent folder, the index
DM is encrypted with the public key of the owner.

### fk - File Key
File keys are stored in the DM and the FM

### Qabel Identities
Identities have a public key **pub** and a private key **priv**

### Device ID
Each client device has a unique ID which is a random generated UUID **devID**

### Path to VOLUME/\<index\>
\<index\> is calculated from the sha256 of the prefix as salt and the owners private key `<index>=SHA-256(prefix||privK_A)`. Take the first 128bit of it
and format them like the canonical form of a UUID.
This means: 8-4-4-4-12 hexadecimal digits.
Example: e5cceedc-c222-d549-6211-1b6c684e0b2a

### Quota tracking
Quota tracking is done by AWS. The S3 service is configured to call an AWS Lambda method for each
s3:ObjectCreated and s3:ObjectRemoved in VOLUME/blocks. The Lambda method keeps track of the quota
by incrementing or decrementing the amount of used space saved in DynamoDB. The accounting server
then regularly requests all quota data and inserts it into his database. Clients can request
this information for their VOLUME by calling a REST method on the accounting server.


### Share notification drop message
The plaintext of the drop message is a JSON document with the url of the DM and the symmetric key. The payload_type for a share notification is `box_share_notification`.

```
{
	url: URL // url to the DM of the shared folder or the FM of the shared file
	key: KEY // symmetric key for the DM or FM
	msg: STR // optional message for the contact
}
```

### Unreachable shares

If a client cannot reach a share anymore because either the FM or DM does not exist anymore, or the client cannot decrypt the metadata file anymore, the share should be marked as invalid for the session. The user can then decide to delete the share.

### Updating shares

If the directory key of a shared FM or DM changes, the share becomes invalid. A new share notification drop message has to be sent.

### User to user messaging
Users can send chat messages to their contacts. Those messages are sent as drop messages with
a payload_type `box_message`. The payload itself is a JSON document.


```
{
	msg: STR // chat message
}
```

Chat messages should be persisted on the device to preserve a chat log.

## Initializing a new VOLUME

### Task

Initialize a new VOLUME without any objects

### Prerequisites

* Valid authentication token with write access to the VOLUME
* Device ID **devId0**

### Process

1. Create an empty DM

	```
	{
	path: STR, // prefix of the volume
	name: "index", // starting point of each VOLUME
	spec_version: 0,
	version: SHA-256(0x00 || **devId0**),
	last_change_by: **devId0**
	files: []
	folders: []
	externals: []
	}
	```
1. Encrypt the file with **priv0** and upload it to VOLUME/\<index\>


## Uploading a new file

### Task

Upload a new file "example.jpg" from the client to the folder VOLUME/examples/.

### Prerequisites

* Valid authentication token with write access to the VOLUME

### Process

1. Download VOLUME/\<index\> decrypt it with the users' private key **k0**
1. Find the folder "examples" in the index and retrieve the DM, decrypt it with the stored directory key **dk1**
1. Create a new symmetric key **fk0**
1. Encrypt the file with **fk0**
1. Generate a new UUID, this is the ref of the file
1. Upload the block to VOLUME/blocks/\<uuid\>, use the time from the server response as ctime
1. Insert the new object, including its **fk0**, into the metadata file, using the original file mtime in UTC as mtime, the original file size in bytes as size and the upload time as ctime
1. Set `last_change_by` to the user's device id
1. Encrypt the DM with **dk1** and upload it 


## Browsing a share and downloading a file

### Task

Starting with only a VOLUME path and a qabel identity, let the user browse the whole VOLUME.

### Prerequisites

* URL of the VOLUME
* Valid authentication token with read access to the VOLUME

### Process

1. Download VOLUME/\<index\> and decrypt it with the users' private key
1. Open the DM and show the directory listing to the user
1. If the user selects a directory or external share:
    1. Download the DM and decrypt it with the key stored in the parent DM
    1. Open the DM and show the directory listing to the user
1. If the user selects a file:
	1. Download the referenced block
	1. Read the symmetric file key **fk0** from the DM
	1. Decrypt the block with **fk0**


## Deleting a file

### Task

Delete a file on the user's VOLUME.

### Prerequisites

* URL of the VOLUME
* Valid authentication token with write access to the VOLUME

### Process

1. Download and decrypt the DM
1. Remove the file object from the DM, increment the version
1. Set `last_change_by` to the user's device id
1. Encrypt the DM and upload it, overwriting the old DM
1. Let the block server delete the block of the deleted file
1. If the file object has a reference to a FM, delete the FM


## Updating a file

### Task

Update an existing file on the users VOLUME.

### Prerequisites

* URL of the VOLUME
* Valid authentication token with write access to the VOLUME


### Process

1. Download and decrypt the DM
1. Upload the file in a new block with a new UUID and a new key
1. Update the file object in the DM with the new ref and key, increment the version
1. Set `last_change_by` to user's device id
1. Encrypt the DM and upload it, overwriting the old DM
1. Update the FM, if one exists
1. Let the block server delete the block of the deleted file

## Sharing a single file

### Task

Share a single file to one or more contacts

### Prerequisites

* Valid authentication token with write access to the VOLUME
* Contact info of the contacts
* DM of the parent folder

### Process

1. Create a new FM with the information from the DM
1. Encrypt it with a new directory key **dk1**
1. Insert the reference to the FM into the DM
1. Upload the FM and the DM
1. Insert the share info in the index DM and upload it
1. Notify the contacts about the new share with a drop message including **dk1** and the url of the FM

## Unsharing a single file

### Tasks
Remove a single file share to one or more contacts

### Prerequisites

* Valid authentication token with write access to the VOLUME
* DM of the parent folder

### Process

1. Update the share info in the index DM and upload it
1. Update or remove the FM:
    1. Remove the reference to the FM from the DM and upload the DM
    1. Delete the FM


# Handling conflicts
Conflicts can occour in the small timeframe between checking for changed DM and the
propagation delay after uploading the updated DM. A client has to check, after a reasonable delay,
if the changes were overwritten.

1. Download the DM after 10s
1. Check if the version is the same as in the uploaded file
1. If a change is detected, repeat the original operation and insert into the DM, set the device, increment the version
1. Upload the merged DM and repeat.

## Typical scenarios

Client A uploads the DM first, Client B overwrites the DM.

### Non conflicting changes

Scenario: Client A creates a new object and client B creates a new object, the object have different names.
Solution: Client A inserts the object into the updated DM and uploads it

### Conflicting changes

Scenario: Client A deletes a file, client B changes the file (which uploads a new block)
Solution: Client A accepts the change from client B

Scenario: Client A changes a file, client B deletes the file
Solution: Client A inserts the file again

Scenario: Client A changes a file, client B changes the same file
Solution: Client A inserts the local version of the file with a deconflicted name by adding 'CONFLICT' and the date and time as suffix
Example: foobar.txt and foobar\_CONFLICT\_2015-10-23_19:33:23.txt


# SQLite Schema

## Directory Metadata

Schema for the SQLite3 database which is used as a directory metadata file (DM).
The JSON documents can be directly translated into this schema.

```SQL
/*
The meta table includes the values
 * root (only needed in the index)
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
* 'id' is meaningless and only for record keeping purposes.
*/
CREATE TABLE version
(
       id               INTEGER PRIMARY KEY,
       version          BLOB NOT NULL,
       time             LONG NOT NULL
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
       type             INTEGER NOT NULL
);

/*
Table of all file objects in the directory
* 'id' is meaningless and only for record keeping purposes.
* 'block is the name of the block which stores the data
* 'name' is the file name
* 'size' is the file size in bytes
* 'mtime' is the modification timestamp
* 'ctime' is the change timestamp
* 'key' is the symmetric file key
* 'meta is the ref of the FM, if one exists
* 'metakey' is the symmetric key of the FM, if one exists
*/
CREATE TABLE files
(
       block            VARCHAR(255) NOT NULL,
       name             VARCHAR(255) PRIMARY KEY,
       size             LONG NOT NULL,
       mtime            LONG NOT NULL,
       ctime            LONG NOT NULL,
       key              BLOB NOT NULL,
       meta             VARCHAR(255),
       metakey          BLOB
);

/*
Table of all folder objects in the directory
* 'id' is meaningless and only for record keeping purposes.
* 'ref' is the name of the metadata file
* 'name' is the folder name
* 'ctime' is the change timestamp
* 'key' is the symmetric directory key
*/
CREATE TABLE folders
(
       ref              VARCHAR(255) NOT NULL,
       name             VARCHAR(255) PRIMARY KEY,
       key              BLOB NOT NULL,
       ctime            LONG NOT NULL
);

/*
Table of all external objects in the directory
* 'id' is meaningless and only for record keeping purposes.
* 'is_folder' indicates if external is a folder or a file
* 'owner' is the public key of the owner
* 'name' is the share name
* 'key' is the symmetric directory key
* 'url' is the url of the metadata file
*/
CREATE TABLE externals
(
       is_folder       BOOLEAN NOT NULL,
       owner           BLOB NOT NULL,
       name            VARCHAR(255) PRIMARY KEY,
       key             BLOB NOT NULL,
       url             TEXT NOT NULL
);

```

## File Metadata

Schema for the SQLite3 database which is used as a file metadata file (FM).

```SQL
/*
A one row table with only the current qabel-box specification version.
This version is 0 for now and should be checked everytime the databases is opened.
*/
CREATE TABLE spec_version
(
       version          INTEGER PRIMARY KEY
);

/*
Table for the file information
* 'id' is meaningless and only for record keeping purposes.
* 'owner' is the public key of the owner
* 'block is the name of the block which stores the data
* 'name' is the file name
* 'size' is the file size in bytes
* 'mtime' is the modification timestamp
* 'ctime' is the change timestamp
* 'key' is the symmetric file key
*/
CREATE TABLE files
(
       id               INTEGER PRIMARY KEY,
       owner            BLOB NOT NULL,
       block            VARCHAR(255) NOT NULL,
       name             VARCHAR(255) NOT NULL,
       size             LONG NOT NULL,
       mtime            LONG NOT NULL,
       ctime            LONG NOT NULL,
       key              BLOB NOT NULL,
);

```
