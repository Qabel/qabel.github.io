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

* public_key (public key to encrypt drop message)
* my_id (the id of the identity which owns this entry)
* drop_urls (array of drop urls)
* module_data (object of objects of module-defined data structures)

Summary

    contact         = "{"
                    'public_key' : KEY,
                    'my_identity' : KEY,
                    'drop_urls' : [STR],
                    'module_data' : { STR : { ... }, ... }
                    "}"