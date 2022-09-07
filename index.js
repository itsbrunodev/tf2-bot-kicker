const Rcon = require("rcon");
const {
  log,
  removeDuplicates,
  capitalize,
  cacheList,
  formatter,
  difference,
} = require("./util/functions");
const config = require("./cfg/config");
const SteamID = require("steamid");
const { readdirSync, readFileSync, existsSync } = require("fs");

/* rcon connection */
const { ip, port, password } = config.rcon;
const connection = new Rcon(ip, port, password);

/* user info, tf2 console file path, and caching of the bot list files */
const { steam_id, tf_path, urls } = config;
const playerId = steam_id.replace("[", "").replace("]", "");
const tf2Path = tf_path.replace("/", "\\");
/* verify config values */
if (!existsSync(`${tf2Path}\\console.log`)) {
  console.log(`${log("error")} Your tf2 console file path couldn't be found`);
  return process.exit(1);
} else if (!playerId) {
  console.log(`${log("error")} Your Steam ID couldn't be found`);
  return process.exit(1);
} else if (!ip) {
  console.log(`${log("error")} Your RCON ip couldn't be found`);
  return process.exit(1);
}
cacheList(urls);
/* status */
let connected = false;
let command = "";
let lastCalled = 0;
let voteDelay = 2 * 60 * 1000 + 35 * 1000; /* 2 min 35 sec, ~150,000 ms */
let logFile = readFileSync(`${tf2Path}\\console.log`, "utf8");
/* game */
let lobbyIds = [];
let lobby = {};
let logs = [];
let debugPlayers = [];
let players = [];

const express = require("express");
const app = express();
const appPort = 3000;

app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  return res.render("index", {
    title: "TF2 Bot Kicker",
    logs,
    players,
    connected,
    lobby,
  });
});

connection
  .on("auth", () => {
    return console.log(`${log("rcon")} Connection established with rcon`);
  })
  .on("response", async (str) => {
    if (command === "tf_lobby_debug") {
      if (str === "Failed to find lobby shared object")
        return (connected = false);
      else connected = true;

      const lobbyDebug_Lobby = /ID:(\w+)\s+(\d+)\s+[\w\(\),]+\s+(\d*)\s+/gm;

      while ((match = lobbyDebug_Lobby.exec(str)) !== null) {
        if (lobbyIds.length === 0) {
          lobbyIds.push(match[1]);
        } else if (lobbyIds.length === 1 && lobbyIds[0] !== match[1]) {
          lobbyIds.push(match[1]);
        } else if (
          lobbyIds.length === 2 &&
          lobbyIds[0] === lobbyIds[1] &&
          lobbyIds[1] !== match[1]
        ) {
          lobbyIds.splice(0, 1);
          lobbyIds.push(match[1]);
        }
        lobby = {
          id: match[1],
          playerCount: match[2],
          pendingCount: match[3],
          map: lobby.map,
        };
        continue;
      }

      const tempPlayers = [];

      const lobbyDebug_User = /\s+\[(\w+:\d+:\d+)\]\s+\w+\s+=\s+(\w+)/gm;
      while ((match = lobbyDebug_User.exec(str)) !== null) {
        const obj = {
          steamId: match[1],
          team: match[2] === "TF_GC_TEAM_DEFENDERS" ? "defenders" : "invaders",
        };
        if (!tempPlayers.find((x) => x.steamId === match[1]))
          tempPlayers.push(obj);
        if (!debugPlayers.find((x) => x.steamId === match[1]))
          debugPlayers.push(obj);
        continue;
      }

      players.map((player, index) => {
        if (!tempPlayers.find((x) => x.steamId === player.steamId)) {
          players.splice(index, 1);
          if (debugPlayers.find((x) => x.steamId === player.steamId)) {
            debugPlayers.splice(
              debugPlayers.findIndex((x) => x.steamId === player.steamId),
              1
            );
          } else return;
          return;
        } else return;
      });

      /* bot detector and kicker */
      try {
        const files = readdirSync("./cache/");
        return files.map((file) => {
          const res = readFileSync(`./cache/${file}`, "utf8");
          const response = JSON.parse(res);
          const data = response.players;
          if (data.length === 0) return;
          if (players.length <= 1) return;
          else
            return players.map((player, index) => {
              let steamId = `[${player.steamId}]`;
              if (file === "pazer.json") {
                const steamid = new SteamID(`[${player.steamId}]`);
                steamId = Number(steamid.getSteamID64()) - 1;
              }
              const cheater = data.find((x) => x.steamid === steamId);
              const user = players.find((x) => x.steamId === playerId);

              if (cheater && !player.cheater) {
                players.splice(index, 1, {
                  ...player,
                  cheater: true,
                });
              }

              if (cheater && user && user.team === player.team) {
                if (lastCalled >= Date.now() - voteDelay) return;
                lastCalled = Date.now();
                command = `callvote kick ${player.id}`;
                connection.send(command);
                const date = new Date();
                logs.push({
                  content: player.name,
                  time: `${
                    date.getHours() < 10
                      ? `0${date.getHours()}`
                      : `${date.getHours()}`
                  }:${
                    date.getMinutes() < 10
                      ? `0${date.getMinutes()}`
                      : `${date.getMinutes()}`
                  }:${
                    date.getSeconds() < 10
                      ? `0${date.getSeconds()}`
                      : `${date.getSeconds()}`
                  }`,
                });
                console.log(`${log("vote")} Called vote on ${player.name}`);
                return;
              } else return;
            });
        });
      } catch {
        return;
      }
    } else if (command === "status") {
      const logFile2 = readFileSync(`${tf2Path}\\console.log`, "utf8");
      const status = difference(logFile, logFile2);
      if (!status.includes("Valve Matchmaking Server")) return;
      logFile = logFile2;

      const map_Lobby = /map\s+:\s+(\w+)/gm;
      while ((match = map_Lobby.exec(status)) !== null) {
        const regex = /([a-z]+)_(\w+)/;
        const mapType = match[1].match(regex)[1];
        const mapName = match[1].match(regex)[2];
        const map = [`${capitalize(mapName)}`, `${formatter(mapType)}`];
        if (lobbyIds.length === 1 && map !== lobbyIds[0]) {
          lobby.map = map;
          continue;
        } else if (lobbyIds.length === 2 && lobbyIds[1] !== lobbyIds[0]) {
          lobby.map = map;
          continue;
        } else continue;
      }

      const status_User =
        /^#\s+(\d+)\s+\"([-+., A-Za-z0-9\S]+)\"\s+\[(\w+:\d+:\d+)\]\s+([\d:]+)\s+\d+\s+\d\s+\w+$/gm;
      while ((match = status_User.exec(status)) !== null) {
        const debugPlayer = debugPlayers.find((x) => x.steamId === match[3]);
        const player = players.find((x) => x.steamId === match[3]);
        if (player) {
          players.splice(
            players.findIndex((x) => x.steamId === match[3]),
            1,
            {
              name: match[2],
              nameShort:
                match[2].length >= 40
                  ? `${match[2].substring(0, 37)}...`
                  : match[2],
              connected: match[4],
              cheater: player.cheater,
              id: match[1],
              steamId: match[3],
              team: debugPlayer?.team,
            }
          );
          continue;
        } else {
          players.push({
            name: match[2],
            nameShort:
              match[2].length >= 40
                ? `${match[2].substring(0, 37)}...`
                : match[2],
            connected: match[4],
            cheater: false,
            id: match[1],
            steamId: match[3],
            team: debugPlayer?.team,
          });
          continue;
        }
      }

      return;
    } else return;
  })
  .on("server", (str) => {
    return console.log(str);
  })
  .on("error", (err) => {
    return console.log(err);
  })
  .on("end", () => {
    console.log(`${log("rcon")} Connection closed`);
    process.exit();
  });

connection.connect();

setInterval(() => {
  if (!connected) {
    debugPlayers = [];
    players = [];
    lastCalled = 0;
    if (lobbyIds.length === 2) {
      lobbyIds.splice(0, 1);
    }
  }
  if (lobbyIds.length === 2 && lobbyIds[0] !== lobbyIds[1]) {
    lobbyIds.splice(0, 1);
    debugPlayers = [];
    players = [];
    lastCalled = 0;
  }
  if (players.length <= 1) return;
  else if (debugPlayers.length <= 1) return;
  else {
    debugPlayers = removeDuplicates(debugPlayers, "steamId");
    players = removeDuplicates(players, "steamId");
    return;
  }
}, 0);

setInterval(() => {
  command = "tf_lobby_debug";
  connection.send(command);
}, 1000);

setInterval(() => {
  if (!connected) return;
  command = "status";
  connection.send(command);
}, 5500);

app.listen(appPort, () => {
  console.log(`${log("web")} Listening on port ${appPort}`);
});
