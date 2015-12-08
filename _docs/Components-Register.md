---
title: "Components: Register"
---
# The register component

## Abstract
With the register component the user will be able to upload identities and search for other identities. An identity on a register server must contain an alias, the drop url and the public key and can contain an email address and a telephone number.
The user will be able to update their identities, if they have the corresponding private key to sign the update request. Otherwise they have to upload this new identity.

Duplicate identities are allowed, so different identities can have the same alias, drop url, telephone number or email address.

The user will **not** need an account to upload, update or search for identities.

## Features:

* Upload of the user's identities
* Update and delete an identity with a signed request
* Search for identities and download their public key, drop address and the additional, optional information