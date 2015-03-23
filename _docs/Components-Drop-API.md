---
title: "Components: Drop API"
---
# Drop component API


1. Send methods:
    * build drop message from the given payload
    * create an encrypted message for each recipient using its public key
    * sign each message
    * upload messages to the respective drops
    * sender can request [message acknowledgement](../Qabel-Client-Drop/#acknowledging)
      * public void send(JSON payload, Collection<Contact> recipients)
      * public void sendAndForget(JSON payload, Collection<Contact> recipients)
          * unacknowledged send

## Used objects
* [Contact](../Qabel-Client-Contact-Drop-Messages/)
