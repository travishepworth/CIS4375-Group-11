//Used for encryption
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

// Function to encrypt a string
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt a string
function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Export the functions for use in other files
module.exports = {
  encrypt,
  decrypt
};
