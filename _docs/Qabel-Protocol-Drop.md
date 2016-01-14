---
title: Protocol Drop
---
# Drop Specification

## Abstract

A protocol to write and read from a Qabel drop server.

## Protocol

### Structure of the Endpoint URL
The URL to access a drop on a qabel drop server can be split into four parts, protocol, server address (incl. port), service path and drop ID:

- Protocol is http or https.
- Server address is an IP (IPv4 or IPv6) or a DNS host address. For non-standard ports, the port number gets appended.
- The service path is the base path of the server (e.g. URL of the PHP script or mapping in the reverse proxy). The path includes the leading slash ("/").
- a valid URL of a drop always contains the drop ID.

<a name="url"></a>
In [BNF](http://www.w3.org/Addressing/URL/5_BNF.html) [notation](http://www.w3.org/Notation.html) of the W3C:

`dropurl ::= protocol "://" serviceaddress servicepath "/" dropid`

1. protocol ::= "https" | "http"
1. serveraddress ::= IPv4 | IPv6 | DNSName
1. serverport ::= "1" - "65535"
1. serviceaddress ::= serveraddress ( ":" serverport ) ?
1. servicepath ::= "/" [ URLChars, "/" ] *
1. friendlybase64char ::= [ "A" - "Z", "a" - "z", "0" - "9", "-", "_" ]
1. dropid ::= <43>*friendlybase64char

**Example:**

`http://d.example:1234/tools/drop/1234567890123456789012345678901234567890123`

#### Drop IDs

Drops are identified by a 256 bit (32 byte) value as ID. Coding is "URL friendly Base64".
See [RFC 4648](http://www.ietf.org/rfc/rfc4648.txt) "Base 64 Encoding with URL and Filename Safe Alphabet".

The client has a setting to trade off anonymity against traffic.
Let the setting be a percentage value *p* (0 < p <= 1) which expresses how much of the available drop box range should be used.
Then the drop id is calculated the following:

`id := random_pick_from_range(0, (2^id_length * p) - 1)`

The corner cases are:

* **p=1**: The complete range of drop ids is used, thus collisions are unlikely.
* **p -> 0**: Very few drop ids are used, collisions are very likely and drop boxes are heavily used.

### Communication with Server

Available are the REST methods GET, HEAD and POST.

To reduce Spam and Denial of Service attacks a proof of work protocol could additionally be implemented (see [Proof of Work](http://qabel.github.io/docs/Qabel-Protocol-ProofOfWork/))

#### GET

The GET method asks for a complete drop or a defined part of the newest entries.


##### Return values

|HTTP status code|reason|
|:----------------:|------|
| 400 | the drop ID is missing or invalid|
| 204 | the drop is empty|
| 200 | the drop contains messages|

Optional with if-modified-since header:

|HTTP status code|reason|
|:----------------:|------|
| 204 | the drop is empty|
| 304 | the drop doesn't contain any messages since 'if-modified-since'|
| 200 | the drop contains new messages since 'if-modified-since'|

The HTTP body gets returned as MIME multipart of the single messages.

MIME Multipart:
The 'Content-Type' is 'multipart/mixed'.
Each individual part has a 'Content-Type' of 'application/octet-stream' and a 'Date' header.
The messages are uncoded 8-bit streams.

#### HEAD

The HEAD method determines if a drop is filled or if a new message has arrived.

##### Return values

|HTTP status code|reason|
|:----------------:|------|
| 400 | drop ID is missing or invalid |
| 204 | drop is empty.         |
| 200 | drop contains messages |

Optional with if-modified-since header:

|HTTP status code|reason|
|:----------------:|------|
| 204 | drop is empty |
| 304 | drop doesn't contain any messages since 'if-modified-since' |
| 200 | drop contains new messages since 'if-modified-since' |

No HTTP body gets returned.

#### POST

With the POST method a new message gets added to a drop.
The drop can already contain messages or be empty/unused.

##### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | message was added |
| 400 | drop ID is missing or invalid or no message has been submitted at all |
| 413 | message exceeds the [maximum size](../Qabel-Client-Drop/#transport-format) |

The message has to be transmitted as HTTP body.
The HTTP body is an encoded 8-bit stream.
No HTTP body gets returned.

### Messages

#### Lifetime
**[To be defined]** The maximum lifetime of a drop message is 1 week. If the quota for drop messages is full, the globally oldest message of a dropserver will be deleted.

##### History / Persistence
**[To be defined]** The core will handle the drop history but this functionality is not yet defined.
Messages which are needed across all devices of an identity must be shared across all devices. The exact way has to be defined.


#### Size
The total size of a message depends on the used transport format. A drop server must reject messages that are larger than the size of the largest supported transport format.

#### Transport format
The following section defines the protocol data unit (PDU) of the Qabel Drop protocol.
This PDU is transmitted as body of a HTTP request/response.

The PDU starts with a version byte to indicate the version of PDU format.

##### PDU Version 0

| Message part | Field | Description | Length (in Bytes) |
| ------------ | ----- | ----------- | ---------------: |
| **Header** (unencrypted) | Version | Version of the Qabel drop message format (here 0)| 1 |
| **Body** | Noise box | Drop message encrypted into a Noise box | *variable* |

##### Header
The header is unencrypted and consists of a one-byte version number indicating
the version of the binary Qabel Drop message.

##### Body

###### Encryption
Drop messages are encrypted into Noise boxes.

###### Format **[To be reviewed]**
A message is packed into JSON containing the following fields:

| Key | Type | Description |
| --- | ---- | ----------- |
| **version** | INT | This key describes the version of the Qabel Drop Message protocol. |
| **time_stamp** | INT | Date of message generation. |
| **acknowledge_id** | STR | Acknowledge ID for acknowledging this message |
| **sender** | STR | Sender's public key. |
| **receiver** | STR | Receiver's public key. |
| **model_object** | STR | The name of the model object that handles this message. |
| **data** | JSON object | The payload of the message. |

    drop_message    = "{"
                    'version' : INT,
                    'time_stamp' : LONG,
                    'acknowledge_id': STR,
                    'sender' : STR,
                    'receiver' : STR,
                    'model_object' : STR,
                    'data' : { ... }
                    "}"

####### Acknowledging
The drop client automatically acknowledges each incoming drop message.
In order to acknowledge message `N`, the client generates a drop messages where
`acknowledge_id` is `N`. The `data` field of an acknowledge message is undefined.
Messages with the `acknowledge_id` set to `0` (zero) are not acknowledged.

### Send a Drop Message

#### Task

Alice sends a drop message to Bob's drop ID.

#### Prerequisites

* Bob is contact of Alice
    - Alice knows Bob's drop URL and public key

#### Process

1. Client encrypts the drop message with Bob's public key in a noise box
1. Client sends a POST request with the encrypted drop message to Alice' drop URL
1. Server processes the drop message
    - If message fulfills the requirements
        1. Server stores the drop message in the requested drop ID
        1. Server responses with the HTTP status code 200
    - Else
        1. Server responses with a HTTP status code 4xx (see above)
        1. Client retries submitting the drop message

### Receive Drop Messages

#### Task

Bob receives drop messages from his drop ID. Therefor he only requests new messages which arrived since his last request.

#### Prerequisites

* Bob has his drop URL and private key

#### Process

1. Client sends a GET request to the drop URL with a if-modified-since header including the timestamp of the last request
1. Server processes the GET request
    - If new messages arrived
        1. Server responses the new drop messages with the HTTP status code 200
        1. Client tries to decrypt the drop messages with Bob's private key
            - The successful decrypted messages are processed
                1. If the sender requested an acknowledgment, the message is acknowledged by sending a new drop message (see )
            - All other messages are discarded
    - Else
        1. Server responses with a HTTP status code x04 (see above)


### Sequence diagrams

#### Send message:
![Sequence diagram send message](/images/sequencediagram_send_messages.png)

#### Receive messages:
![Sequence diagram receive messages](/images/sequencediagram_receive_messages.png)
