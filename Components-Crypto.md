# Crypto Component Specification

## Algorithms
If not stated otherwise the Crypto API uses the following primitives.

### Symmetric Cipher
For symmetric encryption, we use AES in Counter Mode (CTR).
The default key size is 256 bit.
We use an IV consisting of a random nonce of 12 bytes and a counter of 4 bytes.

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
Symmetrically encrypt given data with a new secret key.
Asymmetrically encrypt the symmetric key using the recipients public encryption key.
Concatenate the encrypted symmetric key, the nonce, and the ciphertext without any delimiter.
Sign the resulting message using the senders private signing key.

## Public-Key Fingerprinting
Concatenate the big-endian byte array representations of the key's modulus and exponent without any delimiter.
Compute the fingerprint as the hash sum of the resulting array.

### Key Identifier
Key identifiers (key ids) are the right-most 64 bit of a key's fingerprint.

## Key Management
### Multiple Key-pair Concept
In asymmetric cryptography applications, it is common practice to use different
key-pairs for encryption and signing in order to reduce the risk of cryptographic attacks.
Therefore, Qabel has a multiple key-pair concept, where each key-pair is only used for one
purpose (encrypting or signing).
At least three key-pairs are involved:
* one or more *encryption sub-keys* used for encryption of data,
* one or more *signing sub-keys* used for digital signing of data,
* a *primary key* used to cryptographically bundle the sub-keys together and
  to represent the contact.
