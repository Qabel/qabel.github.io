# Access List Specification

## Abstract

A share may be read or edited by a group of members (new revisions / update)
The permission list should define which members are allowed to make updates.

## List

The list a JSON-Object with the following members:

* an array of members with read-access (this has only informational character as the encrypted data are always world readable.)

* an array of members with read/write access: a member of this group can create and announce new revisions. New revisions from any member not part of this group will be dropped

* an array of members with admin access: those members can define new members of this group.

Weiterhin noch:

* Ersteller der Liste
* HMAC vorhergehender Listen (soweit vorhanden)

Die Teilnehmer werden durch ihre Public-Keys indentifiziert.

Die Liste wird im Public-Key-Verfahren unterschrieben (mit dem Key des Erstellers oder eines als Administrator Berechtigten).
Änderungen bilden damit eine lückenlos nachprüfbare Kette.
