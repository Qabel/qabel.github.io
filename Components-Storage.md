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

The messages and direct meta data are encrypted by the client. The client has full control over the selection of ciphers. It can decide whether it should use symmetrical or asymmetrical encryption depending on the use case.

The content of the communication should not reach the outside. Blobs that are uploaded and stored are completely encrypted. The server cannot make assumptions over the structure or even the content.

## Authentication

After [[creating a new Storage Volume|Qabel-Protocol-Storage]], the server provides three different tokens to regulate access:

* ```public```: A token to identify the Storage Volume on the Storage Server. This data can be safely published as it only allows read access to the encrypted information.
* ```token```: This token is stored by the server and all clients which are allowed to write to the Storage Volume. The server checks whether the token provided by the client matches the token of a Storage Volume. If both token match, the client is allowed to upload data to the Storage Volume.
* ```revoke_token```: This token is only stored by clients which are allowed to delete the Storage Volume. These clients are usually owners of the storage volume.

Tokens provided by the uploading user: (TODO Remove this?)
* ```cipher_key```: This information is required to read the data one has received using the ```public``` key. The format of this data is determined by the used cipher. Neither the used cipher nor the cipher_key must ever be sent to the server.


## Sharing

### Example 1

Alice wants to share a file with Bob. Alice provides the public information and the cipher_key of this file to Bob through a third party (mostly, this will be the drop server). Bob can use this information to access the file read-only. If Bob wants to make changes to the file, he modifies his local copy and re-uploads the result to a new storage volume. Bob then grants access to Alice by sending her the public and the cipher_key of the newly created storage volume.

### Example 2
Alice again wants to share a file with Bob and this time wants direct write permissions for Bob. Therefore, Alice not only sends Bob the public and cipher_key for
her storage volume but also the secret token. Possessing this token, Bob can modify the storage volume just as Alice can do.
