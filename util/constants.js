module.exports.Lobby = {
  Disconnected: "Failed to find lobby shared object",
};

module.exports.Regex = {
  URL: /\/playerlist.(?<name>[\w+:.-]*).json/g,
  Lobby: /ID:(?<id>\w+)\s+(?<members>\d+)\s+[\w(),]+\s+(?<pending>\d+)/g,
  User: /\w+\[\d+\]\s+(?<steamId>\[U:[10]:[0-9]+\])\s+\w+\s+=\s+(?<team>\w+)\s+\w+\s+=\s+(?<type>\w+)/g /* tf_lobby_debug */,
  Map: /map\s+:\s+(?<map>\w+)/g,
  Players:
    /players\s+:\s+(?<humans>\d+)\s+[\w,]+\s+(?<bots>\d+)\s+\w+\s+\((?<max>\d+)/g,
  Player:
    /#\s+(?<id>\d+)\s+"(?<name>[-+., \w\S]+)"\s+(?<steamId>\[U:[10]:[0-9]+\])\s+(?<connected>[\w:]+)\s+(?<ping>\w+)\s+(?<loss>\w+)\s+(?<state>\w+)/g /* status */,
};

module.exports.Team = {
  Blu: "TF_GC_TEAM_INVADERS",
  Red: "TF_GC_TEAM_DEFENDERS",
};

module.exports.MemberType = {
  Player: "MATCH_PLAYER",
  Pending: "MATCH_PENDING",
};
