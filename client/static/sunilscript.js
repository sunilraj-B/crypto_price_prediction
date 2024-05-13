const showHiddenPass = (loginPass, loginEye) => {
    const input = document.getElementById(loginPass),
      iconEye = document.getElementById(loginEye);

    iconEye.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";

        iconEye.classList.remove("ri-eye-off-line");
        iconEye.classList.add("ri-eye-line");
      } else {
        input.type = "password";

        iconEye.classList.remove("ri-eye-line");
        iconEye.classList.add("ri-eye-off-line");
      }
    });
  };

  showHiddenPass("login-pass", "login-eye");

  var validUsername = "sunil"; // Change this to the desired username
  var validPassword = "123456789";

  function validateForm() {
    var enteredUsername = document.getElementById("login-username").value;
    var enteredPassword = document.getElementById("login-pass").value;

    // Check if entered username and password match pre-existing values
    if (enteredUsername === validUsername && enteredPassword === validPassword) {
      // If validation passes, allow form submission
      alert("Login successful!");
      return true;
    } else {
      alert("Invalid username or password. Please try again.");
      return false; // Prevent form submission
    }
  }