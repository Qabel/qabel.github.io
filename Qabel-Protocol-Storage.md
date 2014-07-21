# Storage Specification

## Abstract

A protocol for read, write and delete access to bulk (cloud) storage.

## Protocol

### URLs

The URL to access a qabel storage server can be split into four parts. Consider this URL for example:

https://qabelserver:8000/qabel-storage/8043810841

This URL consists of the following parts:

* https:// - the transport protocol, https and http are supported. https is the recommended protocol. In the following documentation this part will be referenced by "https://"
* qabelserver:8000 - the host-spec, it consists of the servers name and servers port. In the following documentation this part will be referenced by "server"
* /qabel-storage - the prefix: This is a static prefix for all qabel related URLs on this server. This way a qabel-storage can share its http-port with other http-services. Empty string as prefix are explicitly allowed. In the following documentation this part will be referenced by "/prefix".
* /8043810841 - the qabel-specific URL. This represents the actual path for qabel-storage functionality.

### Create a new Storage

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

