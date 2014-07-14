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
    * Datenstruktur aus [[Qabel-Client-Configuration]] in Java Source im Package de.qabel.config
    * Annotations für GSON hinzufügen
    * Klasse für (de-)serialisierung der Konfiguration schreiben. (Lade Config aus Datei, übernehme sie ins singleton, speichere singleton in Datei)
 * contacts 
    * Zugriff über Singleton
    * Datenstruktur aus [[Qabel-Client-Contact-Messages]] in Java Source im Package de.qabel.contact
    * Annotations für GSON hinzufügen
    * Klasse für (de-)serialisierung der Kontakte schreiben. (Lade Kontakte aus Datei, übernehme sie ins singleton, speichere singleton in Datei)
    * später: Datenbankanbindung
 * utils -> write on demand