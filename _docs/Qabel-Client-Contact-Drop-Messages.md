---
title: Client Contact DropMessages
---
# Contact Specification **[To be reviewed]**

## Contacts

The item has one sub item

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
* alias (alias for the contact)
* email (email address for the contact, optional)
* phone (phone number for the contact, optional)
* public_key (public key of the contact)
* my_identity ([key id](../Components-Crypto#key-identifier/) of the public key of the identity which owns this contact)
* drop_urls (array of drop urls)
* <a name="module_data"> </a> module_data (object of objects of module-defined data structures)

Summary

    contact         = "{"
                    'id': INT,
                    'alias': NAME,
                    'email': STR,
                    'phone': STR,
                    'keys' :
                             "{"
                             'public_key' : KEY,
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
  "alias": "Alice",
  "email": "alice@example.org",
  "phone": "+49123456789012",
  "public_key" : "feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
  "my_identity" : "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a",
  "drop_urls" : ["example.org/jkl"],
  "module_data" : { "person" : { "mail_address" : "example@example.org" } }
}
```
