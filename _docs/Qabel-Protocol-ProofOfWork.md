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
** Inspired by [Hashcash](https://en.wikipedia.org/wiki/Hashcash)

##  Protocol

- The *smallest time unit* could be 1 second
- A certain *time period* could be 1 minute

1. The client requests the number of leading zeros `X` of a proper request and the current `IVserver`
1. The server responses `X` and `IVserver` if it was generated for this *time period* already, else it generates `IVserver` and stores it for a *time period*
1. The client generates a random `IVclient`
1. The client iterates the `counter` to find `hash(IVserver || IVclient || time || hash(m) || counter) = "000..."` with `X` leading zeros
1. The client sends `IVserver || IVclient || time || hash(m) || counter || hash(IVserver || IVclient || time || hash(m) || counter) || m`
1. The server verifies
    1. that the proof of work hash begins with `X` zeros
    1. that `(time, IVserver, IVclient)` is unique and thus not stored yet
    1. that requested time does not differ more than a *time period* from current time
    1. proof of work hash
    1. message hash
1. On successful verification server accepts the message and stores `(time, IVclient)` for a *time period*, else server rejects the message

### Parameters

* **X** variable number of leading zeros to dynamically adapt the workload
* **IVserver** is generated, stored and used for a *time period* to prevent precomputation of PoW hashes
* **IVclient** to prevent reusing of drop messages during the *smallest time unit*;
  using a server generated unique IV could lead to an overflow (e.g., see [SYN flood](https://en.wikipedia.org/wiki/SYN_flood));
  storing a fix number of IVs could lead to an overflow (100 IVs: `IV_1=IV_101, IV_2=IV_102, ...` => client can resend messages during the smallest time unit)
* **time** to prevent reusing of drop messages
* **hash(m)** to bind a PoW hash to a certain message
* **counter** to find a well formated hash