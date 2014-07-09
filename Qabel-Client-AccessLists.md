# Access List Specification

## Abstract

A share may be read or edited by a group of members (new revisions / update)
The permission list should define which members are allowed to make updates.

## List

The list a JSON-Object with the following members:

* an array of members with read-access (this has only informational character as the encrypted data are always world readable.)

* an array of members with read/write access: a member of this group can create and announce new revisions. New revisions from any member not part of this group will be dropped

* an array of members with admin access: those members can define new members of this group.

***


### Gegenvorschlag

Anstatt einer Liste mit Arrays, auf denen wir Linear Suchen müssen, definieren wir ein Object, welches als Keys die benutzerID und als Wert ein membership objekt definiert. Also wie folgt:

```javascript
{
  "members": {
    "550e8400-e29b-11d4-a716-446655440000": {
      can_read: true,
      can_write: true,
      is_admin: false,
      ...
    }
  }
}
```

Vorteile:
* Statt einer Linearsuche bei normalen Arrays können wir hier bei Objekten mit O(1) zugreifen
* Zusätzliche Metainformationen, nämlich in welcher Reihenfolge die Benutzer sich anmelden, müssen nicht verschleiert künstlich durch ein shuffle verschleiert werden, sondern sind der Datenstruktur schon inherent.
* Menschenlesbar
* Bei Bedarf ist dieses Format einfacher zu erweitern.

Nachteile:
* höherer Speicherverbrauch

***

Weiterhin noch:

* Ersteller der Liste
* HMAC vorhergehender Listen (soweit vorhanden)

Die Teilnehmer werden durch ihre Public-Keys indentifiziert.

Die Liste wird im Public-Key-Verfahren unterschrieben (mit dem Key des Erstellers oder eines als Administrator Berechtigten).
Änderungen bilden damit eine lückenlos nachprüfbare Kette.