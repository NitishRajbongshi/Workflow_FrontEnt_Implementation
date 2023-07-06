const url =
  "http://localhost/workflow_management_system_v1/wp-json/workflow-management/v1/workflow/get";
const token = sessionStorage.getItem("token");
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
    const workflows = data;
    const dropdown_workflow_name = document.querySelector(".workflow_name");
    workflows.forEach((workflow) => {
      // console.log(workflow.workflow_title);
      const option = document.createElement("option");
      option.value = workflow.workflow_title;
      option.innerText = workflow.workflow_title;
      dropdown_workflow_name.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
