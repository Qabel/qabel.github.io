---
title: Client Contact DropMessages
---
# Contact Specification

## Contacts

The item has one sub item
* contacts

Summary

    Contacts        = "{"
                    'contacts' : contacts
                    "}"

### Contacts

The item "contacts" includes an array of "contact"s

Summary

    contacts        = "["
                    contact*
                    "]"

### Contact

The following items define a contact item:

* id (unique identifier)
* updated, created, deleted (timestamp in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15) |
* public_primary_key (public key to verify sub-key signatures)
* public_enc_key (public key to encrypt drop message)
* public_sign_key (public key to verify drop message signatures)
* my_identity ([key id](../Components-Crypto#key-identifier/) of the public key of the identity which owns this contact)
* drop_urls (array of drop urls)
* <a name="module_data"> </a> module_data (object of objects of module-defined data structures)

Summary

    contact         = "{"
                    'id': INT,
                    'updated': LONG,
                    'created': LONG,
                    'deleted': LONG,
                    'keys' :
                             "{"
                             'public_primary_key' : KEY,
                             'public_enc_key' : KEY,
                             'public_sign_key' : KEY
                             "}",
                    'my_identity' : STR,
                    'drop_urls' : [STR],
                    'module_data' : { STR : { ... }, ... }
                    "}"

### Example

```json
{
  "id": INT,
  "updated": 1422605430969,
  "created": 1422605430969,
  "deleted": 0,
  "public_enc_key" : "asd",
  "public_sign_key" : "yxc",
  "my_identity" : "12794c25db999ab",
  "drop_urls" : ["example.org/jkl"],
  "module_data" : { "person" : { "mail_address" : "example@example.org" } }
}
```
