# Crypto Component Specification

## Algorithms

### Symmetric Cipher
For symmetric encryption, we use AES in Counter Mode (CTR)
The default key size is 256 bit.
The nonce has 16 bytes.

### Asymmetric Cipher
For asymmetric, public key encryption we use RSA OAEP.
For signatures we use RSASSA-PSS.
The default key size is 2048 bit.

### Hash Algorithms
The default hash algorithm is SHA512.


## Crypto API
The focus of this API is to prevent misuse of crypto primitives.

### Encrypt
Symmetrically encrypt given data with a given key.
Append a HMAC to the ciphertext.

### Encrypt and Sign

## Key Fingerprinting
The fingerprint of a given public key is calculated using SHA512.

### Key Identifier
Key identifiers (key ids) are derived using the low-order 64 bit of a key's
fingerprint.

## Key Management
### Multiple Key-pair Concept
In asymmetric cryptography applications, it is common practice to use different
key-pair for encryption and signing in order to reduce the risk of cryptographic attacks.
Therefore, we use two key-pairs: one for encryption and one for signing.
