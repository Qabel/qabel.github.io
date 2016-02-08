---
title: Appendix Glossary
---
# Terminology
* $Foo, $Bar and $Baz (and compositions of Foo, Bar and Baz prefixed with a "$") are used as placeholder. Prefer to use them in the order given here.

# Definitions
* **Qabel-$Foo-Protocol**: Can also be (Qabel) $Foo protocol. It means the protocol itself (e.g. in a network point of view for a network protocol).

* **Qabel-$Foo-Server**: Can also be (Qabel) $Foo server. It means the server - the thing which has to be implemented. The thing the $Foo client component communicates with.

* **Qabel-$Foo-Client**: Can also be (Qabel) $Foo client. It means the $Foo component in the client - the thing which has to be implemented. The thing which communicates with the $Foo server _iff_ there is a $Foo server.

* **(Qabel) component**: Anything is a component. Anything in the client - whether it belongs to the core or it is a module - is a component. The client itself, the $Foo server and a Qabel app also is a component.

* **(Qabel) module**: A (Qabel) module is a client-component which does not belong to the core and which is not a Qabel app.

* **(Qabel) core**: The (Qabel) core is the collection of client-components which are not modules and which is not a Qabel app. The core provides the Qabel functionality. The core and only the core - or at least one component of it - communicates with the Qabel server.

* **(Qabel) client**: The (Qabel) client consists of the core, the modules and is wrapped inside an Qabel app.

* **Qabel app**: Can also be Qabel application. It is everything which is additionally - besides the core and the modules - needed to run the client (on a specific platform). It uses the core and - technically optional - a collection of modules.

* **(Qabel) server**: Since there is no such thing as **the** (Qabel) server the term (Qabel) server refers to all (plural) or one specific (singular) Qabel server.

* **Drop protocol**: Transport protocol for e.g. Drop messages.

* **Drop message**: Message exchange between clients. E.g. announcements, key transmission, and other module-specific data.

* **Drop**: The dead drop box on the drop server identified by the drop id where the drop messages are pushed to, stored and fetched from

* **Share**: Adapted from the Windows-term 'Share' (German: Freigabe). A shared directory/file/blob that resides on the (Qabel) client(?) so other clients may access it(?) - so the file is not required to be uploaded on to the (Qabel) server yet to be called a Share.

* **Identity**: Easy: Who am I? An identity is a collection of a label (nickname) and a public and private key pair. It belongs to the local user of Qabel.

* **Contact**: Easy: Which people do I know? A contact is a collection of informations about another user. It contains public keys for encryption and signature verification, the drop URLs and specific data from modules.

* **Person**: Easy: Describes the contact. It saves personal information about a contact like the name and e-mail address(es). Some fixed keys are defined in the person module.
