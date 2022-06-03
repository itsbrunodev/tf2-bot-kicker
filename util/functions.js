const { default: axios } = require("axios");
const colorette = require("colorette");
const { writeFileSync } = require("fs");

module.exports.log = (type) => {
  const date = new Date();
  const time = `${colorette.bgYellow(
    colorette.black(
      ` ${
        date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
      }:${
        date.getMinutes() < 10
          ? `0${date.getMinutes()}`
          : `${date.getMinutes()}`
      }:${
        date.getSeconds() < 10
          ? `0${date.getSeconds()}`
          : `${date.getSeconds()}`
      } `
    )
  )}`;
  switch (type) {
    case "rcon": {
      return `${time} ${colorette.bgBlue(colorette.black(` rcon `))}`;
    }
    case "vote": {
      return `${time} ${colorette.bgGreen(colorette.black(` vote `))}`;
    }
    case "web": {
      return `${time} ${colorette.bgCyan(colorette.black(` web `))}`;
    }
    case "error": {
      return `${time} ${colorette.bgRed(colorette.black(` error `))}`;
    }
    case "success": {
      return `${time} ${colorette.bgGreen(colorette.black(` success `))}`;
    }
  }
};

module.exports.removeDuplicates = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

module.exports.cacheList = (urls) => {
  return urls.map(async (url) => {
    try {
      writeFileSync(
        `${__dirname}\\..\\cache\\${url.name}.json`,
        JSON.stringify({ players: [] })
      );
      if (url.disabled) return;
      const res = await axios.get(url.url);
      const data = res.data.players;
      writeFileSync(
        `${__dirname}\\..\\cache\\${url.name}.json`,
        JSON.stringify({ players: data })
      );
      return;
    } catch {
      return;
    }
  });
};

module.exports.capitalize = (str) => {
  return str
    .replace("_", " ")
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.substr(1);
    })
    .join(" ");
};

module.exports.formatter = (str) => {
  return str === "pl"
    ? "Payload"
    : str === "ctf"
    ? "Capture the Flag"
    : str === "cp"
    ? "Control Point"
    : str === "tc"
    ? "Territorial Control"
    : str === "arena"
    ? "Arena"
    : str === "plr"
    ? "Payload Race"
    : str === "koth"
    ? "King of the Hill"
    : str === "pass"
    ? "PASS Time"
    : str === "pd"
    ? "Player Destruction"
    : str;
};

module.exports.difference = (str1, str2) => {
  let diff = "";
  str2.split("").forEach((val, i) => {
    if (val != str1.charAt(i)) diff += val;
  });
  return diff;
};
