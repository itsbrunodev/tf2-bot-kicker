window.onload = () => {
  setInterval(() => {
    $("#app").load("#app");
  }, 1000);
};
