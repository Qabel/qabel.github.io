---
title: "Protocol: box"
---
# Box Specification

## Abstract

A set of protocols to store files and folders on a VOLUME that is on AWS S3 and managed by a third party who doesn't need to be trusted.

## Used services

Qabel Box uses an Accounting server which controls the access to AWS S3. Every client who needs write access has to be authenticated by the server and then receives a set of credentials for direct access to the VOLUME.
Qabel Box also directly uses AWS S3 to store the blocks and metadata.

## Accounting server

The accounting server controls write access to the S3 bucket. Registered users (not identities!) can request temporary credentials for AWS.
All data is sent as JSON and UTF-8.

### Required permissions for the AWS user
The accounting server uses an AWS user to create the temporary credentials. He must have the following permissions:

* "sts:GetFederationToken" to generate the credentials
* "s3:GetObject" for read access
* "s3:PutObject" for uploading
* "s3:DeleteObject" for deleting
* "s3:ListBucket" is used to find unreferenced files (not implemented)

These permissions should only be granted for the Qabel box S3 bucket.

### Login
The login method grants a new authentication token.

* Ressource: /api/v0/auth/login
* Method: POST
* Request data: `{username: STR, password: STR}`
* Response data: `{key: STR}`

The authentication token is used by including the header "Authorization" with the value "Token " concatenated with the key.

For example: `Authorization: Token 70373def6f3766ab1782700cba4404`

For every method except login, this authorization header is required.

### Token
The token ressource controls the federation token.

* Ressource: /api/v0/token
* Method: POST
* Request data: None
* Response data: `{AccessKeyId: STR, SecretAccessKey: STR, SessionToken: STR}`

### Prefix
The prefix ressource controls all prefixes of the user. All prefixes are fully qualified URLs.

Create a new prefix:

* Ressource: /api/v0/prefix
* Method: POST
* Request data: None
* Response data: `{prefix: STR}`

Get a list of available prefixes

* Ressource: /api/v0/prefix
* Method: GET
* Request data: None
* Response data: `{prefixes: [STR]}`

## Structure of a VOLUME

A Volume consists of metadata files and blocks. Every VOLUME has a metadata file at VOLUME/\<index\> which is the starting point and contains references to other objects. All file names on S3 are UUIDs.

All mtime values are seconds since epoch in UTC. Blocks are stored at VOLUME/blocks/.

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
{ ref:"8f5da4db-02ab-ca96-1824-3ba8d18a85be",
  recipient: "fgah28991273814c9123987124f009893043ef75a0dbf3f4eba4a98eaa9b4e6a",
  type: "READ"}
],
files: [
{ name: "foobar.jpg", size: 6203434, mtime: 1445432325,
meta: null,
key: "b43feebe528a56bb4f21ef3a8a617714aee2cabc0708c1702a98915ae852ad06",
ref: "0846C7C6-77F1-11E5-B21E-9CFF64691233",
},
{ name: "barfoo.txt", size: 4568, mtime: 1445432120,
meta: "a9c6ce30-418b-e292-83bc-769a8c72f600",
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


```
{
root: STR, // URL of the VOLUME, only in the index file
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
name: STR, // filename
spec_version: INT,  // version of the VOLUME spec
size: LONG, // uncompressed file size
mtime: LONG, // modification time as seconds since epoch
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
meta: {ref: STR, // path to the FM, if it exists
       key: KEY} // symmetric key for the FM
key: KEY, // symmetric key for the block
block: STR // path to the block without the prefix \<root\>/blocks/
},
```

Folder/Directory:

```
{
name: STR // object name,
key: KEY // symmetric directory key
ref: STR // ref of the metadata file that contains information about the folder
},
```

External:

```
{
name: STR, // object name,
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
The plaintext of the drop message is a JSON document with the url of the DM and the symmetric key.

```
{
	url: STR // url to the DM of the shared folder or the FM of the shared file
	key: KEY // symmetric directory key
}
```

## Initializing a new VOLUME

### Task

Initialize a new VOLUME without any objects

### Prerequisites

* Valid federation token with write access to the VOLUME
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

* Valid federation token with write access to the VOLUME

### Process

1. Download VOLUME/\<index\> decrypt it with the users' private key **k0**
1. Find the folder "examples" in the index and retrieve the DM, decrypt it with the stored directory key **dk1**
1. Create a new symmetric key **fk0**
1. Encrypt the file with **fk0**
1. Generate a new UUID, this is the ref of the file
1. Upload the block to VOLUME/blocks/\<uuid\>, note the "Date" header from the response and use it as mtime
1. Insert the new object, including its **fk0**, into the metadata file, using the mtime from the response and the original file size in bytes as size
1. Set `last_change_by` to the user's device id
1. Encrypt the DM with **dk1** and upload it 


## Browsing a share and downloading a file

### Task

Starting with only a VOLUME path and a qabel identity, let the user browse the whole VOLUME.

### Prerequisites

* URL of the VOLUME

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
* Valid federation token with write access to the VOLUME

### Process

1. Download and decrypt the DM
1. Remove the file object from the DM, increment the version
1. Set `last_change_by` to the user's device id
1. Encrypt the DM and upload it, overwriting the old DM
1. Delete the block of the deleted file on S3
1. If the file object has a reference to a FM, delete the FM


## Updating a file

### Task

Update an existing file on the users VOLUME.

### Prerequisites

* URL of the VOLUME
* Valid federation token with write access to the VOLUME


### Process

1. Download and decrypt the DM
1. Upload the file in a new block with a new UUID and a new key
1. Update the file object in the DM with the new ref and key, increment the version
1. Set `last_change_by` to user's device id
1. Encrypt the DM and upload it, overwriting the old DM
1. Update the FM, if one exists
1. Delete the block of the deleted file on S3


## Sharing a directory

### Task

Share a directory recursively to one or more contacts

### Prerequisites

* Path and directory key
* Valid federation token with write access to the VOLUME
* Contact info of the contacts


### Process

1. Insert the share info in the index DM, increment the version, set the device id, encrypt and upload it
1. Notify the contacts about the new share with a drop message.


## Unsharing a directory

### Task

Remove a share to one or more contacts

### Prerequisites

* Path and directory key
* Valid federation token with write access to the VOLUME
* Public keys **pub1** of the contacts


### Process

1. Remove the contacts' public keys from the share info of the folder in the index DM, set the device id and increment the version
1. Download recursively all DM
1. Upload an archive of all those DM with the name "backup_" + ref in the root directory (as a file object).
1. Delete recursively all DM from the share (See [Delete Multiple Objects](https://docs.aws.amazon.com/AmazonS3/latest/API/multiobjectdeleteapi.html) )
1. Wait until the deletion has propagated, check the progress by issuing HEAD requests for the files.
1. Create a new **dk*** for each DM in the share and insert them in their parents
1. Upload all the new DM, encrypted with their new **dk***, depth first
1. Check every uploaded DM with HEAD requests to ensure that no conflicts occurred.
1. Insert the new **dk*** into the parent directory of the share and upload the DM
1. Remove the backup file from the root directory
1. Send the new **dk*** of the share to all remaining contacts


## Sharing a single file

### Task

Share a single file to one or more contacts

### Prerequisites

* Valid federation token with write access to the VOLUME
* Contact info of the contacts
* DM of the parent folder

### Process

1. Create a new FM with the information from the DM
1. Encrypt it with a new directory key **dk1**
1. Insert the reference to the FM into the DM
1. Upload the FM and the DM
1. Insert the share info in the index DM and upload it
1. Notify the contacts about the new share with a drop message including **dk1**


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

Schema for the SQLite3 database which is used as a directory metadata file (DM). The schema for
an FM will be included later.
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
* 'key' is the symmetric file key
*/
CREATE TABLE files
(
       id               INTEGER PRIMARY KEY,
       block              VARCHAR(255) NOT NULL,
       name             VARCHAR(255) NOT NULL,
       size             LONG NOT NULL,
       mtime            LONG NOT NULL,
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
