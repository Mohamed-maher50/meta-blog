window.addEventListener("error", (event) => {
  // Send to your error tracking service
  reportError(event.error);
});
