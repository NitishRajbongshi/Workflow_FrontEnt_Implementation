// JS to handle the user dashboards
// Retrieve the stored email from the session
const login = sessionStorage.getItem("login");
const group = sessionStorage.getItem("group");
const group_name = sessionStorage.getItem("group_name");
const employee_id = sessionStorage.getItem("id");
const employee_name = sessionStorage.getItem("name");
const employee_email = sessionStorage.getItem("email");
const employee_phone = sessionStorage.getItem("phone");
const employee_fla = sessionStorage.getItem("fla");
const employee_hr = sessionStorage.getItem("hr");
const token = sessionStorage.getItem("token");

if (login != "true" || token == undefined) {
  // Redirect to the login page
  window.location.href = "../../index.html";
} else {
  const is_group = document.getElementById("is_group");
  if(group == "false") {
    is_group.classList.add('hidden');
  }
  else {
    group_type = document.getElementById('group_type');
    group_type.innerText = group_name;
  }
  const set_name = document.querySelectorAll(".employee_name");
  const set_email = document.querySelector(".email");
  const set_phone = document.querySelector(".phone");
  const set_id = document.getElementById("employee_id");
  set_name.forEach((element) => {
    element.innerText = employee_name;
  });
  set_id.innerText = employee_id;
  set_email.innerText = employee_email;
  set_phone.innerText = employee_phone;
}

// logout
const logout_btn = document.getElementById("logout");
logout_btn.addEventListener("click", () => {
  // Clear session storage
  sessionStorage.clear();

  // Redirect to the login page
  window.location.href = "../../index.html";
});

// Prevent revisiting the dashboard using the back button
history.pushState(null, null, document.URL);
window.addEventListener("popstate", function () {
  history.pushState(null, null, document.URL);
});
