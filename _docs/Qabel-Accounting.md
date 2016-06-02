---
title: "Account management"
---
# Account management

## Abstract

The accounting server keeps track of registered users (=accounts !=
identities) and authorizes them to other services by creating
temporary authorization tokens.

All data is sent as JSON and UTF-8. All data types are defined
[here](../Qabel-Client-Local-Data#data-types).

## Accounting server API

### Registration

* Resource: /api/v0/auth/registration
* Method: POST
* Request data: `{username: STR, password1: STR, password2: STR, email: STR}`
* Response data: `{key: STR}`

If the password does not accord to the password policy it is rejected.

The response data is equal to the login response data, both return an authentication token.

### Login

The login method grants a new authentication token.

* Resource: /api/v0/auth/login
* Method: POST
* Request data: `{username: STR, password: STR}`
* Response data: `{key: STR}`

After a certain number of failed login attempts during a short period of time the login is blocked. The authentication token is used by including the header "Authorization" with the value "Token " concatenated with the key.

For example: `Authorization: Token 70373def6f3766ab1782700cba4404`

For every method except login and registration, this authorization header is required.

### Profile information

* Resource: /api/v0/profile
* Method: GET
* Request data: `{}`
* Response data: `{bucket: STR, used_storage: STR, quota: STR}`

### Confirm email

* Resource: /api/v0/auth/registration/verify-email
* Method: POST
* Request data: `{key: STR}`
* Response data: `{}`

### Reset password
* Resource: /api/v0/auth/password/reset
* Method: POST
* Request data: `{email: STR}`
* Response data: `{}`

### Confirm password reset
* Resource: /api/v0/auth/password/reset/confirm
* Method: POST
* Request data: `{uid: STR, token: STR, new_password1: STR,
new_password2: STR }`
* Response data: `{}`

### Change password:
* Resource: /api/v0/auth/password/change
* Method: POST
* Request data: `{new_password1: STR, new_password2: STR, old_password: STR}`
* Response data: `{}`

### Logout:
* Resource: /api/v0/auth/logout
* Method: POST
* Request data: `{}`
* Response data: `{}`

### Authentication
The auth resource is only used by the block server and should only be exposed to internal servers (e.g. localhost)

* Resource: /api/v0/auth/
* Method: POST
* Request data: `{auth: authorization header}`	// See [Login](#login)
* Response data: `{user_id: STR, active: BOOL}`
