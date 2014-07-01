# Qabel client messages
## The structure and encryption of Qabel messages, transported using the Qabel Drop protocol.

### Terminology ###

address = qabel drop address as URL

sender 	= person or system creating and sending qabel messages

recipient = person or system receiving qabel messages

client	= qabel client (software the sender is using)

server 	= qabel server (drop server referred by the address)

message payload = data the sender intents to deliver to the recipient

message = json object the client sends to the server


### Attendees ###

* Sender
* Server

### Use cases:

#### Send message ####
Alice (sender) wants to write a message to Bob (recipient). Alice has Bobs address and public key, therefor Bob has a valid inbox.
The client will send the message to the server.

**On sending succes:**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
Message will be put into history.

**On sending failure**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
User will be informed. Client will retry to send it.

#### Get message ####
TODO

### Message format ###
JSON
*TODO: description of json fields*

### Buildup/Structure of a message ###

* Message-type TODO
* Timestamp
* UUID
* User
* Message payload
*TODO*


### Encryption ###

The final JSON object is serialized as string and compressed with zlib forming the cryptographic plaintext.
The plaintext is encrypted using AES with a random key of 256 bits forming the ciphertext.
The AES key is encrypted with RSA OAEP Encryption Scheme using the recipients public key.
The final data is formed by concatenating, without delimiter, three fields: the encrypted AES key, the AES IV, and the ciphertext. E.g. with 2048 bit RSA key: [256 byte encrypted AES key][16 bytes AES IV][n bytes AES ciphertext].
