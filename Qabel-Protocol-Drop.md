# Dead Drop Specification
## Abstract

A protocol to write and read from a Qabel drop server.

## Protocol

### Structure of the Endpoint URL
The URL to access a drop on a qabel drop server can be split into four parts, protocol, server address (incl. port), service path and drop ID:

- Protocol is http or https.
- Server address is an IP (IPv4 or IPv6) or a DNS host address. For non-standard ports, the port number gets appended.
- The service path is the base path of the server (e.g. URL of the PHP script or mapping in the reverse proxy). The path includes the leading slash ("/").
- a valid URL of a drop always contains the drop ID.

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

### Drop IDs

Drops are identified by a bit value of a certain length as ID. Coding is "URL friendly Base64".
See "RFC 4648": http://www.ietf.org/rfc/rfc4648.txt "Base 64 Encoding with URL and Filename Safe Alphabet".
Proposed is 256 bit (32 byte) secure random number. (This is on par with 43 ASCII bytes.)

### Methods

Available are the REST methods GET, HEAD and POST.

#### GET

The GET method asks for a complete drop or a defined part of the newest entries.


##### Return values

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

#### HEAD

The HEAD method determines if a drop is filled or if a new message has arrived.

##### Return values

Delivers HTTP 400 if the drop ID is missing or invalid.
Delivers HTTP 404 if the drop is empty.
Delivers HTTP 200 if the drop contains messages.

Optional with if-modified-since header:

Delivers HTTP 404 if the drop is empty.
Delivers HTTP 304 if the drop doesn't contain any messages since 'if-modified-since'.
Delivers HTTP 200 if the drop contains new messages since 'if-modified-since'.

No HTTP body gets returned.

#### POST

With the POST method a new message gets added to a drop.
The drop can already contain messages or be empty/unused.

##### Return values

Delivers HTTP 400 if the drop ID is missing or invalid.
On success: delivers HTTP 200 and adds the message to the drop.
The message has to be transmitted as HTTP body.
The HTTP body is a uncoded 8-bit stream.
If the sent message exceeds the maximum message size of (2KB(?)), then the server responds with HTTP 413 (Request Entity Too Large).

No HTTP body gets returned.