// Client side js to send post request and render table of results
async function fetchClientData(search = "") {
  try {
    const response = await fetch("clients/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search }),
    });

    const result = await response.json();
    const resultsTableBody = document.getElementById("results-table-body");
    resultsTableBody.innerHTML = ``; // Clear previous results

    if (result.length === 0) {
      resultsTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No clients found.</td></tr>`;
    } else {
      result.forEach((row) => {
        const newRow = resultsTableBody.insertRow();
        newRow.innerHTML = `
            <td>${row.Client_ID}</td>
            <td>${row.Client_FName}</td>
            <td>${row.Client_LName}</td>
            <td>${row.Client_Email}</td>
            <td>${row.Client_Cell_Phone}</td>`;
      });
    }

    console.log(result);
  } catch (error) {
    console.log("error: ", error);
  }
}

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    await fetchClientData(search)
  });

document.addEventListener('DOMContentLoaded', () => {
  fetchClientData(); // load all clients when page is loaded
})
