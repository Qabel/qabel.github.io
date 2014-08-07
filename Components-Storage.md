# The storage component
## Abstract
The storage component is a core component of Qabel. It provides the functionalities for:

* writing to Qabel Storage Volume
* reading from Qabel Storage Volume
* deleting from Qabel Storage Volume

## Server and Protocol Design

### Paradigm

* Servers are universal and lightweight.
* Simple server via HTTP/REST.

## Encryption

The messages and direct meta data are encrypted by the client. The client has full power over the choosing of the cipher. It can decide wheather it should use symmetrically or asymmetrical encryption depending on the usecase.

The content of the communication should not reach the outside. Blobs that are uploaded and stored are completely encrypted. The server cannot make assumptions over the structure or even the content.

## Authentication

The server provides four different keys to provide different levels of access:

* ```public```: A token to locate the Storage Volume on the Storage Server. This data can be available publicly as it only allows access to the encrypted information
* ```token```: This token is stored by the server and all clients which are allowed to write to the client. The server checks wheather the token provided by the client matches the token of a Storage Volume. If both token match, the client is allowed to upload data to the Storage Volume.
* ```revoke_token```: This token is only stored by clients which are allowed to delete the Storage Volume. These clients are usually owners of the storage volume.
* ```cipher_key```: These information are mandatory to read the data one has received using the ```public``` key. The kind of this data is determined by the used cipher. Neither the used cipher nor the cipher_key must ever be send to the server.

## Sharing

### Example

Alice want to share a file to Bob. Alice provides the public information and the cipher_key of this file to Bob through a third party (mostly, this will be the DropServer). Bob can use this information to access the file readonly. If Bob wants to make changes to the file, he clones it to a storage which he has write access to. Then Bob makes his changes and shares the file back to Alice.