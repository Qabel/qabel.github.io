# Drop component API


1. Send methods: 
    * build drop message from the given payload
    * create an encrypted message for each recipient using its public key
    * sign each message
    * upload messages to the respective drops

          public void send(JSON payload, Collection<Contact> recipients)

          public void sendAndForget(JSON payload, Collection<Contact> recipients)

