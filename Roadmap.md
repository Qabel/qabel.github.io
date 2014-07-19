# Roadmap
## Nahe Zukunft
* 30.07. Layout der Dokumentation so fertig haben das Pages angelegt sind und klar ist was wo steht bzw. stehen wird. Nötig für MZs BA.
* 04.08. Willkommens-Meeting für die Neuen. Anschließend zwei Wochen einleben / einarbeiten / einlesen.
* 11.08. Dokumentation soweit haben das man sie MZs Prof. zur Verfügung stellen kann.
* 18.08. Kick-off-Meeting und start der Implementation der ersten Arbeitspakete
  * Dazu müssen diese Arbeitspakete und das Softwaredesign dazu stehen. Die Idee muss den Entwicklern klar werden. Also Abhängigkeiten zwischen Klassen. Konzept mit GSON. Konzept mit Modulmanager.

## Mittlere Zukunft
* Dezember: Vor der Weihnachtspause sollte
  * der Core in Java fertig implementiert, getestet und dokumentiert sein.
  * Die Schnittstellen zum Entwickeln von Modulen müssen eine gewisse Reife haben und dokumentiert sein.

## Ferne Zukunft
(**Achtung**: es fehlt noch der Desktop Client, da noch unklar ist ob erst mal einfach auch Java)
* Anfang (Januar) des nächsten Jahres
  * Entwicklung der - für die Beta - nötigen Module sollten starten.
  * Entwicklung der (beta) Android App muss starten.
* Etwas später (ca. Februar) des nächsten Jahres
  * Android App sollte soweit sein das die echte Qabel App in realen Betrieb genommen werden und ausprobiert werden kann
  * Es werden noch Module fehlen.
* Irgendwann im nächsten Jahr
  * Module sind fertig implementiert, getestet und dokumentiert
  * Beta Release.

# Arbeitspakete
* core
 * modulemanager
    * lädt module
    * empfängt Nachrichten von drop und gibt sie an modul weiter
 * bridgehead
    * API für Drop (Definitionen fehlen: Wie sieht ein Drop aus?)
       * Definieren eines Listener-Interfaces.
       * Implementieren des Nachrichtenempfangens.
       * Implementieren des Nachrichtensendens.
    * API für Storage
       * Implementieren des Fileuploads
       * Implementieren des Filedownloads
 * config - Verhalten des Clients abspeichern
    * Zugriff über Singleton
    * Datenstruktur aus [[Qabel-Client-Configuration]] in Java Source im Package de.qabel.config definieren.
    * Annotations für GSON hinzufügen
    * Klasse für (de-)serialisierung der Konfiguration schreiben. (Lade Config aus Datei, übernehme sie ins singleton, speichere singleton in Datei)
 * contacts 
    * Zugriff über Singleton
    * Datenstruktur aus [[Qabel-Client-Contact-Messages]] in Java Source im Package de.qabel.contact definieren.
    * Annotations für GSON hinzufügen
    * Klasse für (de-)serialisierung der Kontakte schreiben. (Lade Kontakte aus Datei, übernehme sie ins singleton, speichere singleton in Datei)
    * später: Datenbankanbindung
 * utils -> write on demand
* Android Applikation
   * TODO
* Desktop Applikation
   * TODO
* Modules (Desktop/Android)
  * Mail
      * TODO
  * FileSync
      * TODO
  * Sync
      * TODO
  * Filesharing
      * TODO