## Scope of the Threat Model

The threat model exhaustively lists what an attacker can learn about a user.
As the computers running a Qabel client or server could be compromised by an
attacker, the threat model also lists the capabilities of Qabel clients and
servers.

This document does not list other things an attacker could achieve, like
blocking access to a Qabel server. It also assumes the user doesn't do
something as stupid as uploading the secret key material onto a public server.

> Note: The existing Qabel software doesn't implement these requirements yet,
> and this document is still in a state of flux. 
> Please add and question existing entries.

**Question: What changes if a user is using Tor?**


## Assumptions

This section lists assumptions about the used techniques, protocols and services.

### TLS

TLS authenticates the server to the client.




## Threats

### Local network attacker

A local network attacker can learn:

1. From the characteristic package sizes, an attacker can learn, that a user is using a Qabel Storage Server.
2. An attacker can learn, that a user communicates with a Qabel Drop Server.
3. By trying all public keys known to him an attacker can learn which user signed a given Drop Message.

Questions:

* How much can an attacker learn from correlating different connections to a Qabel Storage server? 
  Without proper transport encryption there is no protection at all.

### Qabel Drop Server

A Drop Server can learn:

1. A Drop Server learns how many distinct clients are using the server.

### Qabel Storage Server

A Storage Server can learn:

1. A Storage Server learns who owns a given Storage Volume.
2. A Storage Server learns which IP addresses download a given Storage Blob.
3. From the used URL a Storage Server learns who most likely uploaded a Storage Blob.

Problem:

* A Storage Server should *not* learn that much about relations between users.

### A users Qabel Client

A client knows everything about the user including all plaintext and all secret key material.

### Contacts

A Contact can learn:

1. A contact learns a users public keys (signing and encryption key).
