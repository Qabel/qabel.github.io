# Qabel drop messages
## The structure and encryption of Qabel drop messages, transported using the Qabel Drop protocol.

### Terminology

address = qabel drop address as URL

sender 	= person or system creating and sending qabel messages

recipient = person or system receiving qabel messages

client	= qabel client (software the sender is using)

server 	= qabel server (drop server referred by the address)

message payload = data the sender intents to deliver to the recipient

message = json object the client sends to the server


### Attendees

* Sender
* Server

### Use cases:

#### Send message
Alice (sender) wants to write a message to Bob (recipient). Alice has Bobs address and public key, therefore Bob has a valid inbox.
The client will send the message to the server.

**On sending success:**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#methods).
The message will be added to the history if this is wanted.

**On sending failure:**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#methods).
The user will be informed and/or the client will try to resend the message.

#### Get message
Alice (receiver) wants to receive new messages. Alice has a private key and an address, therefore a valid inbox.
The client will request new messages from the server.

**On receiving success:**
The server will return a specific [response] (https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#methods) including the new messages.

**On receiving failure:**
The server will return a specific [response] (https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#methods).
The user will be informed and/or the client will retry to receive the messages.

### Format and structure of a message
A message is packed into JSON containing the following fields:

**Key 'version'**
This key describes the version of the Qabel Drop Message protocol.
* type = INT

**Key 'time_stamp'**
Date of message generation.
* type = INT

**Key 'sender'**
The key id of the key of sender.
* type = INT

**Key 'model_object'**
The name of the model object that handles this message.
* type = STR

**Key 'data'**
The payload of the message
* Type = JSON object

#### Summary

    drop_message    = "{"
                    'version' : INT,
                    'time_stamp' : INT,
                    'sender' : INT,
                    'model_object' : STR,
                    'data' : { ... }
                    "}"


### Sequence diagrams

**Send message:**
![](https://github.com/Qabel/intern-doc/wiki/images/sequence_diagram_qabel_messages_send.png)

**Receive messages:**
![](https://github.com/Qabel/intern-doc/wiki/images/sequence_diagram_qabel_messages_receive.png)

### Encryption

The JSON object 'drop_message' is serialized to JSON text (string) without unneeded whitespace characters forming the cryptographic plaintext.
The plaintext is encrypted using AES with a random key of 256 bits forming the ciphertext.
The AES key is encrypted with RSA OAEP encryption scheme using the recipients public key.
The final data is created by concatenating three fields without any delimiter; the encrypted AES key, the AES IV, and the ciphertext. E.g. with a 2048 bit RSA key: [256 byte encrypted AES key][16 bytes AES IV][n bytes AES ciphertext].

#### Signature

The whole drop_message will be signed by the sender. **TODO**: To be defined.

### History / Persistence

The core will handle the drop history but this functionality is not yet defined.
**TODO**: Messages which are needed across all devices of an identity must be shared across all devices. The exact way has to be defined.
