---
title: Remote Data
---
# Client Data on Qabel Servers

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

A user can upload its identity information to the [register server](http://qabel.github.io/docs/Qabel-Protocol-Register):

        identities      = "["
                        identity*
                        "]"

Information on alias, email and phone are optional.

        identity        = "{"
                        'alias' : NAME,
                        'email': STR,
                        'phone': STR,
                        'public_key' : KEY,
                        'dropUrls' : [URL]
                        "}"