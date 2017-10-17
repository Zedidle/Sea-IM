Encrypter
====

NodeJS encryption made easy.

[![npm version](https://badge.fury.io/js/encrypter.svg)](http://badge.fury.io/js/encrypter)
[![Build Status](https://travis-ci.org/quorrajs/Encrypter.svg?branch=master)](https://travis-ci.org/quorrajs/Encrypter)
[![Quality](https://codeclimate.com/github/quorrajs/Encrypter/badges/gpa.svg)](https://codeclimate.com/github/quorrajs/Encrypter)

##Installation

The source is available for download from [GitHub](https://github.com/quorrajs/Encrypter). Alternatively, you
can install using Node Package Manager (npm):

```javascript
npm install encrypter
```

##Usage

###initialize

```javascript
var encrypter = new (require('encrypter'))(encryptionKey[, cipherAlgorithm[, messageDigestAlgorithm]])
```
where

`encryptionKey` - secret string key used for encryption

`cipherAlgorithm` - cipher Algorithm (default: `aes-256-ctr`).

Cipher algorithm is dependent on the available algorithms supported by the version of OpenSSL on the node platform. examples are 'aes192', etc. On recent releases, openssl list-cipher-algorithms will display the available cipher algorithms.

`messageDigestAlgorithm` - message digest algorithm(default: `sha1`).

Message digest algorithm is dependent on the available algorithms supported by the version of OpenSSL on the node platform. Examples are 'sha1', 'md5', 'sha256', 'sha512', etc. On recent releases, openssl list-message-digest-algorithms will display the available digest algorithms.

###encrypt and decrypt

With default algorithms:

```javascript
var encrypter = new (require('encrypter'))("myEncryptionSecret");

var encrypted = encrypter.encrypt('Hello from quorra!');

var decrypted = encrypter.decrypt(encrypted); // Hello from quorra!
```

With custom algorithms:

```javascript
var encrypter = new (require('encrypter'))("myEncryptionSecret", 'aes-256-ctc', 'sha256');

var encrypted = encrypter.encrypt('Hello from quorra!');

var decrypted = encrypter.decrypt(encrypted); // Hello from quorra!
```

##License

The Encrypter is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
