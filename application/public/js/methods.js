//Used for encryption
const crypto = require("crypto");
const algorithm = "aes-256-cbc";

// Function to encrypt a string
function encrypt(data, secretKey, iv) {
  {
    if (typeof data == "object") {
      data = JSON.stringify(data);
    }
  }
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Function to decrypt a string
function decrypt(encryptedText, secretKey, iv) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  try {
    return JSON.parse(decrypted);
  } catch (error) {
    return decrypted;
  }
}

// Export the functions for use in other files
module.exports = {
  encrypt,
  decrypt,
};
