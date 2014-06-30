# Deaddrop Specification

## Abstract

Das Deaddrop (Drops)-Protokoll ermöglicht es Teilnehmern, *anonym* und *asynchron* kurze *verschlüsselte* Benachrichtigungen auszutauschen.
Verschlüsselte Nachrichten werden an einen Drop-Server gesendet und dort eine Zeit lang für beliebige Empfänger bereitgehalten.
Dieses Prinzip kann derzeit prinzipiell auch mit etablierten Diensten, wie öffentlichen IMAP-Postfächern, bereitgestellt werden.
Das hier gezeigte Protokoll und der klar begrenzte Umfang an Operationen ermöglicht es jedoch darüber hinaus, Drop-Server einfach einzurichten und sicher zu betreiben.

Nachfolgend wird ein kurzer Überblick über die Ziele und Strategien gegeben und anschließend werden Details zum Protokoll spezifiziert.


## Idee

Ein Dead Drop (Toter Briefkasten) dient zur verschleierten Übermittlung geheimer Nachrichten.
Üblicherweise sind dies physische Gegenstände, die speziell präpariert sind, um Nachrichten zu beinhalten. Nur dem Sender und Empfänger ist der Ort und die spezielle Charakteristik des Gegenstands bekannt. Der Sender hinterläßt eine Nachricht und wird dann entweder dem Empfänger an anderer Stelle den Eingang einer neuen Nachricht signalisieren oder der Empfänger prüft regelmäßig den Briefkasten. Gegebenenfalls kann ebenfalls an anderer Stelle eine Empfangsbestätigung gegeben werden.

Siehe "Wikipedia":http://de.wikipedia.org/wiki/Toter_Briefkasten

Für das hier beschriebene Protokoll bietet sich eine leicht abgewandelte Metapher an:
Es ist möglich, wenn auch etwas aufwendig, kodierte Botschaften über Kleinanzeigen in Zeitungen auszutauschen. Diese können von allen gelesen werden, jedoch soll möglichst nur der beabsichtigte Empfänger mit der Nachricht etwas anfangen können.
Der Sender muß die Nachricht einliefern (und gibt dabei ein wenig seiner Anonymität auf).
Es kann u.U. von außen klarwerden, daß eine Kommunikation stattfindet, die Teilnehmer sind jedoch schwer zu identifizieren.
Nachrichten können nicht gelöscht oder verändert werden, sie verfallen jedoch nach einiger Zeit.


WICHTIG: Nachrichten im Protokoll sind nicht notwendigerweise persistent, sondern existieren nur temporär mit verzögertem Verfall. Das tatsächliche Verfallsdatum hängt von Speicherplatz und anderen Konfigurationen ab, die später definiert werden.


## Ziele und Prinzipien

Die Kommunikation soll anonym erfolgen.
Optimalerweise sollen keine Teilnehmer der Kommunikation identifizierbar sein.
Innerhalb des Protokolls werden Benutzer des Systems nicht identifiziert; es gibt keine Benutzerverwaltung, das System ist offen und öffentlich.

Auf Netzwerkebene und je nachdem, wieviel Zugang ein potentieller Angreifer hat, ist vollständige Anonymität schwer umzusetzen. Zumindest am Server selbst landet die Kommunikation an und ist identifizierbar.
Die Tatsache des Stattfindens von Kommunikation ist nicht verbergbar, aber verschleierbar.
Da die notwendigen IP-Verbindungen prinzipiell sichtbar sind, ist vollständige Anonymität innerhalb des Protokolls nicht machbar.
Zusätzliche Schichten wie z.B. Tor können die Verbindungen jedoch zusätzlich sichern.

Abgeschwächt ist unsere Forderung, daß zumindest keine zwei (oder n) Teilnehmer einer Kommunikation identifiziert werden, also die Anonymität der Existenz einer Kommunikation zwischen Personen, nicht die Anonymität aller Teilnehmer des Systems.

Die Anonymität der Teilnehmer untereinander ist im System selbst gegeben, kann jedoch abhängig von der Identifizierung der Nachrichten innerhalb der Verschlüsselung je nach Anwendungsfall bewußt wieder aufgehoben werden.


Plausible Deniability eines Kommunikationsvorgangs
Es kann zwar auf das Vorhandensein einer Kommunikation geschlossen werden, die Teilnehmer können jedoch nicht vollständig identifiziert werden.
Es gibt keine direkte Adressierung von Nachrichten.
Eine Möglichkeit der Anonymität der Kommunikationsbeziehung ist die Nutzung eines gemeinsamen Pools von Nachrichten, aus dem alle Teilnehmer alle Nachrichten lesen und erst dann auf den richtigen Empfänger testen können.

Server sind universell und leichtgewichtig
Einfacher Server per HTTP/REST

Die Kommunikation ist standardkonformes HTTP, läuft ideal über die standardmäßigen IANA-Ports und ist so von außen nicht direkt von anderem HTTP-Verkehr (Web) zu unterscheiden.
Es ist zudem sichergestellt, dass die Kommunikation über beliebige Proxies und Proxy-Kaskaden abgewickelt werden kann.
Die einzelnen Teilnehmer dürfen nicht unterscheidbar sein. Es sind keine individualisierten Header-Daten wie z.B. Cookies erlaubt.
Es darf keine individuelle Authentifikation der Clients vorgenommen werden. Der Zugang ist idealerweise öffentlich, alternativ über ein Authorisierungs-Verfahren, das die Clients nicht identifiziert (gemeinsames Token, z.B. pre-shared key).


Das Protokoll baut auf HTTP auf. Es wird ein knapper Satz von HTTP-Methoden und Standard Header-Feldern unterstützt.
Der Server kann eigenständig laufen, ggf. hinter einem Reverse-Proxy oder auch in einer vorhandenen HTTP Umgebung (z.B. PHP, Rails, ...).
Das Protokoll kann jedoch auch auf beliebigen Ports laufen oder, in einer bestehenden Umgebung, in einem beliebigen Pfad installiert werden.

Durch die Verwendung von HTTP auf Standardports werden eventuelle Einschränkungen wie z.B. geblockte SMTP-Ports umgangen.
Das Protokoll ist dadurch generell schwer zu blocken, etwas schwerer zu selektieren/analysieren, und es fallen weniger Metadaten an.

Bestehende Lösung wie das flexible XMPP (z.B. Chrome-Sync) sind zu umfangreich und zu komplex, eine Analyse der Kommunikation würde erleichtert.

Das Protokoll ist von außen nicht von normalem HTTP-Traffic (Browsing, Download, Webservices) zu unterscheiden. Eine Deep-Packet-Inspection würde zwar die Verwendung des Protokolls selbst zeigen und damit einen Deaddrop-Server identifizierbar machen, tatsächliche Inhaltsanalysen sind jedoch nicht möglich.


Die Nachrichten und direkte Meta-Daten sind verschlüsselt.

Der Inhalt der Kommunikation soll nicht nach außen dringen.
Die zwischen den Clients ausgetauschten Nachrichten sind komplett verschlüsselt. Direkt zugehörige Meta-Daten wie z.B. Empfängerlisten, Verschlüsselungsverfahren und -parameter sind im verschlüsselten Block opak. Der Server kann keine Annahmen über die Struktur oder gar den Inhalt machen.
Eine mögliche Authentifizierung des Senders geschieht innerhalb der verschlüsselten Nachricht.

Die Details der Verschlüsselung sind den Client-Anwendungen überlassen, hier gehen wir von einem Public-Key-Verfahren aus, dessen Aushandlung außerhalb des Deaddrop-Protokolls stattfindet. Daher ist der eigentliche Inhalt der Nachrichten reiner Cyphertext.
Das Protokoll kann dies jedoch nicht erzwingen, es können im Prinzip beliebige Nachrichten getauscht werden, dies ist Aufgabe einer höheren Protokollschicht.

Einziges vom Server genutztes Meta-Datum ist der Zeitpunkt der Einlieferung einer Nachricht und der verwendete Kanal. Dieser Schlüssel wird zum Abfragen neuer Nachrichten verwendet (Als neue-Nachrichten-seit-Datum).

Es ist aber zu beachten das weitere Metadaten bei der Kommunikation anfallen: Länge der Nachrichten, Sender oder letzter Proxy/ Ausgang einer Kaskade.


Nachrichten sind asynchron

Der Server puffert eingehende Nachrichten für einen späteren Abruf durch Empfänger.
Der Umfang des Puffers ist dabei in Länge und Dauer begrenzt.
Sender und Empfänger müssen somit keinen direkten Datenaustausch vollziehen und sich auch nicht weiter bekannt sein.
Dies ist nicht notwendigerweise für den Schlüsselaustausch oder ersten Kontakt der Kommunikationspartner anwendbar. Hier ist ein weiterer Kanal vorzusehen (Out-of-Band)


## Ablauf der Kommunikation

Zu einem gegebnen Kommunikationspartern ermittelt der Sender einen Drop, bestehend aus Drop-Server und Drop-ID, welche der Empfänger regelmässig abfragt.
Diese Information, wie auch verwendete Verschlüsselungsverfahren und Schlüssel hat der Empfänger dem Sender vorab mitgeteilt.
Zum Einliefern einer Mitteilung verschlüsselt ein Sender den Klartext und legt die verschlüsselte Nachricht (Chiffrat) in einen Drop ab.

Um sicherzustellen, daß die eigentliche Kommunikation zwischen Alice und Bob nicht nachvollzogen werden kann, enthält die Nachricht auf dem Server keine Metadaten über Sender oder Empfänger. Diese werden innerhalb der verschlüsselten Nachricht abgelegt.
Damit ist zwar keine Zuordnung der Kommunikationspartner möglich, die Empfänger können jedoch auch nicht die für sie bestimmten Nachrichten selektieren.
Das Protokoll sieht vor, daß stattdessen alle Empfänger regelmäßig gewählte Drops abfragen und jeweils alle neuen Nachrichten empfangen. Erst durch die Entschlüsselung kann dann festgestellt werden, ob eine Nachricht erfolgreich entschlüsselt werden kann und damit an den Empfänger gerichtet ist.
Es handelt sich also um ein Subscribe to Broadcasts per Pollingverfahren, analog der Kleinanzeigenmetapher oben.

Genauer: Ein Client muß *alle* Nachrichten eines Kanals (Drop) lesen, um die für ihn bestimmten herauszufiltern.
Dies erzeugt zwar einen Kommunikationsoverhead, stellt aber damit die Anonymität der Kommunikation an sich sicher.
Es kann daher nur festgestellt werden, daß jemand Teilnehmer des gesamten Systems ist, nicht jedoch die individuellen Kommunikationspartner.


## Zugangsberechtigung

Der Zugang zum Lesen und Schreiben (Erzeugen neuer Nachrichten) ist frei und anonym. Clients können Nachrichten weder löschen noch ändern.
Optional können Drop-Server auf einen bestimmten Teilnehmerkreis begrenzt werden (z.B. firmenintern, ...).
Diese privaten Drop-Server definieren ein geteiltes Passwort, das gemeinsam von allen Clients verwendet wird.


## ID der Drops

Drops sind mit einem Bitwert gewisser Länge als IDs identifiziert. Codierung ist "URL Friendly Base64", s. "RFC 4648":http://www.ietf.org/rfc/rfc4648.txt "Base 64 Encoding with URL and Filename Safe Alphabet".
Vorgeschlagen sind 256 Bit (32 Byte) sicherer Zufallswert. (Dies entspricht 43 Ascii-Bytes.)


## Speicher-/Datenmodell für Drop

Ein Server enthält alle möglichen (evtl. nicht-manifestierten) Drop-IDs, diese jeweils enthalten die einzelnen Nachrichten als FIFO geordnet nach Einlieferungsdatum.

Die Nachrichten werden dabei gesondert nach Drop verwaltet.


## Aufbau der Endpoint URL

Die Drop-URLs setzen sich aus Protokoll, Server-Adresse (inkl. Port), Service-Pfad und Drop-ID zusammen:

- Protokoll ist https oder http.
- Server-Adresse ist eine IP (IPv4 od. IPv6) oder DNS Host-Adresse. Für nicht-standard Ports wird die Port-Nummer angehängt.
- Der Service-Pfad ist der Basis-Pfad des Servers (z.B. URL des PHP-Skripts oder Mapping im Reverse-Proxy). Der Pfad schließt den führenden Schrägstrich ("/") ein.
- Die einzigen gültige vollen URLs eines Drops schließen mit der Drop-ID ab.

In "BNF":http://www.w3.org/Addressing/URL/5_BNF.html "Notation":http://www.w3.org/Notation.html des W3C:

dropurl ::= protocol "://" serviceaddress servicepath "/" dropid
protocol ::= "https" | "http"
serveraddress ::= IPv4 | IPv6 | DNSName
serverport ::= "1" - "65535"
serviceaddress ::= serveraddress ( ":" serverport ) ?
servicepath ::= "/" [ URLChars, "/" ] *
friendlybase64char ::= [ "A" - "Z", "a" - "z", "0" - "9", "-", "_" ]
dropid ::= <43>*friendlybase64char

Beispiel: http://d.example:1234/tools/drop/xzjall...aatr42

## Methoden

Es stehen die REST-Methoden GET, HEAD, POST zur Verfügung:

### GET

Die GET-Methode fragt einen kompletten Drop oder einen definierten Teil der neuesten Einträge an.


#### Rückgabewerte

Liefert HTTP 400 falls die Drop-ID fehlt oder ungültig ist.

Liefert HTTP 404 falls der Drop leer ist.

Liefert HTTP 200 falls der Drop Nachrichten enthält.

Optional mit If-Modified-Since Header:

Liefert HTTP 404 falls der Drop leer ist.
Liefert HTTP 304 falls der Drop keine Nachrichten seit 'If-Modified-Since' enthält.
Liefert HTTP 200 falls der Drop neue Nachrichten seit 'If-Modified-Since' enthält.

Der HTTP-Body wird als MIME-Multipart der einzelnen Nachrichten zurückgegeben.

MIME-Multipart:
Der 'Content-Type' ist 'multipart/mixed'.
Jeder einzelne Part hat einen 'Content-Type' von 'application/octet-stream' und einen 'Date'-Header.
Die Nachrichten sind unkodierte 8 Bit Streams.

### HEAD

Die HEAD-Methode ermittelt, ob ein Drop gefüllt ist oder eine neue Nachricht eingetroffen ist.

#### Rückgabewerte

Liefert HTTP 400 falls die Drop-ID fehlt oder ungültig ist.

Liefert HTTP 404 falls der Drop leer ist.
Liefert HTTP 200 falls der Drop Nachrichten enthält.

Optional mit If-Modified-Since Header:

Liefert HTTP 404 falls der Drop leer ist.
Liefert HTTP 304 falls der Drop keine Nachrichten seit 'If-Modified-Since' enthält.
Liefert HTTP 200 falls der Drop neue Nachrichten seit 'If-Modified-Since' enthält.

Es wird kein HTTP-Body zurückgegeben.

### POST

Mit der POST-Methode wird eine neue Nachricht zu einem Drop hinzugefügt.
Der Drop kann bereits Nachrichten enthalten oder leer/ungenutzt sein.

#### Rückgabewerte

Liefert HTTP 400 falls die Drop-ID fehlt oder ungültig ist.
Bei Erfolg: liefert HTTP 200 und fügt die Nachricht dem Drop hinzu.
Die Nachricht muss als HTTP-Body übergeben werden.
Der HTTP-Body ist ein unkodierter 8 Bit Stream.

Es wird kein HTTP-Body zurückgegeben.

