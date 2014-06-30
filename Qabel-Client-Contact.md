# Contact Specification

## Abstract

A common exchange format for rich contact data.

## Scheme

Um Kontaktdaten zu weiterzugeben und auf dem Laufenden zu halten werden Contact-Cards verwendet. Diese Dateien werden komprimiert und verschlüsselt auf einen Cloud-Server gelegt und andere Clients mit Download-Adresse und Schlüssel informiert.

Die Karten sind ein JSON String von Einträgen und Listen. Einträge soweit *(bei Bedarf sofort erweitern)*:

The following items are fixed for all contacts and will be handled from the core
* id (id of the contact (random number))
* updated (last update of the contact)
* created (Contact creation date)
* deleted (deleted time -> after a time x the entry will be deleted)                        
* alias (alias of the contact)
* public_key (public key to encrypt drop message)
* inbox (inbox of the contact)
* forename (first name of the user)
* surname (last name of the user)
* my_id (the id of the identity which own this entry)

Other items can be added but will not be handled from the core but needed from the modules.

The name of the file in the config and the record name in the contact collection on the FFsync are the id of the identity. 

## JSON structure

        Contacts        = "{"
                        'contacts' : contacts
                        "}"

        contacts        = "["
                        contact*
                        "]"

        contact         = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,                        
                        'alias' : NAME,
                        'public_key' : KEY,
                        'inbox' : ID,
                        'my_id' : ID,
                        'forename' : STR,
                        'surname' : STR
                        "}"