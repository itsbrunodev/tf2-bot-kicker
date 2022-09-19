module.exports = {
  /* your steam id (example U:1:XXXXXXXXXX) */
  steam_id: "",
  /* the location of the /tf directory in Team Fortress 2 (example: C:/Program Files/Steam/steamapps/common/Team Fortress 2/tf) */
  tf_path: "",
  /* rcon settings */
  rcon: {
    ip: "" /* (example: 192.168.0.13) */,
    port: 27015 /* default */,
    password: "tf2bk" /* default */,
  },
  /* default urls where the bots' steamIDs are stored
     NOTE: Do NOT change anything bellow unless you know what you are doing! */
  urls: [
    {
      name: "biglist",
      disabled: false,
      url: "https://gist.githubusercontent.com/wgetJane/0bc01bd46d7695362253c5a2fa49f2e9/raw/playerlist.biglist.json",
    },
    {
      name: "milenko",
      disabled: false,
      url: "https://raw.githubusercontent.com/incontestableness/milenko-lists/master/playerlist.milenko-cumulative.json",
    },
    {
      name: "lozarth",
      disabled: false,
      url: "https://raw.githubusercontent.com/Lozarth/rules.lozarth.json/main/playerlist.lozarth.json",
    },
    {
      name: "qfoxb",
      disabled: false,
      url: "https://raw.githubusercontent.com/qfoxb/tf2bd-lists/main/playerlist.qfoxb.json",
    },
    {
      name: "pazer",
      disabled: true /* offline */,
      url: "https://tf2bdd.pazer.us/v1/steamids",
    },
  ],
};
