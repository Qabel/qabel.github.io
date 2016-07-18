---
title: Architectural Overview
---
# **TODO** stack diagram

# Client

## Core
* Platform Interface
  * Interface between client and servers which speaks the Qabel protocols.
* Util
  * Utility functions (which do not need network), e.g. encoding / decoding messages.
* Config
  * Access to the Qabel client configuration, e.g. various user settings.
* [Contacts](../Components-Contacts/)
  * Access to the Qabel client users address book.

# Server

![Architectural Overview](/images/architecturalOverview.png)

* [Drop Server](../Qabel-Protocol-Drop/)
* [Block Server](../Qabel-Protocol-Box/)
* [Accounting Server](../Qabel-Protocol-Box/)
* [Index Server](../Qabel-Index/)

# Further reading
For a detailed description of the components see the sidebar.
