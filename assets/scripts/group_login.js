// Prevent revisiting the dashboard using the back button
history.pushState(null, null, document.URL);
window.addEventListener("popstate", function () {
  history.pushState(null, null, document.URL);
});

// Function to handle single person login form submission
function handleGroupLogin(event) {
  event.preventDefault(); // Prevent form submission

  // Retrieve form data
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const group = document.getElementById("group").value;

  // Make API call
  fetch(
    "http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/login/group",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, group }),
    }
  )
    .then((response) => {
      if (response.ok) {
        console.log("login");
        return response.json();
      } else {
        alert("Invalid credentials");
      }
    })
    .then((data) => {
      console.log(data);
      if (data.login) {
        if (typeof data.token == undefined) {
          alert("Something went wrong. Token not generated");
        } else {
          sessionStorage.setItem("login", data.login);
          sessionStorage.setItem("group", data.group);
          sessionStorage.setItem("group_name", data.group_name);
          sessionStorage.setItem("id", data.info.employee_id);
          sessionStorage.setItem("name", data.info.employee_name);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("phone", data.info.employee_phone);
          sessionStorage.setItem("fla", data.info.employee_fla);
          sessionStorage.setItem("hr", data.info.employee_hr);
          sessionStorage.setItem("token", data.token);

          // Redirect to the dashboard
          window.location.href = "dashboard.html";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Add event listener to the form submit event
document
  .getElementById("login_group_user")
  .addEventListener("submit", handleGroupLogin);
