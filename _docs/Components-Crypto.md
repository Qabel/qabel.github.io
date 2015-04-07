---
title: "Components: Crypto"
---
# Crypto Component Specification

## Encryption

### Drop messages
Drop messages are encrypted using Noise boxes with Curve25519 and AES-GCM. See https://github.com/trevp/noise for further details on Noise. 

### Files
Files are encrypted with AES in Galois Counter Mode (GCM).
The default key size is 256 bit.
An IV consisting of a random nonce of 12 bytes and a counter of 4 bytes is used.

## Keys
Curve25519 private keys are 32 bytes of random data.
Public keys are the 32 bytes result from the scalar multiplication of the private key with the Curve25519 base point. 

### Key Management
Each Qabel identity consists of a Curve25519 key pair. Since Noise uses ephemeral key pairs for each created box, the key management is rather simple and requires no additional keys.

## Crypto API
The focus of this API is to prevent misuse of crypto primitives.

### Encrypt File
Symmetrically encrypt given data with a given key.

### Encrypt Noise box
Creates a Noise box using the senders private key, the recipients public key and the Drop message. 
