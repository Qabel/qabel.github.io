# Access List Specification

## Abstract

Ein Share kann von Teilnehmergruppe gelesen und auch verändert werden (neue Versionsstände / Update).
Die Berechtigungsliste soll verbindlich vereinbaren welche Teilnehmer zu Updates berechtigt sind.

## Liste

Die Liste ist ein JSON-Objekt mit folgenden Bereichen:

* Teilnehmer mit Leseerlaubnis (nur zur Vollständigkeit, kann nicht durchgesetzt werden)
* Teilnehmer mit Schreiberlaubnis: diese Teilnehmer können neue Versionen erstellen und bekanntgeben. Neue Versionen von anderen Teilnehmern werden verworfen.
* Administratoren: Teilnehmer die diese Liste ändern dürfen.

Weiterhin noch:

* Ersteller der Liste
* HMAC vorhergehender Listen (soweit vorhanden)

Die Teilnehmer werden durch ihre Public-Keys indentifiziert.

Die Liste wird im Public-Key-Verfahren unterschrieben (mit dem Key des Erstellers oder eines als Administrator Berechtigten).
Änderungen bilden damit eine lückenlos nachprüfbare Kette.
