# Storage Specification

## Abstract

A protocol for read, write and delete access to bulk (cloud) storage.

## Protocol

### URLs

The URL to access a Qabel Storage Volume can be split into four parts:
* the transport protocol: https and http are supported. https is the recommended protocol.
* the service address: Host and port specification of the service. In the following SERVER.
* the service prefix: This is a prefix for all Qabel related URLs on this server. This way to multiplex services sharing the same service address. In the following PREFIX.
* identifier of a Storage Volume (in the following PUBLIC) or "_new" for a creation request.

In [BNF](http://www.w3.org/Addressing/URL/5_BNF.html) [notation](http://www.w3.org/Notation.html) of the W3C:

`dropurl ::= protocol "://" serviceaddress servicepath "/" id`

1. protocol ::= "https" | "http"
2. serviceaddress ::= serveraddress ( ":" serverport ) ?
   1. serveraddress ::= IPv4 | IPv6 | DNSName
   2. serverport ::= "1" - "65535"
3. servicepath ::= "/" [ URLChars, "/" ] *
4. public ::= *friendlybase64char
   1. friendlybase64char ::= [ "A" - "Z", "a" - "z", "0" - "9", "-", "_" ]

Example:
`https://qabelserver:8000/qabel-storage/8043810841`

### Create a new Qabel Storage Volume

* HTTP-Method: POST or PUT
* URL Example: https://server/prefix/_new
* URL Scheme: http[s]?://[:SERVER:][:PREFIX:]/_new

This creates a new Qabel Storage Volume with it's own write- and revoke-tokens. These values are returned to the user by a JSON document sent back to this request:

```
{
"public": String,       // public token for read access
"revoke_token": String, // private token for deleting the storage
"token": String         // secret token to allow write access
}
```
The fields are described as follows:

* ```public```: the public token which is sent as part of the URL. so if your public token is ```123456790```, the URL to access this token will be ```http://server/prefix/1234567890```
* ```revoke_token```: this token is needed to delete a Qabel Storage Volume with all it's contents. This token should never be public or given to any untrustworthy authority. See section deletion.
* ```token```: this token is needed to do any updates on the Qabel Storage Volume. See section upload.

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | Storage Volume successfully created |


### Uploading new Blobs

* HTTP-Method: POST or PUT
* URL Example: https://foo:abcdef012346789@server/prefix/1223456789/CHUNK
* URL Scheme: http[s]?://.*:[:TOKEN:]@[:SERVER:][:PREFIX:]/[:PUBLIC:]/[:CHUNKNAME:]

This method requires autorization through the token which is returned by the request described in "Create a new Qabel Storage Volume". The server supports HTTP-basic auth. https is strongly encouraged (most servers should not accept http here anyway.)

The body of the http request will be safed to the chunkname and can later be accessed via a get request under this URL.

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 400 | Storage Volume ID is missing or invalid |
| 200 | Chunk successfully uploaded |


### Deleting a Qabel Storage Volume

* HTTP-Method: DELETE
* URL Example: https://foo:abcdef012346789@server/prefix/1223456789
* URL Scheme: http[s]?://.*:[:REVERT_TOKEN:]@[:SERVER:][:PREFIX:]/[:PUBLIC:]/

This method requires autorization through the revert_token which is returned by the request described in "Create a new Qabel Storage Volume". The server supports HTTP-basic auth. https is strongly encouraged (most servers should not accept http here anyway.)

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 400 | Storage Volume ID is missing or invalid |
| 200 | Storage Volume successfully deleted |
