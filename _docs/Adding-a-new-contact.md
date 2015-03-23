---
title: Adding a new contact
---
# Adding a new User to the contact list

### Basic principle

*  The Qabel software is not a platform to search for anyone or anything. That way it is essential for users to know each other beforehand and to be able to exchange messages outside of Qabel.
*  The design of the dead drop enables the user to establish new dead drops as well as not caring about old ones anymore, so if a user wants to add his contact information on his paper business card, it has to be something persistent, hence the design of the users entry in the business card like directory.
*  For now, this procedure is the only way to add a contact. The information that needs to be handed over to a friend is short enough to even write it on a paper business card, the procedure can be executed with any device Qabel runs on and no other application but the Qabel client is needed. As an enhancement, there is e.g. a QR-code transport idea for POST-Beta.

### Prearrangements

During the initialization of Qabel the user created a public/private key pair, his own storage space to upload data, a dead drop for the contacts to upload messages and an entry in a business card like directory, which can be reached by a short URL. At this URL a JSON formated object is located that contains 3 fields: a dead drop URL, a public key and a signature (composed in the usual way -- a digest and actual signature).


### Procedure

#### Step 1:

Alice and Bob want to connect via Qabel, therefore Alice gives her short URL to Bob (or vice versa). Bob opens his Qabel client, opens his address book, clicks on the button "add User" and enters a name for the new contact. After accepting the choice of the contact name, the Qabel client will ask for the URL of the new contact information. When Bob has entered Alice' URL address, the Qabel Client downloads the JSON object from the URL, verifies the integrity of the data through fingerprinting (specification is still on the way) and adds the dead drop and the public key from Alice to this new entry in Bobs address book.

#### Step 2:

At this point, Bob has all the information he needs to contact Alice so the Qabel client will automatically opens a message window for Bob, where he can enter some private words for Alice. After clicking the "send message" button, the Qabel Client will append a JSON object of Bobs public key and his dead drop, it will encrypt it with Alice' public key all together and it will send it to Alice' dead drop.

#### Step 3:

The next time Alice downloads all the messages from her dead drop, she will decrypt them with her private key, get the message from Bob and her Qabel Client will recognize the appended JSON object as contact informations which allows her to hit the "add User" button to add a name for this contact informations. Afterwards, Alice will be able to send a message to Bob to complete establishing the contact.


### Constraints:

**Directory of the contact information:**   
During the Beta version of Qabel, a fingerprinting will not be needed unconditionally. But there will be a method soon, which helps the Qabel client to verify that the contact data has not been changed by anyone but the owner of the key, but without giving anyone a chance to identify the owner of the given key.

**Contact information in JSON format:**
The exact structure of this object will be here soon. Till then, the approximation will be:

```json
{
   "drop_url" : "http://www.nevergonna.com/give/u/up/06021966.html",
   "public_key" : "mQINBFPOzTUBEADT1kIEMY1Ix+9DyNfGHE9HPjLSI/Ybnsn/...",
   "digest" : "GgFPryipXkdLp6LK3Hf-cYu6-EK8VMe8Tm-6-LzAe9TBHeVSJDvvEQxN5red",
   "signature" : "zggwQ7TxQGQVhzskiugjpwQUdhZ8UU_RAWtVePcwn_3peAoYbooVBcjyJgJE"
}
```