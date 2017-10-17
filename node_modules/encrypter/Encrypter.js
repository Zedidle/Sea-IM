/**
 * Encrypter.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT
 */

var crypto = require('crypto');

/**
 * Create a new Encrypter instance.
 *
 * @param {String} key
 * @param {String} cipAlgm
 * @param {String} msgDigestAlgm
 * @constructor
 */
function Encrypter(key, cipAlgm, msgDigestAlgm) {
    this.__key = key;
    this.__cipAlgm = cipAlgm || 'aes-256-ctr';
    this.__msgDigestAlgm = msgDigestAlgm || 'sha1';
}

/**
 * Encrypt the given value.
 *
 * @param  {String|Buffer}  value
 * @return {String}
 */
Encrypter.prototype.encrypt = function(value) {
    var ct = this.__encryptData(value);
    return JSON.stringify({
        ct: ct,
        mac: this.__digest(ct)
    });
};

/**
 * Decrypt the given value.
 *
 * @param  {String}  payload
 * @return {String}
 */
Encrypter.prototype.decrypt = function(payload){
    payload = JSON.parse(payload);
    var hmac = this.__digest(payload.ct);

    if (hmac != payload.mac) {
        throw 'Encrypted data was tampered!';
    }

    return this.__decryptData(payload.ct);
};

/**
 * Creates cipher text from plain text
 *
 * @param {String|Buffer} value
 */
Encrypter.prototype.__encryptData = function(value) {
    value = (Buffer.isBuffer(value)) ? value : new Buffer(value);

    var cipher = crypto.createCipher(this.__cipAlgm, this.__key);
    var ct = [];

    ct.push(cipher.update(value).toString('base64'));
    ct.push(cipher.final('base64'));

    return ct.join('');
};

/**
 * Creates plain text from cipher text
 *
 * @param {String} ct
 */
Encrypter.prototype.__decryptData = function(ct) {
    var cipher = crypto.createDecipher(this.__cipAlgm, this.__key);
    var pt = [];

    pt.push(cipher.update(ct, 'base64', 'utf8'));
    pt.push(cipher.final('utf8'));

    return pt.join('');
};

/**
 * Generates HMAC as digest of cipher text
 *
 * @param {String} obj
 */

Encrypter.prototype.__digest = function(obj) {
    var hmac = crypto.createHmac(this.__msgDigestAlgm, this.__key);
    hmac.setEncoding('base64');
    hmac.write(obj);
    hmac.end();
    return hmac.read();
};

module.exports = Encrypter;