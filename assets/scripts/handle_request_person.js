const login = sessionStorage.getItem("login");
const employee_id = sessionStorage.getItem("id");
const token = sessionStorage.getItem("token");

if (login != "true" || token == undefined) {
  window.location.href = "../../index.html";
} else {
  const url =
    "http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/instance/show";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ employee_id }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // token expired
        // Clear session storage
        sessionStorage.clear();
        // Redirect to the login page
        window.location.href = "../../index.html";
      }
    })
    .then((data) => {
      console.log(data);
      const pendingRequestContainer = document.getElementById(
        "pendingRequestContainer"
      );
      if (data.count == 0 || data.request == "false") {
        console.log(data.message);
        pendingRequestContainer.innerHTML = "";
        const no_req = document.createElement("p");
        no_req.classList.add("Font-bold", "text-lg");
        no_req.textContent = data.message;
        pendingRequestContainer.appendChild(no_req);
      } else {
        const responses = data;
        responses.forEach((response) => {
          const response_status = response.status;
          if (response_status == 0) {
            const mainDiv = document.createElement("div");
            mainDiv.classList.add(
              "main-div",
              "p-4",
              "my-2",
              "bg-blue-100",
              "w-full",
              "flex"
            );

            const left_div = document.createElement("div");
            left_div.classList.add("left-div", "w-11/12");

            const req_heading = document.createElement("p");
            req_heading.classList.add("Font-bold", "text-lg");
            req_heading.setAttribute("data-id", response.instance_id);
            req_heading.textContent = response.instance_name;
            left_div.appendChild(req_heading);

            const req_time = document.createElement("p");
            req_time.classList.add("Font-bold", "text-sm");
            req_time.textContent = response.time;
            left_div.appendChild(req_time);

            mainDiv.appendChild(left_div);

            const right_div = document.createElement("div");
            right_div.classList.add("right-div", "w-1/12");

            // Create the details button element
            const infoButton = document.createElement("button");
            infoButton.classList.add(
              "info_btn",
              "px-3",
              "py-1",
              "font-bold",
              "bg-red-200",
              "text-red-500",
              "text-sm",
              "rounded-full"
            );
            infoButton.innerHTML = '<i class="fa-solid fa-info"></i>';
            infoButton.id = response.instance_id;
            infoButton.setAttribute("data-id", response.instance_id);
            // infoButton.addEventListener("click", view_more);
            right_div.appendChild(infoButton);

            mainDiv.appendChild(right_div);

            pendingRequestContainer.appendChild(mainDiv);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
