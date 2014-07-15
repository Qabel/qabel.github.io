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


## Example - A chat module uses the drop component:
1. Alice (sender) writes a message to Bob (recipient).
2. The chat module packs this message into its format - whatever this will be - and passes it to the drop component (including transmission information like sender, recipient and module).
3. The drop component creates a new drop message encapsulating the chat message and containing the transmission information.
4. The drop component pushes the drop message to the dead drop box (inbox) of the recipient.
5. The drop component of the recipient's client fetches the new message(s) from its inbox.
6. After interpreting the drop message of Alice the drop component extracts the drop message payload (the message packed by the chat module) and passes it to the module specified in the message.
7. The chat component processes this message to the actual message written by Alice.
