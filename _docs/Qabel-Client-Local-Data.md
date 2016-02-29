---
title: Local Data
---
# Locally stored Settings and Information

## Abstract
Information and configuration settings stored on each client.

## Data Types
The types and format of data which is exchanged or can be exported and imported are defined as follows:

| Data type | Definition |
| --- | --- |
| BOOL | Boolean value  |
| INT | 32-bit signed two's complement integer  |
| LONG | 64-bit signed two's complement integer |
| STR | UTF-8 encoded and (if applicable) null terminated |
| KEY | Hex-String with ASCII encoding. Every byte of data is converted into the corresponding 2-digit hex representation. The returned bytes object is therefore twice as long as the length of data.|
| URL | ASCII encoded URIs according to [RFC 3986](http://tools.ietf.org/html/rfc3986)), for Drop URL see [here](../Qabel-Protocol-Drop#url) |
| UUID | 128 bit random number ASCII encoded Universally Unique IDentifier, see [this definition](https://en.wikipedia.org/wiki/Universally_unique_identifier#Definition) |

## Local settings

The preferences are a collection of settings which describe some common settings
for the library, the UI and for the communication with the Qabel servers.

default: true

* poll_interval: default polling interval
* drop_last_update: time of last drop message request; time stamp of the received drop message is used

Summary

        preferences     = "{"
                        'poll_interval' : INT,
                        'drop_last_update' : STR,
                        "}"

## Client Data

A device stores two types of settings and information regarding the user:

 * accounts
 * identities

Summary

        Settings        = "{"
                        'accounts' : accounts,
                        'identities' : identities
                        "}"

It also stores information on the users contacts.

### Accounts

Accounts are meant for paid service accounting. These credentials can be used to gain write access to S3.

The item `accounts` includes an array of account settings structures

Summary

        accounts        = "["
                        account*
                        "]"


### Account

        account         = "{"
                        'username': STR,
                        'email': STR,
                        'password': STR,
                        "}"


### Identities

The item `identities` includes an array of identity settings structures

Summary

        identities      = "["
                        identity*
                        "]"

### Identity

| Key | Description |
| --- | ----------- |
| alias | Textual, user-defined label identifying this identity (also to other users) |
| email | Email address of the user owning this identity (optional) |
| phone | Phone number of the user owning this identity (optional) |
| private_key | Private, secret part of the key pair |
| prefixes | List of [prefixes](../Qabel-Protocol-Box#prefix) this identity owns |
| drop_urls | List of [urls](../Qabel-Protocol-Drop#url) of the drops where the identity expects to receive messages |


Summary

        identity        = "{"
                        'alias' : STR,
                        'email': STR,
                        'phone': STR,
                        'private_key' : KEY,
                        'prefixes': [STR],
                        'drop_urls' : [URL]
                        "}"

#### Export
The name of an exported identity file is "identity-*[identityName]*.qid" where *[identityName]* is replaced by the name of the respective identity.

## Contact Data

Additionally to the data on the user itself information on its contacts can be stored on the device.

Summary

    Contacts        = "{"
                    'contacts' : contacts
                    "}"

### Contacts

The item "contacts" includes an array of "contact"s

Summary

    contacts        = "["
                    contact*
                    "]"

### Contact

The following items define a contact item:

| Key | Description |
| --- | ----------- |
| alias | Alias for the contact |
| email | Email address for the contact (optional) |
| phone | Phone number for the contact (optional) |
| public_key | Public key of the contact |
| drop_urls | Array of drop Urls |

Summary

    contact         = "{"
                    'alias': STR,
                    'email': STR,
                    'phone': STR,
                    'public_key' : KEY,
                    'drop_urls' : [URL],
                    "}"

#### Example

```json
{
  "alias": "Alice",
  "email": "alice@example.org",
  "phone": "+49123456789012",
  "public_key" : "feffe9928665731c6d6a8f9467308308feffe9928665731c6d6a8f9467308308",
  "drop_urls" : ["example.org/jkl"],
}
```

#### Export
The name of an exported contact file is "contact-*[contactName]*.qco" where *[contactName]* is replaced by the name of the respective contact.
