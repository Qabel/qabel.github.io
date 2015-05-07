---
title: Client Configuration
---
# Settings Client Notes

## Abstract
Notes on configuration settings stored on each client.

The configuration has two parts. The first part is configuration data which is the same across all clients of this user. This configuration data will be synchronized later (in beta only basic sync). The other part is for the local machine only. E.g. polling time, window sizes and alike. These two parts are stored in individual files.

## Local settings

The preferences are a collection of settings which describes some common settings
for the library and the UI.

 with the qabel server
 default: true
 * poll_interval: This setting describes the default polling interval on
 desktop machine
 * drop_last_update : when the core asked the last time messages from the drop servers. It save the time stamp string as received from the Drop Message
 * module_data : Each module shall save there local configuration in this area. The key of JSON Object have to be the name of the module. The core provides getter and setter method. 

Summary

        preferences     = "{"
                        'poll_interval' : NUM,
                        'drop_last_update' : STR,
                        'module_data' : { KEY : { ... }, ... }
                        "}"

## Synced settings

### Common Settings

The next settings are common and often used in the settings group.
The timestamps are in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15).

 * id: The id of the setting structure. This shall be a unique id in the application
 * updated: The timestamp when the settings structure was updated last time
 * created: The timestamp when the settings structure was created
 * deleted: The timestamp when the settings structure was deleted. After a time x this structure will be deleted completely

### Settings

This settings items has seven sub items
 * accounts
 * drop_servers
 * storage_servers
 * storage_volumes
 * identities
 * module_data

Summary

        Settings        = "{"
                        'accounts' : accounts,
                        'drop_servers' : drop_servers,
                        'storage_servers' : storage_servers,
                        'storage_volumes' : storage_volumes,
                        'identities' : identities
                        'module_data' : { KEY : { ... }, ... }
                        "}"

#### Accounts

Accounts are meant for paid service accounting.
Accounts are not part of the Qabel Client's beta release.

The item `accounts` includes an array of account settings structures

Summary

        accounts        = "["
                        account*
                        "]"


#### Account

| Key | Description |
| --- | ----------- |
| id | Unique identifier |
| updated, created, deleted | timestamp in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15) |
| provider | TODO |
| user | TODO |
| auth | TODO |


Summary

        account         = "{"
                        'id': INT,
                        'updated': LONG,
                        'created': LONG,
                        'deleted': LONG,
                        'provider' : STR,
                        'user' : STR,
                        'auth' : STR
                        "}"

#### Drop Servers

The item `drop_servers` includes an array of drop server settings structures

Summary

        drop_servers    = "["
                        drop_server*
                        "]"

#### Drop Server

| Key | Description |
| --- | ----------- |
| id | Unique identifier |
| updated, created, deleted | timestamp in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15) |
| url | [URL](../Qabel-Protocol-Drop#url) of the drop server (excluding the drop id) |
| auth | Credential for optional, additional [access regulation](../Components-Drop#unrestricted-access) (e.g. a group password). |
| active | Status flag |

Summary

        drop_server     = "{"
                        'id': INT,
                        'updated': LONG,
                        'created': LONG,
                        'deleted': LONG,
                        'url' : URL,
                        'auth' : STR,
                        'active' : BOOL
                        "}"

#### Storage Servers

The item "storage_servers" includes an array of storage server settings

Summary

        storage_servers   = "["
                        storage_server*
                        "]"

#### Storage Server

 * server: Name of the server
 * port: Port to use
 * path: Path on the server
 * auth: Authentification to use to get or set data

| Key | Description |
| --- | ----------- |
| id | Unique identifier |
| updated, created, deleted | timestamp in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15) |
| url | URL of the [storage server](../Qabel-Protocol-Storage#url), excluding `public` which identifies a single Storage Volume on the server |
| auth | Optional credential (see [drop server](#drop-server)) |


Summary

        storage_server    = "{"
                        'id': INT,
                        'updated': LONG,
                        'created': LONG,
                        'deleted': LONG,
                        'url' : URL,
                        'auth' : STR
                        "}"

#### Storage Volumes

The item `storage_volumes` includes an array of storage volume settings

Summary

        storage_volumes = "["
                        storage_volumes*
                        "]"

#### Storage Volume

| Key | Description |
| --- | ----------- |
| id | Unique identifier |
| updated, created, deleted | timestamp in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15) |
| storage_server_id | Id of the storage server |
| public_identifier | identifier of the Storage Volume on the server |
| token | Credential granting write permission to the Storage Volume |
| revoke_token | Credential granting the permission to delete the whole Storage Volume |

Summary

        storage_volume   = "{"
                        'id': INT,
                        'updated': LONG,
                        'created': LONG,
                        'deleted': LONG,
                        'storage_server_id' : INT,
                        'public_identifier' : STR,
                        'token' : STR,
                        'revoke_token': STR,
                        "}"

#### Identities

The item `identities` includes an array of identity settings structures

Summary

        identities      = "["
                        identity*
                        "]"

#### Identity

| Key | Description |
| --- | ----------- |
| id | Unique identifier |
| updated, created, deleted | timestamp in [seconds since epoc](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15) |
| alias | Textual, user-defined label identifying this identity (also to other users) |
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
                        'keys' :
                                "{"
                                'private_key' : KEY,
                                'public_key' : KEY,
                                "}",
                        'drops' : [URL]
                        "}"

#### Module Data

Each module shall save there configuration in this area. The key of JSON Object have to be the name of the module. The core provides getter and setter method. We only provide this version of saving the configuration (for example the sync module will only sync this configuration). 
