---
title: Protocol Proof of Work
---
# Proof Of Work Specification

## Abstract

A Spam and Denial of Service countermeasure. Reduce the capability of each single clients to flood the server with messages.

## Scheme

* Run a Flood Control using stochastical techniques or if the server detects a suspicious connection.
* Additionally the client could send a calculation based on parameters and date/time with each query.

##  Protocol

* The server sends "X-Proof-Of-Work-Required" header with a list of supported methods and parameters.
* The client calculates the Hash back to Collision and makes a new request with the result as "X-Proof-Of-Work" header

## Current Implemention

* Method is PBKDF2.
** Algorithm is simple. For example based on SHA1.
** Similar to "Hashcash":https://en.wikipedia.org/wiki/Hashcash in Bitcoin