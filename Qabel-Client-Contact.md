# Contact Specification

**THIS PAGE IS OBSOLETE** - https://github.com/Qabel/intern-doc/issues/42
***

## Abstract
A common exchange format for rich contact data.

**This is NOT about the data stored in the client but about an EXCHANGE format i.e. "business cards"**

## Scheme

Um Kontaktdaten zu weiterzugeben und auf dem Laufenden zu halten werden Contact-Cards verwendet. Diese Dateien werden komprimiert und verschlüsselt auf einen Cloud-Server gelegt und andere Clients mit Download-Adresse und Schlüssel informiert.

Die Karten sind ein JSON String von Einträgen und Listen. Einträge soweit *(bei Bedarf sofort erweitern)*:

* Given name (first names of the contact)
* Surname (last name of the contact)
** (Note: these could be grouped or concatenated to a single field)
* Nickname (self assigned alias)
* Phone
** Number
** Kind (e.g. "home", "office", ...)
* Picture
* Drop-Address
* Public-Key

## JSON structure

        "{"
        'name'    = "{"
                'given name': STR,
                'surname': STR,
                'nickname': STR
        "}"
        'phone'    = "{"
                'number': INT,
                'kind' : STR
        "}"
        'picture' : DATA,
        'drop_url' : URL,
        'public_key' : KEY
        "}"