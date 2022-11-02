const rcon = require("rcon");
const express = require("express");
const fs = require("node:fs");
const config = require("./config");

/* check if required values are set in the config */
let configured = true;
for (const x in config) {
  if (config[x]?.length === 0) {
    configured = false;
    return console.log(`Please set the "${x}" in the config.json file`);
  }
}
if (!configured) process.exit(1);

const { loadEvents, steamId, sort } = require("./util/functions");

/* establish a connection with rcon */
const { ip, port, password } = config.rcon;
const client = new rcon(ip, port, password);

/* client variables */
client.playerSteamId = config.steamId;
client.tfPath = config.tfPath;
client.connected = false;
client.command = null;
client.consoleFile = fs.readFileSync(`${config.tfPath}/console.log`, "utf-8");
client.lobby = {};
client.members = [];
client.tempMembers = [];
/*  */
client.files = [];
const dir = fs.readdirSync("./cache/", { withFileTypes: true });
const files = dir.filter((x) => !x.isDirectory()).map((x) => x.name);
files.forEach((x) => {
  const file = fs.readFileSync(`./cache/${x}`, "utf-8");
  client.files.push({
    name: x.replace(/.json/g, ""),
    content: file,
  });
});

module.exports = client;

/* load the events in ./events */
loadEvents();

/* establish a connection with the rcon */
client.connect();

/* create express app */
const app = express();

/* set epxress values */
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.set("view engine", "ejs");

/* index.ejs */
app.get("/", async (req, res) => {
  const sortedByName = sort(client.members, "name");
  const members = sort(sortedByName, "team");

  return res.render("index", {
    title: "TF2 Bot Kicker",
    connected: client.connected,
    lobby: client.lobby,
    steamId: steamId(config.steamId),
    members,
  });
});

/* add.ejs */
app.get("/add/:steamid", async (req, res) => {
  const steamid = req.params.steamid;
  if (!steamid) {
    return res.render("add", {
      title: "Add to list",
      text: "Please provide an ID",
    });
  } else {
    if (!fs.existsSync("./cache/custom.json"))
      fs.writeFileSync("./cache/custom.json", JSON.stringify({ players: [] }));
    const custom = fs.readFileSync("./cache/custom.json", "utf-8");
    const data = JSON.parse(custom);
    const players = data.players;

    if (players.find((x) => x.steamid === steamid)) {
      return res.render("add", {
        title: "Add to list",
        success: false,
        id: steamid,
        text: "That player is already on the list",
      });
    } else if (steamid === steamId()) {
      return res.render("add", {
        title: "Add to list",
        success: true,
        id: steamid,
        text: "You can't add yourself to the list",
      });
    } else {
      players.push({ steamid });
      const stringified = JSON.stringify({ players });
      fs.writeFileSync("./cache/custom.json", stringified);
      client.files.splice(
        client.files.findIndex((x) => x.name === "custom"),
        1,
        { name: "custom", content: stringified }
      );
      return res.render("add", {
        title: "Add to list",
        success: true,
        id: steamid,
        text: `Added ${steamid} to the list`,
      });
    }
  }
});

/* remove.ejs */
app.get("/remove/:steamid", async (req, res) => {
  const steamid = req.params.steamid;
  if (!steamid) {
    return res.render("remove", {
      title: "Remove from list",
      text: "Please provide an ID",
    });
  } else {
    if (!fs.existsSync("./cache/custom.json"))
      fs.writeFileSync("./cache/custom.json", JSON.stringify({ players: [] }));
    const custom = fs.readFileSync("./cache/custom.json", "utf-8");
    const data = JSON.parse(custom);
    const players = data.players;

    if (players.find((x) => x.steamid === steamid)) {
      players.splice(
        players.findIndex((x) => x.steamid === steamid),
        1
      );
      const stringified = JSON.stringify({ players });
      fs.writeFileSync("./cache/custom.json", stringified);
      client.files.splice(
        client.files.findIndex((x) => x.name === "custom"),
        1,
        { name: "custom", content: stringified }
      );
      return res.render("remove", {
        title: "Remove from list",
        text: `Removed ${steamid} from the list`,
      });
    } else {
      return res.render("remove", {
        title: "Remove from list",
        text: `That player isn't on the list`,
      });
    }
  }
});

/* start dashboard */
app.listen(config.dashboard.port, () => {
  console.log(`Running on http://localhost:${config.dashboard.port}`);
});
