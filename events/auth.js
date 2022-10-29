const fs = require("node:fs");
const { urls } = require("../config");
const axios = require("axios");
const client = require("../index");
const { Regex } = require("../util/constants");

client.on("auth", () => {
  console.log("Connected to rcon!");

  if (!fs.existsSync("./cache")) fs.mkdirSync("./cache");

  urls.forEach(async (url) => {
    /* get the contents of the url */
    const res = await axios.get(url);
    const players = res.data.players;
    const reg = url.matchAll(Regex.URL);
    for (let result of reg) {
      const { name } = result.groups;
      const fileName = `${name}.json`;
      /* save the contents of the url to a file */
      fs.writeFileSync(`./cache/${fileName}`, JSON.stringify({ players }));
      console.log(`Cached ${fileName}`);
      return;
    }
    return;
  });

  setInterval(() => {
    client.command = "tf_lobby_debug";
    client.send(client.command);
  }, 1000);

  setInterval(() => {
    client.command = "status";
    client.send(client.command);
  }, 6000 /* changing this to anything bellow 6000 might break things */);
});
