window.addEventListener("load", function () {
  // Automatically open the modal when the page loads
  // var clientFormModal = new bootstrap.Modal(document.getElementById('clientFormModal'));
  // clientFormModal.show();
});

async function fetchAcquisitionMethod() {
  try {
    const response = await fetch("clients/acquisition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    const acquisitionMethod = document.getElementById("acquisitionMethod");
    acquisitionMethod.innerHTML = ``;

    if (result.length === 0) {
    } else {
      result.forEach((type) => {
        const option = document.createElement("option");
        // option.innerHTML = `
        //   <option value="${type.Acquire_Type}">${type.Acquire_type}</option>`;
        option.value = type.Acquire_Type;
        option.text = type.Acquire_Type;
        acquisitionMethod.appendChild(option);
      });
    }
  } catch (error) {
    console.log("error: ", error);
  }
}
// Handle the "+" button click event to open the modal
document
  .getElementById("openClientFormButton")
  .addEventListener("click", function () {
    fetchAcquisitionMethod();
    var clientFormModal = new bootstrap.Modal(
      document.getElementById("clientFormModal"),
    );
    clientFormModal.show();
  });

document.getElementById("deleteButton").addEventListener("click", function () {
  if (confirm("Are you sure you want to delete this client?")) {
    // Perform delete action here
    alert("Client deleted.");
  }
});
