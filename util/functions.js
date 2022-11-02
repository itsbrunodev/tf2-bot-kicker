const fs = require("node:fs");
const SteamID = require("steamid");
const config = require("../config");

module.exports.sort = (arr, by) => {
  return arr.sort((a, b) => {
    if (!a[by] || !b[by]) return 0;
    const valA = a[by].toUpperCase();
    const valB = b[by].toUpperCase();
    if (valA < valB) {
      return -1;
    }
    if (valA > valB) {
      return 1;
    }
    return 0;
  });
};

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
