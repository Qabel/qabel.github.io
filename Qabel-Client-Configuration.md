# Settings Client Notes

## Abstract
Notes on configuration settings stored on each client.

The configuration has two parts. The first part is configuration data which is the same across all clients of this user. This configuration data will be shared using FFSync. The other part is for the local machine only. E.g. polling time, window sizes and alike. These two parts are stored in individual files.

## Description of the items

### Common Settings

The next settings are common and often used in the settings group.

 * id: The id of the setting structure. This shall be a unique id in the
 application
 * updated: The timestamp when the settings structure was updated last time
 * created: The timestamp when the settings structure was created
 * deleted: The timestamp when the settings structure was deleted. After a time x this
 structure will be deleted completely

### Local settings

The settings item has these sub items
* preferences
* local_shares
* micro_blogs?

Summary

        Local_Settings        = "{"
                        'preferences' : preferences,
                        'local_shares' : local_shares,
                        'micro_blogs' : micro_blogs
                        "}"

#### Preferences

The preferences are a collection of settings which describes some common settings
for the library and the UI.

 * use_websockets: The library shall use web sockets for the communication
 with the qabel server
 default: true
 * default_poll_interval: This setting describes the default polling interval on
 desktop machine
 * default_poll_interval_wlan: This setting describes the default polling interval
 when the machine is using wireless connection. This parameter is for mobile
 devices
 * default_poll_interval_mobile: This setting describes the default polling interval
 when the machine is using mobile connection. This parameter is only for mobile
 connection
 * start_minimized: When this parameter is set the application is started in
 background
 * desktop_x: The start position of the GUI in x direction
 * desktop_y: The start position of the GUI in y direction
 * desktop_width: The width of the GUI
 * desktop_height: The height of the GUI

Summary

        preferences     = "{"
                        'use_websockets' : BOOL,
                        'default_poll_interval' : NUM,
                        'default_poll_interval_wlan' : NUM,
                        'default_poll_interval_mobile' : NUM,
                        'start_minimized' : BOOL,
                        'desktop_x' : STR,
                        'desktop_y' : STR,
                        'desktop_width' : STR,
                        'desktop_height' : STR
                        "}"

#### Local Shares

The item "local_shares" includes an array of local share settings structures

Summary

        local_shares          = "["
                        local_share*
                        "]"

#### Local Share

 * basedir: Base dir of the share on the locale device

Summary

        local_share           = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'basedir' : PATH,
                        "}"

#### Micro Blogs

The item "micro_blogs" includes an array of micro blog settings structures

Summary

        micro_blogs     = "["
                         micro_blog*
                        "]"

#### Micro Blog

Summary

        micro_blog      = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'basedir' : PATH,
                        "}"

### Synced settings

This settings items has seven sub items
 * accounts
 * drop_servers
 * block_servers
 * shares
 * uploads
 * identities
 * groups

Summary

        Settings        = "{"
                        'accounts' : accounts,
                        'drop_servers' : drop_servers,
                        'block_servers' : block_servers,
                        'shares' : shares,
                        'micro_blogs' : micro_blogs,
                        'uploads' : uploads,
                        'identities' : identities,
                        'groups' : groups
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

#### Shares

The item "shares" includes an array of share settings structures

Summary

        shares          = "["
                        share*
                        "]"

#### Share

 * key: Encryption key of the share
 * upload_id: Id of the upload setting structure
 * alias_id: Id of the identity. All contact of this identity can read the
 shared data
 * contacts: Array of the contact ids which can read the shared data

Summary

        share           = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'key': STR
                        'upload_id' : INT,
                        'alias_id' : INT,
                        'contacts' : [LIST OF IDS],
                        "}"

#### Micro Blogs

The item "micro_blogs" includes an array of micro blog settings structures

Summary

        micro_blogs     = "["
                         micro_blog*
                        "]"

#### Micro Blog

Summary

        micro_blog      = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'basedir' : PATH,
                        'upload_id' : INT,
                        'alias_id' : INT,
                        'contacts' : [LIST OF IDS],
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
