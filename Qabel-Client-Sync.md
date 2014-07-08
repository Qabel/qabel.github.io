# FFSync sequence diagram
[[images/af_wiki_seq_ffsync_20140625110400.png]]
# FFSync web requests
## Prerequisites
* **Username** The FFSync Username is an E-Mail Address
* **Encoded Username** The encoded username is used in web requests. You get the encoded username from the normal username in two easy steps:
 1. Build the SHA1 checksum from the username
 2. Convert the SHA1 checksum into an BASE32 encoded string
* **FFSync Server Address** The FFSync server address e.g. _http://server:port/_

## Requests

### Check if user exists
`RESP = http.get("http[s]://SERVER:PORT/user/1.0/ENCODED_USERNAME/node/weave")`

FFSync Response codes:
* **0** User doesn't exist
* **1** User exists

_This request is maybe not used in later implementations._

### Create User
`PUT_Data = '{"captcha-challenge": null,"captcha-response": null,"email": "MAIL","password": "PLAINTEXT_PASS"}"`

`RESP = http.put("http[s]://SERVER:PORT/user/1.0/ENCODED_USERNAME", PUT_Data)`

`if(RESP == ENCODED_USERNAME) {//Success}`

### Get Node
The node is used for later requests instead the initial Server:Port combination. On this way we can get a simple way of load balancing.

`NODE = http.get("http[s]://SERVER:PORT/user/1.0/ENCODED_USERNAME/node/weave")`

## Default response codes
[Source Document](https://docs.services.mozilla.com/respcodes.html)
* **1** Illegal method/protocol
* **2** Incorrect/missing CAPTCHA
* **3** Invalid/missing username
* **4** Attempt to overwrite data that can’t be overwritten (such as creating a user ID that already exists)
* **5** User ID does not match account in path
* **6** JSON parse failure
* **7** Missing password field
* **8** Invalid Weave Basic Object
* **9** Requested password not strong enough
* **10** Invalid/missing password reset code
* **11** Unsupported function
* **12** No email address on file
* **13** Invalid collection
* **14** (1.1 and up) User over quota
* **15** The email does not match the username
* **16** Client upgrade required

# FFSync documentation
https://docs.services.mozilla.com/sync/index.html

# Differences in the implementation
## Old Qabel version
* Only one collection is used (the collection is named "collection")
* Key Bundles are not used (the crypto key, wich is used in the collection is saved in the local Qabel config)
* Every config section is saved in a different record

## New Qabel version
* Every config section wich contains objects gets an own collection (eg. accounts, drop servers)
* Key bundles are used (the crypto key is saved in the Qabel Config)