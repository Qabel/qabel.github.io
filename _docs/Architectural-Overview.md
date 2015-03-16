---
title: Architectural Overview
---
![architectural_overview.png](images/architectural_overview.png)

# Client

## Core
* [Bridgehead](../Components-Bridgehead/)
  * Interface between modules and Qabel servers. This is the only component implementing Qabel protocols.
* Util
  * Utility functions (which don't need network), e.g. encoding / decoding messages.
* Config
  * Access to the Qabel client configuration, e.g. various user settings.
* [Contacts](../Components-Contacts/)
  * Access to the Qabel client users address book.

## Modules
Provide the principal functionality end-users expect of the Qabel client. E.g. Mail, XMPP chat, file sync.

* File sync
  * Allows end-users to define folders which will be synced across their devices.
* Mail
  * Local SMTP and IMAP server enabling the end-user to send and receive mails using a traditional mail application. The application data is transmitted using the Qabel protocols.

# Server
* [Qabel Drop Server](https://github.com/Qabel/qabel-drop/wiki)
* [Qabel Storage Server](https://github.com/Qabel/qabel-storage/wiki)
* Browse
  * Will be used to find contacts (similar to PGP keyserver)
* Sync
  * Provides syncing Qabel contacts and Qabel config between an end-user's devices.

# Further reading
For a detailed description of the components see the [table of contents](../Table-of-contents/).
