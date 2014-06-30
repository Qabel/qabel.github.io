# Share Specification

## Abstract

A structured format for file data.

## Terminology

Ein Share ist das Konzept eines Ordners welchen der Benutzer zum Backup oder Teilen freigegeben hat.
Der Share-Pfad ist das Verzeichnis mit der lokalen Kopie der Share.

Eine Version ist eine komplette Kopie des Ordners die auf einen Block-Storage hochgeladen wird oder von dort runtergeladen wird.

### Metadaten

Ein Client der einen Share verwendet (als Ersteller oder Teilnehmer) muss einmalig speichern:

* den Share-Pfad (das freigegebene Verzeichnis) -- Achtung wird auf verschiedenen Clients des gleichen Benutzers individuell sein.
* die aktuelle Berechtigungsliste

Der Client kann die Versionen als Datei(-download) cachen. Er muss sich Metadaten zu Versionen speichern wie er sie aus einer Drop-Nachricht empfangen oder für eine solche erstellt hat:

* die öffentliche URL, ggf. öffentliches User/Password
* den Schlüssel

Hat der Client die Version selbst erstellt zusätzlich:

* den verwendeten Provider (im Providereintrag sind Basis-URLs und Authentifikation hinterlegt)
* ggf. eine private ID oder Pfad für die Version (zum späteren Löschen)
