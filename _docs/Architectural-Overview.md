---
title: Architectural Overview
---
# Stack diagram

![Architectural Overview](/images/architectual_overview.png)

# Client

![Architectural Overview](/images/client_pyramide.png)

# Core-API

It is the platform interface between client and servers which speaks the Qabel protocols.

# Server

![Architectural Overview](/images/server_architecture.png)

* [Drop Server](../Qabel-Protocol-Drop/)
* [Block Server](../Qabel-Protocol-Box/)
* Accounting Server
  * Managing Qabel accounts.
* [Index Server](../Qabel-Index/)
* Billing
  * Specific interface between an external shop system to the quota API from the accounting server.

# Further reading

For a detailed description of the components see the sidebar.
