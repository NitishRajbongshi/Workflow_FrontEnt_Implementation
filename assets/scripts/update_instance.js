function handleInstance(e) {
    e.preventDefault();
    
    const handler_option = document.getElementById("handle_option");
    const response_value = handler_option.value;
    console.log(response_value);
    const handle_request_btn = document.getElementById("handle_request_btn");
    const instance_id = handle_request_btn.getAttribute("data-id");
    console.log(instance_id);

    
}
// Add event listener to the form submit event
document
  .getElementById("handle_instance")
  .addEventListener("submit", handleInstance);