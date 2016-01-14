---
title: Protocol Proof of Work
---
# Proof Of Work Specification **[To be defined]**

## Abstract

A Spam and Denial of Service countermeasure. Reduce the capability of each single clients to flood the server with messages.

It is not planned to be implemented for the BETA.

## Scheme

* Run a Flood Control using stochastical techniques or if the server detects a suspicious connection.
* Additionally the client could send a calculation based on parameters and date/time with each query.

##  Protocol

* The server sends "X-Proof-Of-Work-Required" header with a list of supported methods and parameters.
* The client calculates the Hash back to Collision and makes a new request with the result as "X-Proof-Of-Work" header
** Similar to "Hashcash":https://en.wikipedia.org/wiki/Hashcash in Bitcoin