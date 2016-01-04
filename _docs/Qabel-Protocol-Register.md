---
title: "Protocol: register"
---
# Register Specification

## Abstract

Protocols to store, update and search information about users' identities on a server.

## Used services

Qabel Register uses a server with a database.

## Register server

The register server receives a new identity and saves it to the database, if the identity is valid. The request must contain an alias, the drop url and the public key, additionally it can contain an email address and a telephone number.

Every user can search for identities on this server, if the request contains at least one of the previous information.

The server can also update an identity, if the user signs the request with the corresponding private key. The server will check this signature with the public key from the database. If the user wants to update the public key, a new identity has to be created and the old identity can be deleted (if the old private key is known).

### Identity

Create a new identity:

* Resource: /api/v0/create
* Method: POST
* Request data: `{alias: STR, drop_url: STR, pub_key: STR[, email: STR, mobile: STR]}`
* Response data: `{url: STR}`


Update an identity:

* Resource: /api/v0/update
* Method: POST
* Request data: `signed{pub_key: STR[, email: STR, mobile: STR, alias: STR, drop_url: STR]}`
* Response data: `None`

Delete an identity:

* Resource: /api/v0/delete
* Method: POST
* Request data: `signed{pub_key: STR}`
* Response data: `None`

Search and get a list with identities:

* Resource: /api/v0/search
* Method: POST
* Request data: `{alias: STR, drop_url: STR, pub_key: STR, email: STR, mobile: STR}`
* Response data: `{identities: [identity]}`


```SQL
CREATE TABLE identities
(
    public_key  BINARY PRIMARY KEY,
    alias       VARCHAR(255) NOT NULL,
    drop_url    VARCHAR(200) NOT NULL,
    mobile      VARCHAR(128),
    email       VARCHAR(254),
    created_at  DATE NOT NULL,
    updated_at  DATE NOT NULL,
)
```