# Settings Client Notes

## Abstract
Notes on configuration settings stored on each client.

The configuration has two parts. The first part is configuration data which is the same across all clients of this user. This configuration data will be shared using FFSync. The other part is for the local machine only. E.g. polling time, window sizes and alike.

## JSON structure
Achtung: kein echtes (E)BNF. Quoting (") und Listen (,) valid ergänzen.

*Anmerkung:* Einzelne Kontakte, Ids, Server haben noch zusätzlich die Felder "created", "updated", "deleted". Bitte im Source nachsehen, muss noch eingearbeitet werden.

### Local settings

        Settings        = "{"
                        'preferences' : preferences,
                        'ffsync_user' : ffsync_user
                        "}"

        preferences     = "{"
                        'use_websockets' : BOOL,
                        'default_poll_inteval' : NUM,
                        'start_minimized' : BOOL,
                        'ffsync_url' : URL,
                        'ffsync_auth' : STR,
                        'desktop_x' : STR,
                        'desktop_y' : STR,
                        'desktop_width' : STR,
                        'desktop_height' : STR
                        "}"

        ffsync_user     = "{"
                        'id': INT,
                        'updated': INT,
                        'created': INT,
                        'deleted': INT,                        
                        'username': STR,
                        'mail': STR,
                        'password': STR,
                        'url': STR,
                        'port': INT,
                        'key': STR,
                        'interval': INT,
                        'modified': 1401731802.81
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
                        'provider' : STR,
                        'user' : STR,
                        'auth' : STR
                        "}"

        drop_servers    = "["
                        drop_server*
                        "]"

        drop_server     = "{"
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
                        'uuid': INT,
                        'server' : STR,
                        'port' : INT,
                        'path' : STR,
                        'auth' : STR
                        "}"

        uploads         = "["
                        upload*
                        "]"

        upload          = "{"
                        'uuid' : INT,
                        'block_server_id' : INT,
                        'public' : STR,
                        'token' : STR,
                        'revoke_token': STR,
                        "}"

        shares          = "["
                        share*
                        "]"

        share           = "{"
                        'uuid' : INT,
                        'basedir' : PATH,
                        'key': STR
                        'upload_id' : INT,
                        'alias_id' : INT,
                        'contacts' : [LIST OF IDS],
                        "}"

        micro_blogs    = "["
                        micro_blog*
                        "]"

        micro_blog     = "{"
                        'uuid' : INT,
                        'basedir' : PATH,
                        'upload_id' : INT,
                        'alias_id' : INT,
                        'contacts' : [LIST OF IDS],
                        "}"

        contacts        = "["
                        contact*
                        "]"

        contact         = "{"
                        'alias' : NAME,
                        'public_key' : KEY,
                        'inbox' : ID,
                        'my_id' : ID,
                        'forename' : STR,
                        'surname' : STR
                        "}"

        identities      = "["
                        identity*
                        "]"

        identity        = "{"
                        'alias' : NAME,
                        'private_key' : KEY,
                        'public_key' : KEY,
                        'inbox' : ID
                        "}"

        groups          = "["
                        group*
                        "]"

        group           = "{"
                        'alias' : NAME,
                        'ps_key' : KEY,
                        'inbox' : ID
                        "}"
