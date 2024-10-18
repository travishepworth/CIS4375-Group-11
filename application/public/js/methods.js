import { modularIDs, elementIds } from "./clients.js";

const clientFormModal = new bootstrap.Modal(
  document.getElementById("clientFormModal"),
);

const mapIDtoKey = async (result, element) => {
  if (result.length === 0) {
  } else {
    result.forEach((type) => {
      const option = document.createElement("option");
      const keys = Object.keys(type);
      option.value = type[keys[0]];
      option.text = type[keys[1]];
      element.appendChild(option);
    });
  }
};

function clearForm() {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element.tagName === "SELECT") {
      element.selectedIndex = 0;
    } else {
      element.value = "";
    }
  });
}

function fillForm(result) {
  // auto fill the form with data from result
  clearForm();
  let index = 0;
  for (const key in result[0]) {
    if (key === "Client_ID") {
      continue;
    }
    // document.getElementById(elementIds[index]).value = result[0][key];
    const element = document.getElementById(elementIds[index]);
    if (element.tagName === "SELECT") {
      const options = element.options;

      for (let i = 0; i < options.length; i++) {
        if (parseInt(options[i].value) === result[0][key]) {
          element.selectedIndex = i;
          break;
        }
      }
    } else {
      element.value = result[0][key];
    }
    index++;
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

export async function executeQuery(route, elements) {
  try {
    await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ elements }),
    });
  } catch (err) {
    console.error("error: ", err);
  }
}

// function to open the form and send a post request to the server
// to get the data to fill the form
export async function openExistingForm(route, id) {
  try {
    const response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();
    // open the modal and fill the form with result
    await fetchTableKeys(modularIDs);
    clientFormModal.show();

    fillForm(result);
  } catch (error) {
    console.error("error: ", error);
  }
}

export function closeForm() {
  clientFormModal.hide();
}

export async function openNewForm() {
  await fetchTableKeys(modularIDs);
  clearForm();

  clientFormModal.show();
}
