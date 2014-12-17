# Requirements

> **This is a draft aiming to detail the requirements of Qabel.**

This document should enumerate all requirements related to security, anonymity and basic usability in the Qabel system. For each requirement it should also briefly mention the capabilities of the current architecture and the open problems. 

## Security
### Confidentiality
Access to the content exchanged between two Qabel users or stored on a Storage volume must only be possible for the involved Qabel users. This means everything must encrypted end-to-end.

### Integrity
It must be guaranteed that content exchanged between two Qabel users or stored on a Storage volume is not modified in an unauthorized or undetected manner.

### Authenticity
It must be possible to guaranteed that all parties involved in an exchange of data are who they claim to be, and that all data exchanged is genuine.

### Don't trust the provider to meet security requirements
The system must be able to meet the above security requirements even if the provider of the Qabel services can't be trusted.

## Anonymity and metadata
### Hiding who communicates via a Drop server

### Hiding who accesses or exchanges data on a Storage server

## Usability
### Creating new contacts

## Exemplary use cases
### Sending mail to a contact

### Sharing files with a contact

## Undecided features
It has not been decided yet, if we want to implement the following features.

### Plausible deniability vs. non-repudiation

### Forward secrecy

### Forward anonymity

### Hide who is using a Qabel service.
