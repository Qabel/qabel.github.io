![architectural_overview.png](images/architectural_overview.png)

# Client

## Core
* Bridgehead
** Is the interface between modules and Qabel server. It (and only this component) speaks the Qabel protocols.
* API
** Provides utility (which don't need network) functions like encoding / decoding messages.
* Config
** Holds the Qabel client configuration.
* Contacts
** Holds the contacts of the Qabel client user.

## Modules
Provide the functionality an end-user of the Qabel client wants. Can be anything from Mail to chat over XMPP.
* FileSync
** Like Dropbox(TM) aka an end-user defines a folder which will be synced across the user's devices.
* Mail
** Provides a local SMTP and IMAP server so an end-user can send and receive mails - using his/her mail app - to/from it. The server (i.e. the module) transports the mails via Qabel.

# Server
* Drop
* Storage
* Browse
** Will be used to find contacts (similar to PGP keyserver)
* Sync
** Provides syncing Qabel contacts and Qabel config between an end-user's devices.