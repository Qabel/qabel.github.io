---
title: Threat Model
---
#Threat Model
This model shall provide an overview on the system architecture regarding security. It shall list all attackers and their capabilities. It also shall outline the targeted security goals by describing how they are reached.

##Security Goals
The main targeted goal of Qabel is to require no trust in any entity in order to achieve **confidentiality**, **integrity**, **authenticity** and partly **anonymity**. The first three goals are reached by using Authenticated end-to-end Encryption. The fourth goal cannot fully be reached due to for example storage write access restriction to the authenticated user who pays for the storage. Thus quota is tracked per user.

###Restrictions to Freedom of Trust
The mentioned main goal is limited by unavoidable restrictions like the trust in proper storage of data on the server and possible malware on the client. Hence following trust relationships are required to achieve the mentioned security goals:
* Trust in the client device: the newest original Qabel client software is installed, no malware is installed.
* Trust in the Qabel servers: all sent data is stored properly i.e.: drop messages are stored for sufficient duration on the specified drop server, files are stored permanently (until they are deleted by the client) in the specified directory.
* Trivial assumptions: users keep their credentials and keys secret.

####Further Assumptions
TLS certificates of Qabel servers are not forged by trusted CAs.

##System Overview

###Attacker Types
We distinguish between four attacker types:

1. Contacts of the user,
2. Qabel users which are not connected to the user,
3. Qabel servers,
4. Outside attackers:
  1. Outside attacker who can eavesdrop traffic of the client,
  2. Outside attacker who can eavesdrop traffic of a Qabel drop server,
  3. Outside attacker who can eavesdrop traffic of a Qabel storage server, 
  4. Outside attacker who can eavesdrop traffic of the public Internet (e.g., *DE-CIX Frankfurt*).

![Attacker Types](/images/attackerTypes.png)

##Capabilities of Attackers
###0. Everyone
The stored encrypted data is publicly available. Thus everybody knows the number and sizes of all files and the estimated number of all folders of every prefix.

###1. Contact
A user *B* learns one identity (drop ID, public key and alias) of a user *A* during the contact. When receiving a share user *B* learns the directory structure of the shared directory and its files or the shared file. This implies that *B* learns the name of *A's* prefix the share is stored in.

###2. Qabel User 
An attacker has no advanced capabilities regarding security by being a Qabel user.

###3. Qabel Servers
Since a user has to be authenticated to be able to upload files on the server the provider knows the prefixes of each identity. Due to this it is able to monitor all file writes and can match them to the registered user. During the creation of a folder it can observe in which parent folder it is created. Thereby it can reconstruct the directory tree of *A*. As soon as a user requests (meta) files in the order of the (sub-)directory tree, *O* can assume that *A* shared the (sub-)directory with the user.

###4.i. Client Eavesdropper
A client eavesdropper can observe which storage server a user writes to and which storage servers it reads from. It can guess which drop server*s* a user uses to receive message (most requested drop server*s*) but it cannot guess the specific drop ID (since the message lengths should be similar and thus indistinguishable). 

The user messages are distinguishable by the number, size and destination of requests (see [this issue](https://github.com/Qabel/qabel.github.io/issues/124)). Hence the client eavesdropper can observer which actions are performed by the user.

###4.ii. Drop Eavesdropper
As far as a drop eavesdropper only observes one drop server it cannot conclude which user uses the drop server randomly and which uses it to communicate.
If a drop eavesdropper observes many drop servers a user *A* uses, it might statistically guess which one is used to receive messages.

###4.iii. Storage Eavesdropper
A storage eavesdropper can observe which prefixes are written by which IPs. Additionally it can guess by file size which files are downloaded by which IPs.

###4.iv. Internet Eavesdropper
Since only size and IP of requests to Qabel servers is observable an Internet eavesdropper can observe which IPs request which Qabel servers if it knows the IPs of Qabel servers (the request size is not fixed and thus not characteristic). By observing a great number of requests it might statistically guess which IPs communicate and share files among each other.

###Worst Case Scenario
Attacker *O* is contact of user *A*, can eavesdrop traffic at clients of user *A* and has full access to the Qabel servers *A* uses.

This implies that *O* knows which storage server prefixes *A* uses. It also knows the number, size and modification time of the files, and the directory tree of *A's* prefixes. *O* can observe which IPs download files from *A's* prefixes and can guess which downloaders own the respective key. Additionally *O* can observe from which prefixes *A* downloads which files by matching the file size of the request and the stored files. The knowledge of *A's* drop ID is only a minor advantage to *O* since random users (can) write to *A's* drop ID. An attacker could statistically guess which IPs *A* communicates with by matching the IPs of downloaders from *A's* prefixes and senders of drop messages to *A's* drop ID.

Visible Information:

**Storage**
* *A* <-> *A's* prefixes
* Number and size of *A's* files
* Directory tree of *A's* folders
* Actions (e.g., create file, share file, ...) *A* performs with respective
    * Files and folders
    * Time
    * *IP(s) of destination drop server(s)*
* Time and IP of downloads of *A's* files
* Time, size, server IP and thereby possibly the prefix of *A's* downloads

**Drop**
* *A* -> Drop ID *A* listens
* Time, size and sender IP of drop messages sent to *A's* drop ID
* Time, size and drop server IP of drop messages *A* sends

####Worst Case Scenario under Usage of *Tor*
Attacker *O* is contact of user *A*, can eavesdrop traffic at clients of user *A* and has full access to the Qabel servers *A* uses. This implies that *O* knows which storage server prefixes *A* uses. It also knows the number, size and modification time of the files, and the directory tree of *A's* prefixes.

Thus as far as all users additionally use *Tor* no information on relations between them is revealed:

**Storage**
* *A* <-> *A's* prefixes
* Number and size of *A's* files
* Directory tree of *A's* folders
* Actions (e.g., create file, share file, ...) *A* performs with respective
    * Files and folders
    * Time
* Time of downloads of *A's* files

**Drop**
* *A* -> Drop ID *A* listens
* Time and size of drop messages sent to *A's* drop ID

### Further Attacker Scenarios

####Denial of Service
Qabel neither detects nor prevents blocking of traffic. Currently writing to drop servers is not restricted, this can be enhanced by a proof of work (see Improvements to reduce Attacker Capabilities).

####Private Key Disclosure
If an attacker gets in possession of a private key this private key cannot be trusted anymore. (If the user gets to know about this it can broadcast an emergency message, that its key was stolen.)
The attacker can decrypt all files of the user and all received drop messages. It cannot decrypt sent drop messages due to the properties of *noise*.

####Disclosure of Credentials
The disclosure of the box storage credentials has no effect on the confidentiality nor integrity of stored files and sent and received messages. An attacker which possesses the credentials can learn the prefixes the user can write to. It can also create new prefixes for the user and can write and delete files to/from the storage.

##Improvements to reduce Attacker Capabilities

* Fixed block size for storage files to hide file sizes.
* Downloading all meta files at once to hide that a user downloads them in the order of the directory tree [issue](https://github.com/Qabel/qabel.github.io/issues/125).
* Sending fake drop messages to hide user relations [issue](https://github.com/Qabel/qabel.github.io/issues/124), [issue](https://github.com/Qabel/qabel-core/issues/313), [issue](https://github.com/Qabel/qabel-core/issues/314).
* Certificate pinning of trusted Qabel certificates.
* Usage of [*Tor*](https://www.torproject.org/)/proxy to hide user relations by hiding the IP.
* Non-Repudiation by signing messages or files before encrypting. Encrypt-then-sign is not target because it reveals the used key pair.
* Proof of work for drop upload to reduce DDoS against drop server and uphold anonymity of users [issue](https://github.com/Qabel/qabel.github.io/issues/68).
* Implementation of [*axolotl*](https://github.com/trevp/axolotl/wiki) (or other asymmetric forward secrecy protocols) for drop messages to gain full (not only sender-) forward secrecy [issue](https://github.com/Qabel/qabel.github.io/issues/127).
* Usage of post quantum cryptography.
