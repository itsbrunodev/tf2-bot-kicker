const fs = require("node:fs");
const SteamID = require("steamid");

module.exports.loadEvents = () => {
  fs.readdirSync("./events/")
    .filter((file) => file.endsWith(".js"))
    .forEach((event) => {
      require(`../events/${event}`);
    });
};

module.exports.compare = (str1, str2) => {
  let diff = "";
  str2.split("").forEach(function (val, i) {
    if (val != str1.charAt(i)) diff += val;
  });
  return diff;
};

module.exports.steamId = () => {
  let steamID = new SteamID(config.steamId);
  return steamID.getSteam3RenderedID();
};
