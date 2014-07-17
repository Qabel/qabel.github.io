# Qabel client messages
## The structure and encryption of Qabel messages, transported using the Qabel Drop protocol.

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
Alice (sender) wants to write a message to Bob (recipient). Alice has Bobs address and public key, therefor Bob has a valid inbox.
The client will send the message to the server.

**On sending success:**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
Message will be put into history.

**On sending failure:**
The server will return the specific [response](https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
User will be informed. Client will retry to send it.

#### Get message
Alice (receiver) wants to receive new messages. Alice has a private key and an address, therefor a valid inbox.
The client will request new messages from the server.

**On receiving success:**
The server will return a specific [response] (https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte) including the new messages.

**On receiving failure:**
The server will return a specific [response] (https://github.com/Qabel/intern-doc/wiki/Qabel-Protocol-Drop#r%C3%BCckgabewerte).
User will be informed and the client will retry to receive the messages.

### Format and buildup/structure of a message
A message is packed into JSON format containing the following fields:

**Key 'id'**

The id is created during the generation of a message and is used to uniquely identify the message.
* type = INT

**Key 'time_stamp'**

This key describes the date of generation of a message.
* type = INT

**Key 'sender'**

The sender contains an ID of the sender of the message.
* type = INT

**Key 'module'**
The name of the module which handle this message.
* type = STR / INT

<a name="key-type"></a>**Key 'type'**
This key is for the module which handle the message. This key is set that the module can easily parse the data. The id 0 to 255 are reservated for common message like sending only a boolean
* type = INT

**Key 'version'**
This key describe the version of the module. It shall avoid incompatibilities.
* type = INT

**Key 'data'**
The real data of the message
* Type = JSON object

**Summary**

    drop_message    = "{"
                    'id' : ID,
                    'time_stamp' : INT,
                    'sender' : INT,
                    'module' : STR / INT,
					'type' : INT,
					'version' : INT,
					'data' : { ... }
                    "}"

<a name="reserved-drop-messages"></a>
### Reserved Drop Messages

**Predefined Message Types**

The following message types (key 'type') are predefined:
* SEND_BOOLEAN
* SEND_NUMBER
* SEND_STRING
* SEND_DOUBLE
* SEND_BIGDECIMAL
* SEND_BIGINTEGER
* SEND_FLOAT
* SEND_LONG
* SEND_SHORT
* SEND_INT
* SEND_BYTE
* SEND_CHARACTER
* SEND_BOOLEAN_ARRAY
* SEND_NUMBER_ARRAY
* SEND_STRING_ARRAY
* SEND_DOUBLE_ARRAY
* SEND_BIGDECIMAL_ARRAY
* SEND_BIGINTEGER_ARRAY
* SEND_FLOAT_ARRAY
* SEND_LONG_ARRAY
* SEND_SHORT_ARRAY
* SEND_INT_ARRAY
* SEND_BYTE_ARRAY
* SEND_CHARACTER_ARRAY

The data JSON object have the following keys:

**Key 'id'**

The information which normally is in the [key 'type'](#key-type) moved to this key.
This key is for the module which handle the message. This key is set that the module can easily parse the data.
* type = INT

**Key 'value'**

Here are the real data of this message

**Summary**

    data            = "{"
                    'id' : ID,
                    'value' : ...,
                    "}"

### Sequence diagrams

**Send message:**
![](https://github.com/Qabel/intern-doc/wiki/images/sequence_diagram_qabel_messages_send.png)

**Receive messages:**
![](https://github.com/Qabel/intern-doc/wiki/images/sequence_diagram_qabel_messages_receive.png)

### Encryption

The final JSON object is serialized as string and compressed with zlib forming the cryptographic plaintext.
The plaintext is encrypted using AES with a random key of 256 bits forming the ciphertext.
The AES key is encrypted with RSA OAEP Encryption Scheme using the recipients public key.
The final data is formed by concatenating, without delimiter, three fields: the encrypted AES key, the AES IV, and the ciphertext. E.g. with 2048 bit RSA key: [256 byte encrypted AES key][16 bytes AES IV][n bytes AES ciphertext].

### History / Persistence

All messages that need to be tracked will be persisted with or alongside the configuration.
Messages that are relevant to all devices of the user are stored on the Firefox Sync server.

