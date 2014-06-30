# Browse Specification

## Abstract

An open directory to facilitate search and lookup of public key data.
Search is opt-in and data is sealed with public key scheme.

## Scheme

Zum Kennenlernen der Clients untereinander:

* Es werden in einem Server ein Public-Key und Drop-Adresse unter einem Namen hinterlegt.
* Der Eintrag ist gesichert mit Fingerprint.
* Abrufbar z.B. als http://qabel.me/chrzuck#ab4c2x2yz3

Der Drop und der Public-Key werden nur lesend vom Besitzer verwendet. Es soll keine weitere Verfolgung der Kommunikation möglich sein.

Vorgehen zum Adden: Ein Client ruft Public-Key und Drop-Adresse aus der Lookup-URL ab. Dann prüft er den Fingerprint (wird nie an Server übermittelt!).
Client schickt eine Kontakt-Nachricht, verschlüsselt mit diesem Key an diesen Drop.
Die Nachricht beinhaltet seine Parameter wie Public-Key, Drop, persönlicher Nachricht oder eine Visitenkarten-URL.

## Server

* Der Server soll Abfrage sowie Erstellen / Update mit Passwort anbieten.
* Das Datenformat der Einträge ist JSON.
* Wenn ein Browser die Adresse anfragt (und kein JSON will) dann eine hübsche "Der User 'X' verwendet Qabel / hier runterladen" Seite zeigen.

## Verzeichnis-Server

Es kann (für Business-Variante) eine Suchfunktion zu Stichwörter möglich sein. Aber dann fehlt die Sicherung durch Fingerprint.
