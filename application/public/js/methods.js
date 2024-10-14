const mapIDtoKey = async (result, element) => {
  console.log("called function");
  if (result.length === 0) {
  } else {
    result.forEach((type) => {
      const option = document.createElement("option");
      const keys = Object.keys(type);
      console.log(keys);
      option.value = type[keys[0]];
      option.text = type[keys[1]];
      element.appendChild(option);
    });
  }
}

export async function fetchTableKeys(modularIDs) {
  // create an array of all the fields that need to be filled

  try {
    // the returns a two level deep array.
    // The first level contains all of the queries
    // The second level contains each queries objects
    // Technically the objects each contain stuff for a third
    // level too
    const response = await fetch("clients/tableKeys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // grab result from the array
    const result = await response.json();

    // modular form filling to create all boxes
    let resultsIndex = 0;
    // loop through every id that needs to be changed
    modularIDs.forEach((id) => {
      // grab document reference and set to blank
      const documentID = document.getElementById(id);
      documentID.innerHTML = "";

      // call map function to fill the boxes and increment results index
      mapIDtoKey(result[resultsIndex], documentID);
      resultsIndex++;
    });
  } catch (error) {
    console.error("error: ", error);
  }
}

export async function postNewClient(route, elements) {
  try {
    const response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ elements }),
    });

    console.log(response);
  } catch (err) {
    console.error("error: ", err);
  }
}

//Used for encryption
// const crypto = require("crypto");
// const algorithm = "aes-256-cbc";
//
// // Function to encrypt a string
// function encrypt(data, secretKey, iv) {
//   {
//     if (typeof data == "object") {
//       data = JSON.stringify(data);
//     }
//   }
//   const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
//   let encrypted = cipher.update(data, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// }
//
// // Function to decrypt a string
// function decrypt(encryptedText, secretKey, iv) {
//   const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
//   let decrypted = decipher.update(encryptedText, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//
//   try {
//     return JSON.parse(decrypted);
//   } catch (error) {
//     return decrypted;
//   }
// }


