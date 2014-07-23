# The Sync component
## Abstract
Sync is a core component of Qabel.
It handles synchronizing both [[Contacts|Components-Contact]] and [[Config|Components-Config]] information between multiple clients.

## Why?
First of all, Sync shall be seen as comfort feature.
Sync eases the setup process for Qabel. 

This Qabel setup process is primarily about entering textual access token keys into via Qabel clients' user interfaces. Afterwards a user is allowed to access (at least) his/her Drop&Storage data stored on a Qabel server.

Sync encrypts and stores all these access token keys on the server.

A user who sets up a Qabel client now just needs to have one 'master' key in order to access all the synchronized access token keys - in order to furthermore get access to the Drop&Storage data.