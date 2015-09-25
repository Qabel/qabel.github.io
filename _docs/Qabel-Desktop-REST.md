---
title: Qabel Desktop REST Server
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

Returns the complete settings collection as specified in [client configuration](../Qabel-Client-Configuration)

#### Return values

|HTTP status code|reason|
|:----------------:|------|
| 200 | Settings retrieved |

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
| 400 | value is not valid for this key |
| 405 | key is not valid |

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
| 200 | Setting updated |
| 400 | Settings contain invalid keys or values |
| 405 | Settings is not a valid JSON document |

