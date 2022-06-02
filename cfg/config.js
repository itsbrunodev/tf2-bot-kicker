module.exports = {
  /* your steam id (example U:1:XXXXXXXXXX) */
  steam_id: "",
  /* the location of the /tf directory in team fortress 2 */
  tf_path: "",
  /* rcon settings */
  rcon: {
    ip: "",
    port: 27015 /* default */,
    password: "tf2-bot-kicker" /* default */,
  },
  /* default urls where the bots' steamIDs are stored  */
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
      name: "pazer",
      disabled: true,
      url: "https://tf2bdd.pazer.us/v1/steamids" /* this url is temporarily offline */,
    },
  ],
};
