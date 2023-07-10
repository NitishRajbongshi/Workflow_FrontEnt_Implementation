// Get all the information of an instance
const login = sessionStorage.getItem("login");
const employee_id = sessionStorage.getItem("id");
const token = sessionStorage.getItem("token");

if (login != "true" || token == undefined) {
  window.location.href = "../../index.html";
} else {
  const url =
    "http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/instance/get";
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
      const requests = data;
      // Get the data container element
      const dataContainer = document.getElementById("dataContainer");
      const outerDiv = document.createElement("div");
      requests.forEach((request) => {
        // Create the main div element
        const mainDiv = document.createElement("div");
        mainDiv.classList.add(
          "p-3",
          "w-full",
          "bg-blue-100",
          "my-2",
          "text-blue-500"
        );

        // Create the title paragraph element
        const titleElement = document.createElement("p");
        titleElement.classList.add("text-lg", "font-bold", "underline");
        titleElement.textContent = request.instance_name;

        // Create the description paragraph element
        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = request.instance_description;

        // Create the details button element
        const detailsButton = document.createElement("button");
        detailsButton.classList.add(
          "view_btn",
          "px-4",
          "py-1",
          "font-bold",
          "bg-blue-200",
          "text-blue-500",
          "text-sm"
        );
        detailsButton.textContent = "Details";
        detailsButton.id = request.instance_id;
        detailsButton.setAttribute("data-id", request.instance_id);
        detailsButton.addEventListener("click", view_more);

        // Append the title, description, and button elements to the main div
        mainDiv.appendChild(titleElement);
        mainDiv.appendChild(descriptionElement);
        mainDiv.appendChild(detailsButton);
        outerDiv.appendChild(mainDiv);
      });

      // Append the main div to the data container
      dataContainer.appendChild(outerDiv);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Prevent revisiting the dashboard using the back button
history.pushState(null, null, document.URL);
window.addEventListener("popstate", function () {
  history.pushState(null, null, document.URL);
});

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
      request_info.innerHTML = "";

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

      workflow_details(data.workflow_id, data.instance_id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function workflow_details(workflow_id, inst_id) {
  const instance_id = inst_id;
  const id = workflow_id;
  const url = `http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/get/${id}`;
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
      const workflow_info = document.getElementById("workflow_info");

      workflow_info.innerHTML = "";

      const wi_h1 = document.createElement("h1");
      wi_h1.classList.add(
        "text-md",
        "my-2",
        "font-bold",
        "border-b-2",
        "border-blue-200",
        "text-blue-500"
      );
      wi_h1.innerText = "Workflow details";
      workflow_info.appendChild(wi_h1);

      const ri_h2 = document.createElement("h2");
      ri_h2.classList.add("text-xl", "font-bold", "text-blue-600");
      ri_h2.innerText = data.name;
      workflow_info.appendChild(ri_h2);

      const ri_h4 = document.createElement("h4");
      ri_h4.classList.add("text-md", "text-slate-800");
      ri_h4.innerText = data.description;
      workflow_info.appendChild(ri_h4);

      const ri_p_step = document.createElement("h4");
      ri_p_step.classList.add("text-red-500");
      ri_p_step.innerText = "All Steps";
      workflow_info.appendChild(ri_p_step);

      const ri_p_step_container = document.createElement("div");
      ri_p_step_container.classList.add("step_container");
      workflow_info.appendChild(ri_p_step_container);

      const step_container = document.querySelector(".step_container");
      let num = 0;
      const steps = data.steps;
      steps.forEach((step) => {
        console.log(step);
        num += 1;
        const ri_step_name = document.createElement("p");
        ri_step_name.classList.add("text-lg", "font-bold");
        ri_step_name.innerText = `${num} : ${step.step_name}`;
        step_container.appendChild(ri_step_name);

        const ri_step_desc = document.createElement("p");
        ri_step_desc.classList.add("ps-5", "text-slate-500");
        ri_step_desc.innerText = step.step_description;
        step_container.appendChild(ri_step_desc);
      });
      // Create the delete button element
      const deleteButton = document.createElement("button");
      deleteButton.classList.add(
        "delete_btn",
        "px-4",
        "py-1",
        "font-bold",
        "bg-red-200",
        "text-red-500",
        "text-sm",
        "my-4"
      );
      deleteButton.textContent = "Delete";
      deleteButton.id = instance_id;
      deleteButton.setAttribute("data-id", instance_id);
      deleteButton.addEventListener("click", delete_instance);
      workflow_info.appendChild(deleteButton);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function delete_instance(event) {
  const delete_id = event.target.getAttribute("data-id");
  const url = `http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/get/${id}`;
  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
