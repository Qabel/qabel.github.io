---
title: "Identity directory"
---
# Identity directory

## Abstract

Identities can be publicly shared in an identity directory provided by the
index server.

All data is sent as JSON (encoded in UTF-8). All data types are defined
[here](../Qabel-Client-Local-Data#data-types).

## Concept & structures

The identity directory can be queried using private data (*fields*),
e.g. an email address or phone number. The index server then
returns matching identites to the requester.

Changes to the directory are submitted as *update requests*. An update
request can associate or de-associate any number of fields with/from
an identity (the combination of a key-pair, a drop URL and an
alias). The association of a particular field with an identity is an
*entry* in the directory. Entries are not unique.

An identity is always represented using this JSON structure:

    {
        "public_key": KEY,
        "drop_url": URL,
        "alias": STR
    }

### Fields

Currently defined fields are:

email
: E-Mail address

phone
: Phone number (must be capable of receiving SMS)

## APIs

### Search

* Resource: /api/v0/search/
* Method: GET
* Request data: field-value pairs (`field=value[&field=value...]`)
* Response data: `{"identities": [identity, ...]}`

When multiple field-value pairs are specified only identities matching
all pairs will be returned.

At least one field-value pair must be specified.

### Update

Atomically create or delete entries (therefore also update entries).

* Resource: /api/v0/update/
* Method: PUT
* Content types:

    * application/json
    * application/vnd.qabel.noisebox+json

    If the content type is plain text it contains an *update
    request*. This is only valid for requests purely made of
    *deletes*.

    If the content is a noise box, then that noise box must be created
    by the key pair the update request refers to and it must be
    encrypted for the servers [ephemeral key](#key).

    (Note: A valid noise box can only be computed by calculating the
    Diffie-Hellman of the requesting key pair and the servers
    ephemeral key. Forging a noise box would be as hard as breaking
    the CDH-Problem.)

    Any update request containing a *create* cannot be executed
    immediately, since they require explicit confirmation by the
    user. The HTTP status code is thus 202 (Accepted) and not
    indicative of the request status.

* Request data: `{"identity": identity, "items": [update item, ...]}`

    Update item:

      {
          "action": STR ("create" or "delete"),
          "field": STR (field name),
          "value": STR (field value)
      }

* Response data: None
* Status code:

    * 202: accepted request, will be executed when user confirms it
    * 204: request executed
    * 400: malformed request
    * 401: cryptography failure, signing key does not match update request public_key,
    * 415: incorrect content type

* When receiving a 415 re-fetch the public key and retry: the server
  may have been restarted.

### Key

Return the ephemeral server public key.

Encrypt noise boxes for the update API with this key as the recipient.

* Resource: /api/v0/key/
* Method: GET
* Request data: None
* Response data: `{"public_key": STR}`
