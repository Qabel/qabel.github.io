# Dead Drop Specification

## Abstract

The dead drop (drops protocol) enables participants to *anonymously* and *asynchronously* exchange short *encrypted* messages.
Encrypted messages get send to a Drop server where they will be stored for a certain time for arbitrary recipients.
Right now this principle can generally as well be implemented with established services, like public IMAP mail boxes.
This protocol shown here however and the explicitly limited amount of operations allow additionally to set up drop servers and to safely maintain them.

In the following text a short overview of the goals and strategies will be given. Afterwards details of the protocol will be specified.


## Idea

A dead drop is used for an obscure transmission of secret messages.
It usually is a physical object, which is especially prepared to contain messages. Only sender and recipient know the place and the specific characteristics of the object. The sender leaves a message. Then he either signals the recipient at a different place that a message has been left or the recipient checks regularly for new messages. If need be a conformation of receipt can be left at a different place.

See "Wikipedia":http://en.wikipedia.org/wiki/Dead_drop


For the here described protocol a slightly different metaphor could be applied:
It is possible, but a bit laborious, to exchange encrypted messages via classifieds in newspapers. Those can be read by everybody, but only the intended recipient is supposed to be able to make use of them.
The sender has to deliver the message (while giving up a little bit of his anonymity).
It might be possible to detect that a communication is happening, but it is difficult to identify the participants.
Messages cannot be deleted or changed, but they expire after some time.

IMPORTANT: Messages in the protocoll are not necessarily persistent. They exist only temporarily with delayed expiration. The actual expiration date is depended upon disk space and other configurations, which will be defined later on.

## Goals and Principles

The communication shall be anonymous.
Ideally no participant of the communication is identifiable.
Within the protocol users of the system will not be identified; there is no user administration, the system is open and public.

On network level, and depending on the amount of access a potential attacker is having, total anonymity is hard to reach.
At least at the server the communication is coming in and is identifiable.
The fact of communication happening cannot be totally hidden, but obscured.
Because the necessary IP connections are visible in pricipal, total anonymity isn't reachable within the borders of this protocol.
Additional layers like for example Tor can make a contribution to securing the connections.

Therefor our weakened demand is, that at least no two (or n) participants of a communication can be identified. So the anonymity of the existence of a communication between persons is given, but not the anonymity of all users of the system.

The anonymity of all participants among each other is given in the system itself. But depending on the identification of the messages within the encryption and on the use case it can be intentionally abolished. 


Plausible Deniability of a communication activity
It is possible to conclude the existence of a communication. But the participants cannot be completely identified.
There is no direct addressing of messages.
One possibility of anonymity of the communication relation is the usage of a common pool of messages, out of which all participants read all messages and only then test for the right recipient.

Servers are universal and lightweight.
Simple server via HTTP/REST.

The communication is standard compliant HTTP, running ideally over standard IANA ports. Therefor from outside it is not distinguishable from other HTTP traffic (web).
Moreover it is ensured, that the communication can be operated over arbitrary proxies and proxy cascades.
The single participants must not be distinguishable. No individualized header data like cookies is allowed.
There must not be an individual authentication of the clients. Ideally the access is public, alternatively with an authorization procedure, which does not identify the clients (common token, e.g. a pre-shared key).

The protocol is building upon HTTP. A tight set of HTTP methods and standard header fields is supported.
The server can run on its own, where indicated behind a reverse proxy or in a existing http environment (e.g. PHP, Rails, ...).
The protocol however can run on arbitrary ports or, in an existing environment, be installed in an arbitrary path.

Because of the usage of HTTP on standard ports potential constrictions like blocked SMTP ports can be circumvented.
Therefor the protocol is hard to block, a little bit more difficult to select/analyze and less meta data is accumulated.

Existing solutions like the flexible XMPP (e.g. Chrome Sync) are too extensive and too complex. An analysis of the communication would be made easier.

From the outside the protocol is not distinguishable from normal HTTP traffic (browsing, download, webservices). A deep packet inspection would show the usage of the protocol itself and identify a dead drop server, but actual content analysis is not possible.


The messages and direct meta data are encrypted.

The content of the communication should not reach the outside.
The between the clients exchanged messages are completely encrypted. Corresponding meta data like lists of recipients, encryption methods and parameter are opaque in the encrypted block. The server cannot make assumptions over the structure or even the content.
A possible authentication of the sender is happening inside of the encrypted message.


The details of the encryption lie with the clients. Here we assume a public key procedure, whose negotiation process is happening outside of the dead drop protocol. Hence the actual content of the messages is pure cypher text.
The protocol cannot enforce this, in principle any message can be exchanged. This is the task a a higher protocol level.

The only meta data used by the server is the incoming time of a message and the used channel. This key is used for polling for new messages (as new-messages-since-date).

It is to bear in mind that additional meta data accumulates during the communication: Length of the messages, sender or the last proxy/exit of a cascade.


Messages are asynchronous

The server is buffering the incoming messages for a later call from the recipient.
The size of the buffer is unlimited in space and duration.
The sender and the recipient therefor don't need to exchange data directly and don't need to know each other either.
This isn't necessarily usable for the key exchange or a first contact of the communication partners. For this a additional channel is required. (Out-of-band)


## Flow of the Communication

For a given partner of the communication the sender uses a drop, consisting of drop server and drop ID, the recipient is checking on a regular basis.
This information, as well as used encryption methods and keys, has been given beforehand to the sender by the recipient.
To consign a message the sender encrypts the plain text and puts the encrypted message (ciphertext) into a drop.

In order to make sure that the actual communication between Alice and Bob cannot be retraced, the message on the server neither contains meta data of the sender nor of the recipient. Those are inside of the encrypted message.
With this no correlation of the communication partners is possible. On the other hand the recipients cannot select the messages send to them.
The protocol stipulates, that all recipients poll selected drops on a regular basis and receive all new messages. Only a successful decryption determines that s message is actually for the recipient. 
It is a Subscribe to Broadcasts via polling - like in the classifieds analogy we used above.

To be more concrete: A client has to read *all* messages of a channel (drop), in order to filter out the ones meant for him.
This is producing a communication overhead, but is ensuring the anonymity of the communication itself.
So it can only be determined that somebody is participant in the whole ystem, but not which his communication partners are.


## Access rights

The access for reading and writing (generation of new messages) is free and anonymous. Clients cannot delete or change messages.
Optionally drop servers can be limited to a certain circle of participants (company in-house, etc.).
Those private drop servers define a shared password used by all clients.


## Drop IDs

Drops are identifief by a bit value of a certain length as ID. Coding is "URL friendly Base64".
See "RFC 4648": http://www.ietf.org/rfc/rfc4648.txt "Base 64 Encoding with URL and Filename Safe Alphabet".
Proposed is 256 bit (32 byte) secure random number. (This is on par with 43 ASCII bytes.)


## Memory / Data Model for Drop

A server contains all possible (possibly not manifested= drop IDs. Each of these contain the single messages as a FIFO ordered by the time of their arrival.

The messages get managed separatedly by drop.

## Structur of the Endpoint URL

The Drop URLs are composed of protocol, server address (incl. port), service path and drop ID:

- Protocol is http or https.
- Server address is an IP (IPv4 or IPv6) or a DNS host address. For non-standard ports, the port number gets appended.
- The service path is the basis path of the server (e.g. URL of the PHP script or mapping in the reverse proxy). The path includes the leading slash ("/").
- Valid full URLs of a drop always and with the drop ID.

In "BNF":http://www.w3.org/Addressing/URL/5_BNF.html "Notation":http://www.w3.org/Notation.html of the W3C:

dropurl ::= protocol "://" serviceaddress servicepath "/" dropid
protocol ::= "https" | "http"
serveraddress ::= IPv4 | IPv6 | DNSName
serverport ::= "1" - "65535"
serviceaddress ::= serveraddress ( ":" serverport ) ?
servicepath ::= "/" [ URLChars, "/" ] *
friendlybase64char ::= [ "A" - "Z", "a" - "z", "0" - "9", "-", "_" ]
dropid ::= <43>*friendlybase64char

Example: http://d.example:1234/tools/drop/xzjall...aatr42


## Methods

Available are the REST methods GET, HEAD and POST:

### GET

The GET method asks for a complete drop or a defined part of the newest entries.


#### Return values

Delivers HTTP 400 if the drop ID is missing or invalid.

Delivers HTTP 404 if the drop is empty.

Delivers HTTP 200 if the drop contains messages.

Optional with if-modified-since header:

Delivers HTTP 404 if the drop is empty.
Delivers HTTP 304 if the drop doesn't contain any messages since 'if-modified-since'.
Delivers HTTP 200 if the drop contains new messages since 'if-modified-since'.

The HTTP body gets returned as MIME multipart of the single messages.

MIME Multipart:
The 'Content-Type' is 'multipart/mixed'.
Each individual part has a 'Content-Type' of 'application/octet-stream' and a 'Date' header.
The messages are uncoded 8-bit streams.

### HEAD

The HEAD method determines if a drop is filled or if a new message has arrived.

#### Return values

Delivers HTTP 400 if the drop ID is missing or invalid.
Delivers HTTP 404 if the drop is empty.
Delivers HTTP 200 if the drop contains messages.

Optional with if-modified-since header:

Delivers HTTP 404 if the drop is empty.
Delivers HTTP 304 if the drop doesn't contain any messages since 'if-modified-since'.
Delivers HTTP 200 if the drop contains new messages since 'if-modified-since'.

No HTTP body gets returned.

### POST

With the POST method a new message gets added to a drop.
The drop can already contain messages or be empty/unused.

#### Return values

Delivers HTTP 400 if the drop ID is missing or invalid.
On success: delivers HTTP 200 and adds the message to the drop.
The message has to be transmitted as HTTP body.
The HTTP body is a uncoded 8-bit stream.

No HTTP body gets returned.