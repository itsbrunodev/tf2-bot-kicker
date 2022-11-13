module.exports = {
  steamId: "" /* Your steam ID (example: 76561198862084948) */,
  tfPath:
    "" /* the location of the /tf directory in Team Fortress 2 (example: C:/Program Files/Steam/steamapps/common/Team Fortress 2/tf) */,
  rcon: {
    ip: "" /* your local IPv4 address (example: 192.168.0.1) */,
    port: 27015,
    password: "tf2bk",
  },
  dashboard: {
    port: 3000,
  },
  urls: [
    "https://raw.githubusercontent.com/incontestableness/milenko-lists/master/playerlist.milenko-cumulative.json",
    "https://gist.githubusercontent.com/wgetJane/0bc01bd46d7695362253c5a2fa49f2e9/raw/playerlist.biglist.json",
    "https://raw.githubusercontent.com/d3fc0n6/CheaterList/main/CheaterFriend/playerlist.cheaterfriend.json",
    "https://raw.githubusercontent.com/Lozarth/rules.lozarth.json/main/playerlist.lozarth.json",
    "https://raw.githubusercontent.com/qfoxb/tf2bd-lists/main/playerlist.qfoxb.json",
  ],
};
