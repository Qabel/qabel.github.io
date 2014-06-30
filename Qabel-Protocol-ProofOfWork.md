# Proof Of Work Specification

## Abstract

A Spam and Denial of Service countermeasure. Reduce the capability of each single clients to flood the server with messages.

## Scheme

* Nach stochastischem Verfahren oder wenn der Server verdächtige Verbindungen erkennt eine Flood-Control durchführen.
* Client könnte auch bei jeder Anfrage eine Berechnung basierende auf Parametern und Datum/Zeit liefern.

##  Protocol

* Server schickt "X-Proof-Of-Work-Required"-Header mit Liste unterstützter Verfahren und Parametern
* Client rechnet Hash zu Collision zurück und fragt mit Ergebnis als "X-Proof-Of-Work"-Header neu an.

## Current Implemention

* Verfahren ist PBKDF2.
** Algorithmus ist recht einfach z.B. auf SHA1 aufgebaut.
** Ähnlich als "Hashcash":https://en.wikipedia.org/wiki/Hashcash in Bitcoin
