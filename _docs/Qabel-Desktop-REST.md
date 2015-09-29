---
title: Local REST Server
---

# REST Server

## Abstract

A local webserver which serves as a wrapper around the Qabel-core and provides an API that other applications can use. This provides freedom of choice in regards to the GUI or CLI implementations and allows the local server to run in the background where it can provide a permament process for modules like messaging and file syncing.

# API

The server runs on port 9696 and is started in a thread by the qabel-desktop applications.

## Settings

### Read Settings

* HTTP-Method: GET
* Ressource: `/settings`

Returns the complete local settings collection as specified in [client configuration](../Qabel-Client-Configuration#local-settings)

#### Return values

|HTTP status code|reason|body|
|:----------------:|------|----|
| 200 | Ok | Local settings |

### Update Settings

* HTTP-Method: PUT
* Ressource: `/settings`

Update a single key

| Key | Description |
| --- | ----------- |
| key | Key to update, can be in the form of foo.bar.baz |
| value | Value to set for the key |

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | Setting updated |
| 400 | Value is not valid for this key |
| 405 | Key is not valid |

#### Substitute Settings

* HTTP-Method: POST
* Ressource: `/settings`

Substitute the current settings.

| Key | Description |
| --- | ----------- |
| settings | JSON document of the settings |

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | Settings updated |
| 400 | Settings contain invalid keys or values |
| 405 | Settings is not a valid JSON document |


## Synced Settings

### Read Settings

* HTTP-Method: GET
* Ressource: `/synced`

Returns the complete synced settings collection as specified in [client configuration](../Qabel-Client-Configuration#synced-settings)

#### Return values

|HTTP status code|reason|body|
|:----------------:|------|----|
| 200 | Ok | Synched settings |

### Update Settings

* HTTP-Method: PUT
* Ressource: `/synced`

Update a single key

| Key | Description |
| --- | ----------- |
| key | Key to update, can be in the form of foo.bar.baz |
| value | Value to set for the key |

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | Setting updated |
| 400 | Value is not valid for this key |
| 405 | Key is not valid |

#### Substitute Settings

* HTTP-Method: POST
* Ressource: `/synced`

Substitute the current settings.

| Key | Description |
| --- | ----------- |
| settings | JSON document of the settings |

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | Settings updated |
| 400 | Settings contain invalid keys or values |
| 405 | Settings is not a valid JSON document |

## Drops

### Retrieve Drops

* HTTP-Method: GET
* Ressource: `/drop`

Returns a list of all drop messages from all configured DropURLs.
See: [Client Drop](../Qabel-Client-Drop)


#### Return values

|HTTP status code|reason|body|
|:----------------:|------|---|
| 200 | New drops available | List of drop messages |
| 204 | No new drops available | |

### Check for drops

* HTTP-Method: HEAD
* Ressource: `/drop`

Same as retrieving drops, but without sending them in the body. Used for checking if new drops are available.

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | Drops available |
| 204 | No new drops available |

###  Send Drop message

* HTTP-Method: POST
* Ressource: `/drop`

Send a drop messages to the specified contacts

| Key | Description |
| --- | ----------- |
| recipients | JSON list of contact ids |
| sender | Identity id of the sender |
| drop_message | [Drop message](../Qabel-Client-Drop#format-and-structure-of-a-message) in JSON format |


#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 201 | Drop sent |
| 400 | Invalid drop message, sender or recipients |
| 404 | Recipients not found |
| 413 | Drop message too large |
