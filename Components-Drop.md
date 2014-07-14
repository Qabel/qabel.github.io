# The drop component
## Abstract
The drop component is a core component of Qabel. It serves the general communication channel between clients.

This could include:
* Establishing contact and notification to update contact info
* Announcement of an uploaded file
* Announcement of an created/updated/removed share
* Microblogging messages
* Chat messages

This list can be extended as needed.
1. asd


## Example - A chat module uses the drop component:
1. Alice (sender) writes with a chat module a message to Bob (recipient).
2. The chat module packs this message into its format - whatever this will be passes this to the drop component. 
