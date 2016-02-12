---
title: Remote Data
---
# Client Data on Qabel Servers

Data types are defined [here](../Qabel-Client-Local-Data#data-types).

## Account
Account data is also stored on the accounting server for authenticating the user:

        accounts        = "["
                        account*
                        "]"


        account         = "{"
                        'username': STR,
                        'email': STR,
                        'saltedHashedPassword': STR,
                        "}"

## Identity

A user can upload its identity information to the [register server](../Qabel-Protocol-Register):

        identities      = "["
                        identity*
                        "]"

Information on alias, email and phone are optional.

        identity        = "{"
                        'alias' : STR,
                        'email': STR,
                        'phone': STR,
                        'public_key' : KEY,
                        'dropUrls' : [URL]
                        "}"