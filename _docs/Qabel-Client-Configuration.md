---
title: Client Configuration
---
# Settings Client Notes

## Abstract
Notes on configuration settings stored on each client.

## Local settings

The preferences are a collection of settings which describe some common settings
for the library, the UI and for the communication with the Qabel servers.

default: true

* poll_interval: default polling interval
* drop_last_update: time of last drop message request; time stamp of the received drop message is used

Summary

        preferences     = "{"
                        'poll_interval' : NUM,
                        'drop_last_update' : STR,
                        "}"

### Common Settings

The next settings are common and often used in the settings group.
The timestamps are in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15).

 * id: The id of the setting structure. This shall be a unique id in the application
 * updated: The timestamp when the settings structure was updated last time
 * created: The timestamp when the settings structure was created
 * deleted: The timestamp when the settings structure was deleted. After a time x this structure will be deleted completely

### Settings

A device stores three types of settings:

 * accounts
 * drop_servers
 * identities

Summary

        Settings        = "{"
                        'accounts' : accounts,
                        'drop_servers' : drop_servers,
                        'identities' : identities
                        "}"

#### Accounts

Accounts are meant for paid service accounting.

The item `accounts` includes an array of account settings structures

Summary

        accounts        = "["
                        account*
                        "]"


#### Account **[TODO]**


#### Drop Servers

The item `drop_servers` includes an array of drop server settings structures

Summary

        drop_servers    = "["
                        drop_server*
                        "]"

#### Drop Server **[TODO]**

#### Identities

The item `identities` includes an array of identity settings structures

Summary

        identities      = "["
                        identity*
                        "]"

#### Identity **[To be reviewed]**

| Key | Description |
| --- | ----------- |
| id | Unique identifier |
| updated, created, deleted | timestamp in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15) |
| alias | Textual, user-defined label identifying this identity (also to other users) |
| email | Email address of the user owning this identity (optional) |
| phone | Phone number of the user owning this identity (optional) |
| private_key | Private, secret part of the key pair |
| public_key | Public part of the key pair |
| drops | List of [urls](../Qabel-Protocol-Drop#url) of the drops where the identity expects to receive messages |


Summary

        identity        = "{"
                        'id': INT,
                        'updated': LONG,
                        'created': LONG,
                        'deleted': LONG,
                        'alias' : NAME,
                        'email': STR,
                        'phone': STR,
                        'keys' :
                                "{"
                                'private_key' : KEY,
                                'public_key' : KEY,
                                "}",
                        'drops' : [URL]
                        "}"