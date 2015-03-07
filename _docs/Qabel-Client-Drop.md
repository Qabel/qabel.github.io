---
title: Client Drop
---
# Qabel drop messages
## The structure and encryption of Qabel drop messages, transported using the Qabel Drop protocol.

### Terminology

| Term | Meaning |
| ---- | ------- |
| address | qabel drop address as URL |
| acknowledge id | identifier which is used to acknowledge the recipience of a drop message |
| sender | person or system creating and sending qabel messages |
| recipient | person or system receiving qabel messages |
| client | qabel client (software the sender is using) |
| server | qabel server (drop server referred by the address) |
| message payload | data the sender intents to deliver to the recipient |
| message | json object the client sends to the server |


### Attendees

* Sender
* Server

### Use cases:

#### Send message
Alice (sender) wants to write a message to Bob (recipient). Alice has Bobs address and public key, therefore Bob has a valid inbox.
The client will send the message to the server.

**On sending success:**
The server will return the specific [response](../Qabel-Protocol-Drop#methods).
The message will be added to the history if this is wanted.

**On sending failure:**
The server will return the specific [response](../Qabel-Protocol-Drop#methods).
The user will be informed and/or the client will try to resend the message.

#### Get message
Alice (receiver) wants to receive new messages. Alice has a private key and an address, therefore a valid inbox.
The client will request new messages from the server.

**On receiving success:**
The server will return a specific [response] (../Qabel-Protocol-Drop#methods) including the new messages.

**On receiving failure:**
The server will return a specific [response] (../Qabel-Protocol-Drop#methods).
The user will be informed and/or the client will retry to receive the messages.

### Format and structure of a message
A message is packed into JSON containing the following fields:

| Key | Type | Description |
| --- | ---- | ----------- |
| **version** | INT | This key describes the version of the Qabel Drop Message protocol. |
| **time_stamp** | INT | Date of message generation. |
| **acknowledge_id** | STR | Acknowledge ID for acknowledging this message |
| **sender** | STR | The [key id](../Components-Crypto/#key-identifier) of sender's public key. |
| **receiver** | STR | The [key id](../Components-Crypto/#key-identifie) of the receiver's public key. |
| **model_object** | STR | The name of the model object that handles this message. |
| **data** | JSON object | The payload of the message. |

#### Summary

    drop_message    = "{"
                    'version' : INT,
                    'time_stamp' : LONG,
                    'acknowledge_id': STR,
                    'sender' : STR,
                    'model_object' : STR,
                    'data' : { ... }
                    "}"


#### Special messages
Special drop messages are defined for message acknowledgement and error notification.
Special messages have the `model_object` set to `drop`.
Other models MUST NOT use the model object `drop`.

##### Acknowledging
The drop client automatically acknowledges each incoming drop message.
In order to acknowledge message `N`, the client generates a drop messages where
`acknowledge_id` is `N`. The `data` field of an acknowledge message is undefined.
Messages with the `acknowledge_id` set to `0` (zero) are not acknowledged.

##### Error notification
If the drop client caught an error while handling drop message with `acknowledge_id` `N`,
the client generates a drop message to notify the original sender about the error.
The `acknowledge_id` of this notification is `N`.
The `data` field contains error descriptions:

    error           = "{"
                    'type' : STR,
                    'error_object' : { ... }
                    "}"

The following error types:

| Type | Description |
| ---- | ----------- |
| UNKNOWN_MODULE | Given `module_object` is unknown |


### Sequence diagrams

#### Send message:
![Sequence diagram send message](/images/sequencediagram_send_messages.png)

#### Receive messages:
![Sequence diagram receive messages](/images/sequencediagram_receive_messages.png)

### Encryption
Drop messages are encrypted into Noise boxes.

### Transport format
The following section defines the protocl data unit (PDU) of the Qabel Drop protocol.
This PDU is transmitted as body of a HTTP request/response.

The PDU starts with a version byte to indicate the version of PDU format.

#### PDU Version 0

| Message part | Field | Description | Length (in Bytes) |
| ------------ | ----- | ----------- | ---------------: |
| **Header** (unencrypted) | Version | Version of the Qabel drop message format | 1 |
| **Body** | Noise box | Drop message encrypted into a Noise box | *variable* |

#### Header
The header is unencrypted and consists at least of a one-byte version number indicating
the version of the binary Qabel Drop message.

### History / Persistence

The core will handle the drop history but this functionality is not yet defined.
**TODO**: Messages which are needed across all devices of an identity must be shared across all devices. The exact way has to be defined.


