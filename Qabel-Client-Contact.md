# Contact Specification

## Abstract

A common exchange format for rich contact data.

## Scheme

Um Kontaktdaten zu weiterzugeben und auf dem Laufenden zu halten werden Contact-Cards verwendet. Diese Dateien werden komprimiert und verschlüsselt auf einen Cloud-Server gelegt und andere Clients mit Download-Adresse und Schlüssel informiert.

Die Karten sind ein JSON String von Einträgen und Listen. Einträge soweit *(bei Bedarf sofort erweitern)*:

* Vorname (Given Name)
* Nachname (Surname)
* Spitzname (Alias)
* Telefonnummern
** Nummer
** Typ
* Bild
* Drop-Adresse
* Public-Key
