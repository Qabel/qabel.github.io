# Settings Client Notes

## Abstract
Notes on configuration settings stored on each client.

The configuration has two parts. The first part is configuration data which is the same across all clients of this user. This configuration data will be shared using FFSync. The other part is for the local machine only. E.g. polling time, window sizes and alike.

## Description of the items

### Common Settings

The next setting are common and often use in the setting groups.

 * id: The id of the setting structure. This shall be an unique id in the
 application
 * updated: The timestamp when the setting structure was updated last time
 * created: The timestamp when the setting structure was created
 * deleted: The timestamp when the setting was deleted. After a time x this
 structure will be deleted completed

### Local settings

The setting item have two sub items
* preferences
* ffsync_user

        Settings        = "{"
                        'preferences' : preferences,
                        'ffsync_user' : ffsync_user
                        "}"

#### Preferences

The preferences are a collection of setting which describe some common setting
for the library and the UI.

 * use_websockets: The library shall use web sockets for the communication
 with the qabel server
 default: true
 * default_poll_inteval: This setting describe the default poll interval on
 desktop machine
 * default_poll_inteval_wlan: This setting describe the default poll interval
 when the machine using wireless connection. This parameter is for mobile
 devices
 * default_poll_inteval_mobile: This setting describe the default poll interval
 when the machine using mobile connection. This parameter is only for mobile
 connection
 * start_minimized: When this parameter is set the application started in
 background
 * desktop_x: The start point of the GUI in x direction
 * desktop_y: The start point of the GUI in y direction
 * desktop_width: The width of the GUI
 * desktop_height: The height of the GUI

        preferences     = "{"
                        'use_websockets' : BOOL,
                        'default_poll_inteval' : NUM,
                        'default_poll_inteval_wlan' : NUM,
                        'default_poll_inteval_mobile' : NUM,
                        'start_minimized' : BOOL,
                        'desktop_x' : STR,
                        'desktop_y' : STR,
                        'desktop_width' : STR,
                        'desktop_height' : STR
                        "}"

#### FF Sync User

The preferences are a collection of setting which used to communicate with the
FF sync server

 * updated: As decripted in common settings
 * username:
 * mail:
 * password:
 * url:
 * port:
 * key:
 * interval:
 * modified:

        ffsync_user     = "{"
                        'updated': INT,
                        'username': STR,
                        'mail': STR,
                        'password': STR,
                        'url': STR,
                        'port': INT,
                        'key': STR,
                        'interval': INT,
                        'modified': DOUBLE
                        "}"

### Synced settings

The setting item have seven sub items
 * accounts
 * drop_servers
 * block_servers
 * shares
 * uploads
 * identities
 * groups

        Settings        = "{"
                        'accounts' : accounts,
                        'drop_servers' : drop_servers,
                        'block_servers' : block_servers,
                        'shares' : shares,
                        'uploads' : uploads,
                        'identities' : identities,
                        'groups' : groups
                        "}"

#### Accounts

The item "accounts" include an array of account setting structure

        accounts        = "["
                        account*
                        "]"


#### Account

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

The item "drop_servers" include an array of the drop server setting structure

        drop_servers    = "["
                        drop_server*
                        "]"

#### Drop Server

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

The item "block_servers" include an array of the block server setting structure

        block_servers   = "["
                        block_server*
                        "]"

#### Block Server

 * server: Name of the server
 * port: Port to use
 * path: Path on the server
 * auth: Authentification have to use to get or set data

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

The item "uploads" include an array of the upload setting structure

        uploads         = "["
                        upload*
                        "]"

#### Upload

 * block_server_id: Id of the block server setting structure
 * public: Public unique id of the data storage on the server
 * token: Token to upload data to storage
 * revoke_token: Token to delete data storage

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

The item "shares" include an array of the share setting structure

        shares          = "["
                        share*
                        "]"

#### Share

 * basedir: Base dir of the share on the locale device
 * key: Encryption key of the share
 * upload_id: Id of the upload setting structure
 * alias_id: Id of the identity. All contact of this identity can read the
 shared data
 * contacts: Array of the contact ids which can read the shared data

        share           = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'basedir' : PATH,
                        'key': STR
                        'upload_id' : INT,
                        'alias_id' : INT,
                        'contacts' : [LIST OF IDS],
                        "}"

#### Micro Blocks

The item "micro_blocks" include an array of the mirco block setting structure

        micro_blogs     = "["
                         micro_blog*
                        "]"

#### Micro Block

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

The item "identities" include an array of the identity setting structure

        identities      = "["
                        identity*
                        "]"

#### Identity

 * alias: Alias of the user. The user is known with that alias for other users
 * private_key: Private key for encrypt messages for others
 * public_key: Public key for decrypt messages received from other
 * inbox: Inbox URL

        identity        = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'alias' : NAME,
                        'private_key' : KEY,
                        'public_key' : KEY,
                        'inbox' : URL
                        "}"

#### Groups

The item "groups" include an array of the group setting structure

        groups          = "["
                        group*
                        "]"

#### Group

        group           = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'alias' : NAME,
                        'ps_key' : KEY,
                        'inbox' : ID
                        "}"

## JSON structure
Achtung: kein echtes (E)BNF. Quoting (") und Listen (,) valid ergänzen.

### Local settings

        Settings        = "{"
                        'preferences' : preferences,
                        'ffsync_user' : ffsync_user
                        "}"

        preferences     = "{"
                        'use_websockets' : BOOL,
                        'default_poll_inteval' : NUM,
                        'default_poll_inteval_wlan' : NUM,
                        'default_poll_inteval_mobile' : NUM,
                        'start_minimized' : BOOL,
                        'desktop_x' : STR,
                        'desktop_y' : STR,
                        'desktop_width' : STR,
                        'desktop_height' : STR
                        "}"

        ffsync_user     = "{"
                        'updated': INT,
                        'username': STR,
                        'mail': STR,
                        'password': STR,
                        'url': STR,
                        'port': INT,
                        'key': STR,
                        'interval': INT,
                        'modified': DOUBLE
                        "}"

### Synced settings

        Settings        = "{"
                        'accounts' : accounts,
                        'drop_servers' : drop_servers,
                        'block_servers' : block_servers,
                        'shares' : shares,
                        'uploads' : uploads,
                        'identities' : identities,
                        'groups' : groups
                        "}"

        accounts        = "["
                        account*
                        "]"

        account         = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'provider' : STR,
                        'user' : STR,
                        'auth' : STR
                        "}"

        drop_servers    = "["
                        drop_server*
                        "]"

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

        block_servers   = "["
                        block_server*
                        "]"

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

        uploads         = "["
                        upload*
                        "]"

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

        shares          = "["
                        share*
                        "]"

        share           = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'basedir' : PATH,
                        'key': STR
                        'upload_id' : INT,
                        'alias_id' : INT,
                        'contacts' : [LIST OF IDS],
                        "}"

        micro_blogs     = "["
                         micro_blog*
                        "]"

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

        identities      = "["
                        identity*
                        "]"

        identity        = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'alias' : NAME,
                        'private_key' : KEY,
                        'public_key' : KEY,
                        'inbox' : URL
                        "}"

        groups          = "["
                        group*
                        "]"

        group           = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,
                        'alias' : NAME,
                        'ps_key' : KEY,
                        'inbox' : ID
                        "}"
