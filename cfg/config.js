module.exports = {
  steam_id: "U:1:901819220",
  tf2_console_file_path:
    "D:\\Games\\Steam\\steamapps\\common\\Team Fortress 2\\tf\\console.log",
  rcon: {
    ip: "192.168.0.13",
    port: 27015 /* default */,
    password: "tf2bk" /* default */,
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
      url: "https://tf2bdd.pazer.us/v1/steamids", /* this url is temporarily offline */
    },
  ],
};
