# Blocks Specification

## Abstract

Die Blocks-Spezifikation beschreibt ein Speicherformat, um Sammlungen von Dateien zu speichern.
Es ist möglich, inkrementell und in mehreren Uploads zu speichern.
Damit wird eine Versionierung und effiziente Platznutzung ermöglicht.

Die Idee ist, ein verteiltes verschlüsseltes Repository von Dateien-Gruppen zu realisieren.
Dateien bzw. die Dateistruktur ist in Packs gekapselt, die auf einem Online-Speicherservice abgelegt und geteilt werden können.

TODO: Interessant wäre auch noch, was eigentlich die prinzipiellen Unterschiede sind zwischen serverbasierten replizierten Dateisystemen (git oder Dropbox können ja jeweils in Dateien/Dateisystem reinschauen) und dem blockweise ins Irgendwo schreiben.

## Terminologie

TODO: genauere Trennung in der Terminologie zwischen Dateien des Nutzers und "Uploads".
Zusammengestellt und hochgeladen wird ein kompletter Versionsstand mit Verzeichnissen und vielen Dateien, genannt "Snapshot".
Ein Snapshot besteht aus i.A. mehrere einzelnen Uploads auf den Server, genannt "Packs".
Ein Pack beinhaltet Abschnitte genannt "Blocks"
Jeder Block ist entweder ein Index des Packs, eine Referenz-Liste auf andere Packs, ein Verzeichnis (Tree), eine einzelne Datei ("Blob") oder eine Liste von Stücken einer großen Datei ("Parts").
Die Stücke großer Dateien sind ebenfalls Blocks vom Typ Blob.


## Zugriff

Um einen Pack zu bekommen, benötigt der Client:

* URL
* Authentifikations-Parameter (User/Password / Token / ...) Ist optional, dient dem Schutz von abgelegten Packs auf dem Server
* Schlüssel (z.B. symmetrischer Schlüssel AES-256) TODO: Dient der tatsächlichen Entschlüsselung der Packs auf dem Client

## Teile eines Snapshots

Ein Snapshot besteht i.A. aus mehreren verschlüsselten Dateien (Packs) auf einen Server.
Das erste Pack wird mit expliziter URL beschrieben, weitere Packs sind innerhalb des ersten Pack verlinkt.


## Aufbau der Packs

Ein Pack ist komplett verschlüsselt. Der Inhalt ist mit Zlib komprimiert.

* Erster Schritt: komplett entschlüsseln. Den Inhalt komplett dekomprimieren. Dies sollte aufgrund der Größe als Stream implementiert sein.

Der Pack enthält:

* Index: optional (derzeit nicht geplant) geordnete Liste (Array) der enthaltenen Blocks mit Paaren Hash + Länge

Der Index ist ein besonderer Block. Er ist nicht im Index verzeichnet, beginnt mit dem ersten Byte im Pack und ist von selbst-beschreibender Länge.

Zum Extrahieren der Blocks werden deren Offsets ermittelt aus der Länge der vorhergehenden Blocks entsprechend der Indexstruktur.

An jedem Offset:

* Ein komprimierter Block (der evtl. im Index verzeichneten Länge)

Die Blocks sind von folgenden Typen:

* Tree
* Links
* Blobs
* (Parts)

Die Blocks sollten in dieser Reihenfolge im Pack sein.

Der erste Block (nach dem Index) ist der "root tree".
Das ist nur für direkte/erste Packs relevant. (d.h. Packs, die über bekanntgemachte URL geladen werden.)
Weitere indirekte Packs (werden über "Link" referenziert) sind nur als Resourcen zu sehen.

Sollte ich einen anderen Pack als den ersten laden (Falsche URL publiziert, Schreibfehler, Programmfehler) und der Pack enthält einen "Tree" kann dieser entpackt werden. Eine weitere Fehlerbehandlung oder -erkennung ist nicht möglich.
Das ist beabsichtigt, so kann ein neuer Snapshot einen einzelnen Pack vor eine bestehende Sammlung von Packs stellen und z.B. damit effizient eine neue Version erstellen.

## Typen der Blocks

Ausgepackt ist jeder Block eines von:

### Tree

Ein Tree ist eine Liste (Array) von Einträgen:

* Dateiname mit Mode und MTime sowie Verweis auf (Blob-)Block über Hash (SHA-256)
* Verzeichnisname mit Mode sowie Verweis auf (Tree-)Block über Hash (SHA-256)
* (optional kann ein Dateiname mit Mode und MTime einen Verweis auf (Parts-)Liste haben)

Der Hash-Verweis gilt für den gesamten Snapshot, muss i.A. nicht im gleichen Pack liegen.

TODO: Was passiert bei falschen/fehlenden Werten/Blocks?

### Links

Eine Links(-Liste) ist eine Sammlung (Dictionary) auf URLs (mit Auth-Parameter) mit den enthaltenen Resourcen. D.h. Liste von Hashes (SHA-256) auf weitere Packs.
Aus diesen weiteren Packs sollen dann Trees, Parts und Blobs geladen werden.
Mit den Hashes kann vorab ermittelt werden, ob ein Pack geladen werden muss.

### Blobs

Ein Blob sind reine (binäre) Nutzdaten, z.B. der Inhalt einer Datei.

### (Parts)

Eine Parts(-Liste) ist eine geordnete Liste (Array) von Hashes (SHA-256), die zusammenn eine große Datei bilden.


## Erstellen der Packs

* Ausgehend vom Root-Tree die Hashes aller (Sub-)Trees und Files bilden.
* Blobs nach Größe intelligent zu Packs sortieren
* (optional) den Index pro Pack bauen
* Jeden Pack schreiben mit:
** (optional) Index
** Blocks
* Zum Schluss komprimieren und eingepackt mit AES-256 CBC.
* Upload

TODO: Wie groß soll/kann/darf ein Pack sein?
Border cases: Kann der Index größer werden als die Packgröße, gibt es Limits für Anzahl Dateien pro Directory etc.?

## Dekodieren der Packs

* direkten Pack holen
* (falls vorhanden) Index entpacken und Offsets errechnen
* ggf. Links-Blocks finden
* vom Root-Tree aus Sub-Trees aufbauen
* Tree-Struktur mit Filesystem vergleichen und nicht vorhandene/neuere Dateien lokal auf Platte schreiben
* dazu den Blob- (oder Parts-)Block finden.
* ggf. Packs (über Links) nachladen
* die Blobs (oder Parts) entpacken.

## Datenstruktur der Blocks

* Blobs enthalten reine Nutzdaten
* Alle anderen Blocks sind JSON (TODO: Binäres Format?)

## Notizen

s.a.
http://git-scm.com/book/tr/Git-Internals-Git-Objects
http://git-scm.com/book/en/Git-Internals-Packfiles
http://www.jayway.com/2013/03/03/git-is-a-purely-functional-data-structure/
http://importantshock.wordpress.com/2008/08/07/git-vs-mercurial/

Fragen: sind links (kompliziert) rekursiv oder flach (und sehr redundant) im ersten header? sind links und index in einer gemeinsamen Auflistung?

Probleme: Was ist wenn Links Blocks zu groß für einen Pack? Rekursiv in mehreren Blocks?
Probleme: Was ist wenn Parts Blocks zu groß für einen Pack? Weitere Indirektion?

e.g. 100MB file
	3200x 32k Blobs
	parts entry: 3200x sha256 (256 bits = 32 bytes) = 100k
	links entry: 1067x url+accesskey+3xblob (20+60+3*32 bytes) = 188k (zippen: ?k)

e.g. 4GB file
	128000x 32k Blobs
	parts entry: 128000 sha256 (256 bits = 32 bytes) = 4M
	links entry: 42667x url+accesskey+3xblob (20+60+3*32 bytes) = 7.5M (zippen: ?k)

e.g. 1000 files file
	+ lots of blobs
	tree entry: 1000x Dateiname+mode+time+hash (256?+2?+4+256 bytes) = 518k (zippen: ?k)

