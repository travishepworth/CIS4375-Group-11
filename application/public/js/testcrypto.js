// THIS IS A TEST FILE AND CAN BE DELETED LATER,

// To make this file work following the steps below within the commented section
//cd to js folder
//node testcrypto.js

const crypto = require('crypto');
const { encrypt, decrypt } = require('./methods.js'); //Import methods

const secretKey = Buffer.from('2e914e3c68660d4e6ab1b7bce863bt13'); // KEY FOR ENCRPYTION AND DECRYPTION STORE IN ENV
const iv = Buffer.from('68662eh1914e63bz'); // IV FOR ENCRPYTION AND DECRYPTION, STORE IN ENV


const jsondata = {
    name: "test"
};


const textToEncrypt = jsondata; //Encrypted Text

const encryptedText = encrypt(textToEncrypt,secretKey,iv); // sends text to encrpytion method
console.log('Encrypted data:', encryptedText,);

const decryptedText = decrypt(encryptedText,secretKey,iv); // send text to decrpytion method
console.log('Decrypted data:', decryptedText);