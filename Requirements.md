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
We need to define, what we mean with "anonymity" exactly. A standard definition of anonymity is:

> Anonymity is the state of not being identifiable within a set of subjects, the anonymity set.

We should decide what our anonymity set should be. We also need to decide which attributes we consider: Really everything? Is the IP address of a Qabel user an identifying attribute?

One can also define anonymity in terms of unlinkability, e.g. the recipient of a message is anonymous,
if he/she can't be linked to any received message and if no message can be linked to the recipient.

### Hiding who communicates via a Drop server
It must not be possible to determine who sends Drop messages to whom.
This property automatically follows, if it is impossible to link messages with a sender or recipient.

### Hiding who accesses or exchanges data on a Storage server
It must not be possible to determine who exchanges data on a Storage server.
This property also automatically follows, if it is impossible to link data with a sender or recipient.

## Usability
### Creating new contacts

## Exemplary use cases
### Sending mail to a contact

### Sharing files with a contact

### Sending mail to a person that is not using Qabel already.

## Undecided features
It has not been decided yet, if we want to implement the following features.

### Plausible deniability vs. non-repudiation
There can only be one.

We can implement these at a higher-level an have deniability in the Chat module,
but non-repudiation in some other business related module.
Then, we can't have a single encryption format used by all modules.

### Forward secrecy

### Forward anonymity
Can somebody 

### Hide who is using a Qabel service.
