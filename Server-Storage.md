# <--- The following part will be moved into another repository later. Until these recommendations are approved, they will remain in the internal wiki (work in progress)

# Qabel Storage recommendations

## Tokens

The ```public``` token is only used to identify a Qabel Storage Volume but doesn't restrict access to it. As an ID, it has to be unique on a Qabel Storage. The server might generate these in any preferred way. ```token``` and ```revoke_token``` are used to grant the restricted operations of updating or deleting a Qabel Storage Volume. Those tokens should be handled like a user password.

### Creation of tokens
Based on the different purposes of the tokens, we recommend the creation in the following manners: 

* ```public``` Can be created in any preferred way, which might also be a secure random function.
* ```token``` Should be created by a secure random function.
* ```revoke_token```  Should be created by a secure random function.

### Storage of tokens
```token``` and ```revoke_token``` are equal to a user password and thus should never be stored as a clear text into a database. Our recommendation is to store those tokens as a salted hash. NIST Special Publication 800-132 recommends at least a 128 Bit salt created by a secure random function and PBKDF2 with at least 1000 iterations as the hash function. For high security environments NIST recommends up to 10.000.000 iterations. When using PBKDF2, the iteration count should be selected between those limits.

The `password_hash` function of PHP since version 5.5 utilizes bcrypt as a hash algorithm and will automatically create a secure salt in its default mode of operation. 

We recommend to use the `password_hash` and `password_verify` in a PHP environment to create a salted hash of ```token``` and ```revoke_token``` and store these salted hash values into a database. 

# --->
