# Buffered Data Notes

## Abstract
Notes on buffered data stored on each client.

The buffered data is only saved on local machines and will not be synced.

## Buffered Data

The buffered data is a collection of data which Qabel core needs to work correctly on the current machine.

Currently available:

 * acknowledge_ids

Summary

        buffered_data   = "{"
                        'acknowledge_ids' : acknowledge_ids,
                        'module_data' : { KEY : { ... }, ... }
                        "}"

#### Acknowledge IDs

This is a collection of contacts, acknowledge ids and more which are waiting for a response from the other side to forward this information to the modules. Upon receiving the response modules will know that their drop message has been sent correctly and the other side received it.

The item `acknowledge_ids` includes a collection of acknowledge_id structures

Summary

        acknowledge_ids = "["
                        acknowledge_id*
                        "]"


#### Acknowledge ID

| Key 			   | Description |
| --- 			   | ----------- |
| identity_id      | Identity ID |
| acknowledge_id   | Acknowledge ID of the send drop message |
| contact_public_sign_key | Public key to verify drop message signatures |
| time_stamp       | Date of message generation |
| model_object     | The name of the model object which has to handles the acknowledge|


Summary

        acknowledge_id  = "{"
                        'identity_id': INT,
                        'acknowledge_id': STR,
                        'contact_public_sign_key': key,
                        'time_stamp': LONG,
						'model_object' : STR
                        "}"

#### Module Data

Each module shall save its buffered data in this area. The key of JSON object has to be the name of the module. The core provides getter and setter methods. 
