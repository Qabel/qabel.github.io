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
 * poll_interval_wlan: This setting describes the default polling interval
 when the machine is using wireless connection. This parameter is for mobile
 devices
 * poll_interval_mobile: This setting describes the default polling interval
 when the machine is using mobile connection. This parameter is only for mobile
 connection
 * drop_last_update : when the core asked the last time messages from the drop servers. It save the time stamp string as received from the Drop Message
 * modules : Each module shall save there local configuration in this area. The key of JSON Object have to be the name of the module. The core provides getter and setter method. 

Summary

        preferences     = "{"
                        'poll_interval' : NUM,
                        'poll_interval_wlan' : NUM,
                        'poll_interval_mobile' : NUM,
                        'drop_last_update' : STR,
                        'modules' : { KEY : { ... }, ... }
                        "}"

## Synced settings

### Common Settings

The next settings are common and often used in the settings group.

 * id: The id of the setting structure. This shall be a unique id in the application
 * updated: The timestamp when the settings structure was updated last time
 * created: The timestamp when the settings structure was created
 * deleted: The timestamp when the settings structure was deleted. After a time x this structure will be deleted completely

### Settings

This settings items has seven sub items
 * accounts
 * drop_servers
 * block_servers
 * uploads
 * identities
 * modules

Summary

        Settings        = "{"
                        'accounts' : accounts,
                        'drop_servers' : drop_servers,
                        'block_servers' : block_servers,
                        'uploads' : uploads,
                        'identities' : identities
                        'modules' : { KEY : { ... }, ... }
                        "}"

#### Accounts

The item "accounts" includes an array of account settings structures

Summary

        accounts        = "["
                        account*
                        "]"


#### Account

Summary

        account         = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'provider' : STR,
                        'user' : STR,
                        'auth' : STR
                        "}"

#### Drop Servers

The item "drop_servers" includes an array of drop server settings structures

Summary

        drop_servers    = "["
                        drop_server*
                        "]"

#### Drop Server

Summary

        drop_server     = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'url' : URL,
                        'auth' : STR,
                        'active' : BOOL,
                        'websockets' : BOOL,
                        'poll_interval' : NUM
                        "}"

#### Block Servers

The item "block_servers" includes an array of block server settings structures

Summary

        block_servers   = "["
                        block_server*
                        "]"

#### Block Server

 * server: Name of the server
 * port: Port to use
 * path: Path on the server
 * auth: Authentification to use to get or set data

Summary

        block_server    = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'server' : STR,
                        'port' : INT,
                        'path' : STR,
                        'auth' : STR
                        "}"

#### Uploads

The item "uploads" includes an array of upload settings structures

Summary

        uploads         = "["
                        upload*
                        "]"

#### Upload

 * block_server_id: Id of the block server settings structure
 * public: Public unique id of the data storage on the server
 * token: Token to upload data to storage
 * revoke_token: Token to delete data from storage

Summary

        upload          = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'block_server_id' : INT,
                        'public' : STR,
                        'token' : STR,
                        'revoke_token': STR,
                        "}"

#### Identities

The item "identities" includes an array of identity settings structures

Summary

        identities      = "["
                        identity*
                        "]"

#### Identity

 * alias: Alias of the user. The user is known with that alias to other users
 * private_key: Private key to decrypt messages to this identity
 * inbox: Inbox URL

Summary

        identity        = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'alias' : NAME,
                        'private_key' : KEY,
                        'inbox' : URL
                        "}"

#### Modules

Each module shall save there local configuration in this area. The key of JSON Object have to be the name of the module. The core provides getter and setter method. 
