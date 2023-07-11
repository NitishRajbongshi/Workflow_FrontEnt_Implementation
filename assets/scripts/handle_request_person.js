// show all the instance to the handler person
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

            const instance_status = document.createElement("p");
            instance_status.classList.add("Font-bold", "text-sm");
            instance_status.setAttribute('data-id', response.status);
            instance_status.id = `status_${response.instance_id}`;
            left_div.appendChild(instance_status);

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
            infoButton.innerHTML = '<i class="block fa-solid fa-info"></i>';
            infoButton.id = response.instance_id;
            infoButton.setAttribute("data-id", response.instance_id);
            infoButton.addEventListener("click", view_more);
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

// details related to the instance
function view_more(event) {
  const id = event.target.getAttribute("data-id");
  console.log(id);

  const url = `http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/instance/get/${id}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } if (response.status == 404) {
        alert("Something went wrong");
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
      const request_info = document.getElementById("request_info");
      const person_info = document.getElementById("person_info");
      request_info.innerHTML = "";
      person_info.innerHTML = "";

      const ri_h1 = document.createElement("h1");
      ri_h1.classList.add(
        "text-md",
        "my-2",
        "font-bold",
        "border-b-2",
        "border-blue-200",
        "text-blue-500"
      );
      ri_h1.innerText = "Request details";
      request_info.appendChild(ri_h1);

      const ri_h2 = document.createElement("h2");
      ri_h2.classList.add("text-2xl", "font-bold", "text-blue-600");
      ri_h2.innerText = data.instance_name;
      request_info.appendChild(ri_h2);

      const ri_h4 = document.createElement("h4");
      ri_h4.classList.add("text-md", "text-slate-800");
      ri_h4.innerText = data.instance_description;
      request_info.appendChild(ri_h4);

      const ri_p = document.createElement("p");
      ri_p.classList.add("text-sm", "text-red-500");
      ri_p.innerText = `Date & Time: ${data.created_at}`;
      request_info.appendChild(ri_p);

      show_sender_details(data.employee_id, id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function show_sender_details(employee_id, id) {
  const url = `http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/user/details`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ employee_id })
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } if (response.status == 404) {
        alert("Something went wrong");
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

      const person_info = document.getElementById("person_info");

      const ri_h1 = document.createElement("h1");
      ri_h1.classList.add(
        "text-md",
        "my-2",
        "font-bold",
        "border-b-2",
        "border-blue-200",
        "text-blue-500"
      );
      ri_h1.innerText = "Sender details";
      person_info.appendChild(ri_h1);

      const ri_h2 = document.createElement("h2");
      ri_h2.classList.add("text-xl", "font-bold", "text-blue-600");
      ri_h2.innerText = `Name: ${data.employee_name}`;
      person_info.appendChild(ri_h2);

      const ri_h4 = document.createElement("h4");
      ri_h4.classList.add("text-md","font-bold", "text-slate-800");
      ri_h4.innerText = `Employee ID: ${data.employee_id}`;
      person_info.appendChild(ri_h4);

      handle_request(id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handle_request(request_id) {
  const handler_id = request_id;
  const status = document.getElementById(`status_${handler_id}`);
  const data_id = status.getAttribute('data-id');
  console.log(data_id);
  if(data_id == 0 || data_id == -1) {
  console.log("here");
    const handler_container = document.getElementById("handle_request");
    const handle_request_btn = document.getElementById("handle_request_btn");
    handle_request_btn.setAttribute("data-id", request_id);

    handler_container.style.display = "block";
    console.log(handler_container);
  }
}