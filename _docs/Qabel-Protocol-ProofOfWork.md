---
title: Protocol Proof of Work
---
# Proof Of Work Specification **[To be defined]**

## Abstract

A Spam and Denial of Service countermeasure. Reduce the capability of each single client to flood the server with messages.

It is not planned to be implemented for the BETA.

## Scheme

* Run a Flood Control using stochastical techniques or if the server detects a suspicious connection.
* Additionally the client could send a calculation based on parameters and date/time with each query.

##  Protocol

1. The client requests the number of leading zeros (X) of a proper request
1. The server responses this information
1. The client generates a random IV
1. The client iterates the counter to find `hash(drop ID || IV || time || hash(m) || counter) = "000..."` with X leading zeros
1. The client sends `drop ID || IV || time || hash(m) || counter || hash(drop ID || IV || time || hash(m) || counter) || m`
1. The server verifies
  1. That (drop ID, time, IV) is unique and thus not stored yet
  1. That requested time does not differ more than one time period from current time (e.g., 1 minute)
  1. Proof of work hash
  1. Message hash
1. On successful verification server accepts the message and stores (drop ID, time, IV), else server rejects the message

### Parameters

* **drop ID** to prevent DDoS on multiple drop IDs
* **IV** to prevent reusing of drop messages during one time period (e.g., 1 second); using a server generated IV could lead to an overflow (TLS syn-flooding); storing a fix number of IVs could lead to an overflow (100 IVs: IV_1=IV101, IV_2=IV_102, ... => client can resend messages during one time period)
* **time** to prevent reusing of drop messages
* **hash(m)** to bind a PoW hash to a certain message
* **counter** to find a well formated hash
