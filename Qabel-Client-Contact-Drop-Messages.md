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

* public_enc_key (public key to encrypt drop message)
* public_sign_key (public key to verify drop message signatures)
* my_identity ([key id](https://github.com/Qabel/qabel-doc/wiki/Components-Crypto#key-identifier) of the public key of the identity which owns this contact)
* drop_urls (array of drop urls)
* <a name="module_data"> </a> module_data (object of objects of module-defined data structures)

Summary

    contact         = "{"
                    'public_enc_key' : KEY,
                    'public_sign_key' : KEY,
                    'my_identity' : STR,
                    'drop_urls' : [STR],
                    'module_data' : { STR : { ... }, ... }
                    "}"

### Example

```json
{
"public_enc_key" : "asd",
"public_sign_key" : "yxc",
"my_identity" : "12794c25db999ab",
"drop_urls" : ["example.org/jkl"],
"module_data" : { "person" : { "mail_address" : "example@example.org" } }
}
```
