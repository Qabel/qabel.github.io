* core
 * bridgehead
    * API für Drop (Event System, encryption)
    * API für Storage (File Up/Download, chunking, encryption, compression)
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