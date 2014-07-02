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

**On sending success:**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
Message will be put into history.

**On sending failure:**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
User will be informed. Client will retry to send it.

#### Get message ####
Alice (receiver) wants to receive new messages. Alice has a private key and an address, therefor a valid inbox.
The client will request new messages from the server.

**On receiving success:**
The server will return a specific [response] (https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte) including the new messages.

**On receiving failure:**
The server will return a specific [response] (https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
User will be informed and the client will retry to receive the messages.

### Format and buildup/structure of a message ###
A message is packed into JSON format containing the following fields:
* uuid
* timestamp
* message-type
* message
* sender

**UUID:**

The uuid is created during the generation of a message and is used to uniquely identify the message.
* type = INT

**Timestamp:**

The timestamp describes the date of generation of a message.
* type = INT

**Message-type:**

The message-type is used for the identification of the message and thus describes its function, e.g. if it announces an upload of a new share or if it is a simple chat message. Via the message-type the message can be assigned after receipt to the dedicated component where it will be processed.
* type = STRING

**Message:**

The message field contains the payload of the message.
* type = STRING

**Sender:**

The sender contains an ID of the sender of the message.
* type = maybe the senders public key?

### Sequence diagrams ###

**Send message:**
![](https://github.com/Qabel/intern-doc/wiki/images/sequence_diagram_qabel_messages_send.png)

**Receive messages:**
![](https://github.com/Qabel/intern-doc/wiki/images/sequence_diagram_qabel_messages_receive.png)

### Encryption ###

The final JSON object is serialized as string and compressed with zlib forming the cryptographic plaintext.
The plaintext is encrypted using AES with a random key of 256 bits forming the ciphertext.
The AES key is encrypted with RSA OAEP Encryption Scheme using the recipients public key.
The final data is formed by concatenating, without delimiter, three fields: the encrypted AES key, the AES IV, and the ciphertext. E.g. with 2048 bit RSA key: [256 byte encrypted AES key][16 bytes AES IV][n bytes AES ciphertext].
