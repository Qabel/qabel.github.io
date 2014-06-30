# Blocks Client Notes

## Abstract

Notes on possible algorithms to pack and unpack Qabel blocks.

## Upload von Packs:

Für den Upload von Daten, wird ein 'Pack' erstellt.
Diese Erstellung wird entweder automatisch bei Veränderung im Dateisystem oder manuell ausgelöst.
Ein Pack enthält alle Daten die hochgeladen werden sollen.
Erst wird die Struktur des Packs berechnet, dann werden alle Daten mit Headern versehen und hintereinander gestellt. Diese Zusammenstellung (Stream) wird komprimiert und symmetrisch verschlüsselt und abschließend hochgeladen (oder zu Testzwecken lokal abgelegt).

### Beispiel für ein Pack:

Ordner Uni enthält die Dateien calculus.dat und analysis.dat und den Ordner homework, mit der Datei homework.dat:

	[Uni] : calculus.dat
        analysis.dat
        [homework] : homework.dat

Zum Hochladen wird für den Dateistrukturbaum pro Verzeichnis eine Verzeichnisrepräsentation erstellt und über Hashwerte verbunden. Daten werden durch den Hashwert ihres Inhalts und Ordner durch den Hashwert über die JSON-String Repräsentation ihres Inhalts dargestellt.
Im Beispiel wird also zuerst homework.dat gehasht, im Anschluss, die JSON Darstellung für [homework] erstellt und gehasht, dann die beiden Dateien calculus.dat und analysis.dat gehashed und am Ende der oberste Ordner [Uni], über die Einträge zu den Dateien und dem Unterverzeichnis, dargestellt und gehashed.
Diese Verzeichnisrepräsentationen werden zusammen mit den Links zu evtl. bereits vorhandene Dateien in vorhergehenden Packs (siehe Aktualisierung von Packs) und den Dateien zu diesem Pack zusammengestellt. Die Zusammenstellung wird dann komprimiert, verschlüsselt und an die Zieladresse gesendet.
Bei jedem Hochladen eines Packs, wird in der History gespeichert, welche Dateien in der aktuellen Version des Packs vorhanden sind (Index).

Ein hochgeladenes Pack ist unveränderlich, jegliche Benutzer mit Zugriff auf diese Adresse haben ausschließlich Leserechte. Der Schlüssel zum Entschlüsseln muss separat bekannt sein.

Zu festen Zeitpunkten kann der Client überprüfen ob die Hash-Werte aller hochgeladenen Verzeichnisse mit dem jeweils letzten Eintrag aus der History dieses Packs übereinstimmen.
Die Erstellung und Upload eines neuen Packs kann dann angeboten werden oder automatisch erfolgen.


## Aktualisieren von Packs:

Nehmen wir an, im o.a. Beispiel ist lediglich die analysis.dat verändert worden und es soll über den obersten Ordner [Uni] ein neues Pack erstellt werden.
Beim Beschreiben der Struktur bemerkt der Client ein unverändertes Unterverzeichnis [homework] und eine unveränderte Datei calculus.dat.
Bei Zusammenstellen kann nun der Inhalt der unveränderten Dateien ausgelassen werden und statt dessen ein Eintrag in einer Link-Liste erfolgen. Das unveränderte Verzeichnis kann ebenfalls (optional) ausgelassen werden, dies sollte jedoch vermieden werden.
In der Zusammenstellung sind nun an erster Stelle das oberste Verzeichnis, dann weitere Verzeichnisse und die Link-Liste, gefolgt von den tatsächlichen Dateien.
Hier also die Verzeichnisrepräsentation für [Uni], dann [homework], dann die Link-Liste und abschließend die Datei homework.dat.

### Link-Liste

Eine Liste von Link-Einträgen.
Link-Einträge enthalten Download-Adresse, evtl. nötige Zugriffsparameter die verwendeten symmetrischen Schlüssel, sowie eine Liste von enthaltenen Blocks (über Hashwerte).

## Download von Packs:

Beim Downloaden von einer Pack-Adresse wird das gesamte Pack heruntergeladen und in einen Cache Ordner zwischengespeichert.
Dann wird es entschlüsselt und dekomprimiert.
Der Client geht den Dateibaum durch und ermittelt für jede Datei, ob diese
* mit dem angegebenen Hashwert bereits im lokalen Dateisystem liegt
* im Pack mitgeliefert ist, oder
* in einem referenzierten Packs vorhanden ist (Link-Liste).

Evtl. lokal vorhandene Dateien bei welchen ein anderer Hash-Wert angegeben ist, werden überschrieben. Bereits vorhandene Dateien die unverändert sind, werden belassen.

Ist die Datei weder lokal vorhanden noch in diesem Pack enthalten muss der Client in der Link-Liste nach referenzierten Packs suchen. Das Pack kann im Cache vorhanden sein oder muss nachgeladen werden.
