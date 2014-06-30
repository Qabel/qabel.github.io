# Browse Specification

## Abstract

An open directory to facilitate search and look-up of public key data.
Search is opt-in and data is sealed with public key scheme.

## Scheme

Concerning the Get To Know between the clients:

* A public key and a drop address will be placed on a server.
* The entry is secured by a fingerprint.
* For example it is accessible under http://qabel.me/chrzuck#ab4c2x2yz3

The drop and the public key can just be used read-only by their owner. It should not be possible to further follow the communication.

How to Add: A client accesses public key and drop address from the lookup URL. It then checks the fingerprint. (The fingerprint never gets transmitted to the server!)
The client sends a with this key encrypted contact message to the drop. The message contains its parameters like public key, drop, personal message or a business card URL.

## Server

* The server should offer retrieval as well as creation / update with password.
* The data format of the entries is JSON.
* If a browser accesses the address (and doesn't accept JSON), show a nice page with the message "User 'X' is using Qabel / download here".

## Directory Server

For the Business Version a search function for keywords should be optional. In this case there will be no protection by fingerprint. 