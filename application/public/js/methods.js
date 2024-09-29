// Methods go here
const crypto = require('crypto');

// Key and IV for encryption.
const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); // Replace with a secure key or store it in environment variables
const iv = crypto.randomBytes(16); // Initialization vector

// Function to encrypt a string
function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt a string
function decrypt(encryptedText) {
  let decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Export the functions for use in other files
module.exports = {
  encrypt,
  decrypt
};
