---
title: "Protocol: register"
---
# Register Specification

## Abstract

Protocols to store and search information about the users' identities on a server.

## Used services

Qabel Register uses a server with a database.

## Register server

The register server receives a new identity and saves it to a database, if the identity is valid. The request must contain an alias, the drop url and the public key, addtionally it can contain an email address and a telephone number. Every user can search for an identity on this server, if the request contains at least one of the previous information.


### Identity

Create a new identity:

* Resource: /api/v0/identity
* Method: POST
* Request data: `{alias: STR, drop_url: STR, pub_key: STR[, email: STR, mobile: STR]}`
* Reponse data: `{url: STR}`


Update an identity:

* Resource: /api/v0/identity
* Method: PUT
* Request data: `{alias: STR, drop_url: STR, pub_key: STR[, email: STR, mobile: STR]}`
* Reponse data: `{url: STR}`


Search and get a list with identities:

* Resource: /api/v0/search
* Method: POST
* Request data: `{alias: STR, drop_url: STR, pub_key: STR, email: STR, mobile: STR}`
* Reponse data: `{identities: [identity]}`