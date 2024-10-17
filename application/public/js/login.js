// Hash password CLIENT-SIDE and send the hashed password to server for processing
document.getElementById("login").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value; // grab username and password
  const password = document.getElementById("password").value;

  const hashedPassword = CryptoJS.SHA256(password).toString(); // hash password

  // send post request to /login
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: hashedPassword }), // send the hashed password variable as password in json
    });

    if (response.redirected) {
      window.location.href = response.url;
    } else {
      const result = await response.json();
      document.getElementById("password").value = "";
      alert(result.message);
    }
  } catch (error) {
    // client side error catch
    console.error("error: ", error);
  }
});
