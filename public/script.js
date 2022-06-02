window.onload = () => {
  setInterval(() => {
    $("#app").load("#app");
    /* const row = document.getElementById("table").getElementsByTagName("tr");
    for (let i = 0; i < row.length; i++) {
      row[i].innerHTML = row[i].innerHTML;
    } */
  }, 100);

  /* for (let i = 0; i < row.length; i++) {
    row[i].innerHTML = row[i].innerHTML;
  } */

  /* const buttons = document.getElementsByClassName("steamUser");

  for (var i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener("click", (e) => {
      const steamId = e.target.parentNode.parentNode.lastElementChild.innerHTML;
      window.location.href = `http://localhost:3000/?steamId=${steamId}`;
    });
  } */
};
