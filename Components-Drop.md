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


The drop protocol enables participants to *anonymously* and *asynchronously* exchange short *encrypted* messages.
Encrypted messages are sent to a Drop server where they will be stored for a certain time for arbitrary recipients.
Right now this principle can generally as well be implemented with established services, like public IMAP mail boxes.
The protocol shown here with its explicitly limited amount of operations allows to set up drop servers and maintain them safely.

In the following text a short overview of the goals and strategies will be given. Afterwards details of the protocol will be specified.

## Example - A chat module uses the drop component:
1. Alice (sender) writes a message to Bob (recipient).
2. The chat module packs this message into its format - whatever this will be - and passes it to the drop component (including transmission information like sender, recipient and module).
3. The drop component creates a new drop message encapsulating the chat message and containing the transmission information.
4. The drop component pushes the drop message to the drop box (inbox) of the recipient.
5. The drop component of the recipient's client fetches the new message(s) from its inbox.
6. After interpreting the drop message of Alice the drop component extracts the drop message payload (the message packed by the chat module) and passes it to the module specified in the message.
7. The chat component processes this message to the actual message written by Alice.

![example diagram for sending a chat message via drop](https://github.com/Qabel/intern-doc/wiki/images/example_drop_sending-chat-message.png)



## Idea
Qabel Drop is like an openly visible and publicly accessible array of
mail boxes where everyone can put messages in a box or can observe the
present content of a box.

If two or more people want to secretly share information, they
conspire and choose one box as well as an encryption that only they will
understand.
The possessor of the information puts his encrypted message in the
chosen box.  Later on, the other conspiracy members visit the chosen
box and read the deposited message.

So far, every outsider can watch the conspiracy, see the
disposition of the message as well as the visits of the other members.
He might even go to the box himself and try to decrypt the deposited
message (which is unlikely to succeed if the encryption is good).
Imagine other, independent groups choosing boxes for disposition of
encrypt messages. By chance, two groups may choose the same box so
that two differently encrypted messages are in the box. Observing their
box, the members of both groups might be irritated by the foreign,
unreadable message, but are nevertheless able to read their own
message.
Now, an outsider can not tell to which visitor of the box belongs to
which group.

Imagine further, that the depositors as well as the visitors not only
go directly to their chosen box, but also leave fake messages into
arbitrary other boxes and observe the content of arbitrary other
boxes.

That's how Qabel Drop works!



## Goals and Principles

### Anonymity
The communication shall be anonymous.
Ideally no participant of the communication is identifiable.
Within the protocol, users of the system will not be identified; there is no user administration, the system is open and public.

On network level, and depending on the amount of access a potential attacker is having, total anonymity is hard to reach.
At least at the server, the communication is coming in and is identifiable.
The fact of communication happening cannot be totally hidden, but obscured.
Because the necessary IP connections are visible in principal, total anonymity isn't reachable within the borders of this protocol.
Additional layers like for example Tor can make a contribution to securing the connections.

Therefore our weakened demand is, that at least not two (or n) participants of a communication can be identified. So the anonymity of the existence of a communication between persons is given, but not the anonymity of all users of the system.

The anonymity of all participants among each other is given in the system itself. But depending on the identification of the messages within the encryption and on the use case it can be intentionally abolished. 


#### Plausible Deniability of a communication activity
A drop user cannot deny that he accessed a drop server, read or deposited messages unless he takes
further actions to prevent the identifiability of his communication endpoint. By default, an attacker
(e.g. Man-in-the-Middle, corrupted server) could observe the IP address of the users.

What he can deny, his relation to other users. The mere fact, that two users accessed the same drop
does not necessarily imply, that they communicated with each other.
Each user can plausibly argue, that his access to the drop was not deliberately, but caused by message and
access faking of his Qabel Drop Client.


### Server and Protocol Design
#### Paradigm
* Servers are universal and lightweight.
* Simple server via HTTP/REST.

#### HTTP
The communication is standard compliant HTTP, running ideally over standard IANA ports. Therefore from outside it is not distinguishable from other HTTP traffic (web).
Moreover it is ensured, that the communication can be operated over arbitrary proxies and proxy cascades.
The single participants must not be distinguishable. No individualized header data like cookies is allowed.

#### Why HTTP?
The protocol is built upon HTTP. A tight set of HTTP methods and standard header fields is supported.
The server can run on its own, where indicated behind a reverse proxy or in a existing http environment (e.g. PHP, Rails, ...).
The protocol however can run on arbitrary ports or, in an existing environment, be installed in an arbitrary path.

#### Authentication
There must not be an individual authentication of the clients. Ideally the access is public, alternatively with an authorization procedure, which does not identify the clients (common token, e.g. a pre-shared key).

Because of the usage of HTTP on standard ports potential constrictions like blocked SMTP ports can be circumvented.
Therefore the protocol is hard to block, a little bit more difficult to select/analyze and less meta data is accumulated.

Existing solutions like the flexible XMPP (e.g. Chrome Sync) are too extensive and too complex. An analysis of the communication would be made easier.

From the outside the protocol is not distinguishable from normal HTTP traffic (browsing, download, webservices).
A deep packet inspection would show the usage of the protocol itself and identify a drop server, but actual content analysis is not possible.

### Encryption
The messages and direct meta data are encrypted.

The content of the communication should not reach the outside.
Messages that are exchanged between clients are completely encrypted. Corresponding meta data like lists of recipients, encryption methods and parameter are opaque in the encrypted block.
The server cannot make assumptions over the structure or even the content.
A possible authentication of the sender is happening inside of the encrypted message.


The details of the encryption lie within the clients. Here we assume a public key procedure, whose negotiation process is happening outside of the drop protocol. Hence the actual content of the messages is pure cypher text.
The protocol cannot enforce this, in principle any message can be exchanged. This is the task of a higher protocol level.

### Collected data
The only meta data used by the server is the incoming time of a message and the used channel. This key is used for polling for new messages (as new-messages-since-date).

It is to bear in mind that additional meta data accumulates during the communication: Length of the messages, sender or the last proxy/exit of a cascade.


### Messages are asynchronous

The server is buffering the incoming messages for a later call from the recipient.
The size of the buffer is unlimited in space and duration.
The sender and the recipient therefore don't need to exchange data directly and don't need to know each other either.
This isn't necessarily usable for the key exchange or a first contact of the communication partners. For this a additional channel is required. (Out-of-band)

## Flow of the Communication

For a given partner of the communication the sender uses a drop, consisting of drop server and drop ID, the recipient is checking on a regular basis.
This information, as well as used encryption methods and keys, has been given beforehand to the sender by the recipient.
To consign a message the sender encrypts the plain text and puts the encrypted message (ciphertext) into a drop.

In order to make sure that the actual communication between Alice and Bob cannot be retraced, the message on the server neither contains meta data of the sender nor of the recipient. Those are inside of the encrypted message.
With this no correlation of the communication partners is possible. On the other hand the recipients cannot select the messages send to them.
The protocol stipulates, that all recipients poll selected and additionally random drops on a regular basis and receive all new messages. Only a successful decryption determines that the message is actually for the recipient.
It is a Subscribe to Broadcasts via polling - like in the classifieds analogy we used above.

To be more concrete: A client has to read *all* messages of a channel (drop), in order to filter out the ones meant for him. Further, a client has to read *all* messages from other drops which it doens't use for valid communication. This produces a communication overhead, but ensures the anonymity of the communication itself if these drops are also used by other valid clients.
So it can only be determined that somebody is participant in the whole system, but not who his communication partners are.

Random drop messages into actually used and additionally chosen random drop ID are used to further obfuscate real communication.

It is crucial that a drop is used by more than two clients in order to obfuscate these communication partners. If only two valid clients are using a drop, these communication partners could be identified by the server. A client has no possibility to detect if other messages in a drop are communications between real clients or forged by a malicious server. A malicious server might place forged messages into a drop and the valid clients using this drop would assume that other valid clients are using this drop. The server could filter the forged drop messages and detect the identities of the valid client communicating in this drop.

## Collisions of drop IDs and scalability

It is crucial that different clients are using the same drop ID for their communication. However, not too many clients should use the same drop ID in order to keep the amount of messages addressed to other recipients on a reasonable level. Finding a way to force colliding drop IDs, while keeping the system scalable is a challenging tasks which isn't completely solved yet. Some kind of smart algorithm has to be developed which relies its scaling choices only on trustworthy data.

To fully obfuscate a communication, clients should leave drop messages in randomly chosen drops and also check random drops for new messages. Of course these randomly chosen drops have to collide with randomly chosen drops of other clients.
## Access rights

The access for reading and writing (creation of new messages) is free and anonymous. Clients cannot delete or change messages.
Drop servers can optionally be limited to a certain circle of participants (company in-house, etc.).
Access to those private drop servers is granted by using a shared secret for all clients.

