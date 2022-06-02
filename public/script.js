window.onload = () => {
  setInterval(() => {
    $("#app").load("#app");
  }, 500);
};
