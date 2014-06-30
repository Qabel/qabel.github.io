# Storage Specification

## Abstract

A protocol for read, write and delete access to bulk (cloud) storage.

## Client-Zugriff (Storage)

### Lesen

Über HTTP-GET. Soweit nötig mit Token / Basic-Auth oder entsprechend.

Als application/octect-stream.

Dateisystem ist hier nicht nötig, alle Operationen sind isoliert und ohne Zusammenhang.
Es werden *alle* User ihre Dateien zerstueckelt und verschluesselt auf den Server werfen und dieser wird keine Listen oder Aehliches erstellen.
Der Client weisz welche Datei er sich runterladen muss um die Daten wieder zusammenzusetzen. Zum Beispiel über enthaltene Header/Indexe.

Dateien sind *write-once* und *immutable*.

* Authentifizierung per OAuth oder Standard Basic access Authentication
OAuth.
Token requesten.
Bekommen oder auch nicht.
Infos holen.

Ich dachte an OAuth da man Tokens die User1 fuer User2 erzeugt fuers sharing nutzen kann.
Mit der Pointer auf Pointer Indexdateimethode werden Tokens wohl sinnlos.
Es gibt kein Sharing auf Cloud-Storage Ebene. Keine Berechtigungsverwaltung, keine Versionen.

Antworten kommen auch optional per JSON (wofür nötig? evtl. Quota?)

### Schreiben

Über HTTP-POST. Mit Token / Basic-Auth oder entsprechend.

Als application/octect-stream.

* Auth
Siehe Lesen.
