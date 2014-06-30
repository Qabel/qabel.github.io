# Qabel Drop
## This is the intern documentation of the Qabel Drop

### Words ###

address = qabel address

user 	= person that uses qabel to drop message(s); sender of the message

message = json object that a user wants to drop on the server

client	= qabel client (what the user is using)

server 	= qabel server (its the drop server in this case)

message body = content for the reader


### Attendees ###

* User
* Server

### Use cases:

#### Send message ####
Alice wants to write a message to Bob. Alice has Bobs address, therefor Bob
has an inbox.
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
* Message
*TODO*


### Encryption ###

The serialized JSON string containing the message body is encrypted using AES with a random key of 256 bits. The AES key is encrypted with RSA OAEP Encryption Scheme using the receipients public key and prepended.
