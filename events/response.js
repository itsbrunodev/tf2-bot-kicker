const client = require("../index");
const config = require("../config");
const fs = require("node:fs");

const { Lobby, Regex } = require("../util/constants");
const { compare, steamId } = require("../util/functions");

client.on("response", (response) => {
  /* check if the user is not connected */
  if (response === Lobby.Disconnected) {
    client.connected = false;
    client.lobby = {};
    if (client.members.length !== 0) client.members = [];
    return;
    /* if the user is connected to a lobby */
  } else if (
    client.command === "tf_lobby_debug" &&
    response !== Lobby.Disconnected
  ) {
    client.connected = true;
  }

  /* check if the user has joined a newer lobby than before */
  if (client.lobby.id?.length >= 2) {
    if (client.lobby.id[0] !== client.lobby.id[1]) {
      client.members = [];
    }
    client.lobby = { ...client.lobby, id: [client.lobby.id[1]] };
  }

  /* if the user isn't connected then exit */
  if (!client.connected) return;

  switch (client.command) {
    /* this command runs every second */
    case "tf_lobby_debug": {
      const reg = response.matchAll(Regex.User);
      for (let result of reg) {
        const { steamId, team, type } = result.groups;

        const member = client.members.find((m) => m?.steamId === steamId);

        /* if the member exists and was autobalanced (put into another team) */
        if (member && member.team !== team) {
          client.members.splice(
            client.members.findIndex((m) => m?.steamId === steamId),
            1,
            {
              ...member,
              team,
            }
          );
          continue;
          /* if the member already exists but nothing has changed, continue */
        } else if (member) {
          continue;
        } else {
          /* otherwise push the member to the members array */
          client.members.push({
            steamId,
            team,
            type,
          });
          continue;
        }
      }

      const regLobby = response.matchAll(Regex.Lobby);
      for (let result of regLobby) {
        const { id, members, pending } = result.groups;
        const obj = { id: [], members, pending };
        const lobbyId = client.lobby.id || [];

        /* if the lobby id array is empty, push the new id */
        if (lobbyId.length === 0) {
          obj.id.push(id);
          /* if the lobby id array has 1 element and the 1st element doesn't equal the new lobby id, push the new id */
        } else if (lobbyId.length === 1 && lobbyId[0] !== id) {
          obj.id.push(id);
          /* if the lobby id array has 2 elements and the 1st element equals the 2nd element from the lobby array and the 2nd element from the lobby id array doesn't equal the new id, replace the 1st id with the new one */
        } else if (
          lobbyId.length === 2 &&
          lobbyId[0] === lobbyId[1] &&
          lobbyId[1] !== id
        ) {
          obj.id.splice(0, 1, id);
        }

        client.lobby = obj;
      }

      break;
    }
    case "status": {
      /* get the contents of the console's log file */
      const consoleFile = fs.readFileSync(
        `${config.tfPath}/console.log`,
        "utf-8"
      );

      /* the members array after modifying the client.members array */
      const membersAfter = [];

      const reg = compare(client.consoleFile, consoleFile).matchAll(
        Regex.Player
      );
      for (let result of reg) {
        const { id, steamId, name, connected, ping, loss, state } =
          result.groups;

        const member = client.members.find((m) => m?.steamId === steamId);

        /* if the member doesn't exist in the client.members array, continue */
        if (!member) {
          continue;
          /* otherwise modify the existing member, add id, name, connected, ping, loss, state, cheater and voted to the member object */
        } else {
          const obj = {
            ...member,
            id,
            name,
            connected,
            ping,
            loss,
            state,
            cheater: false,
            voted: false,
          };
          client.members.splice(
            client.members.findIndex((m) => m?.steamId === steamId),
            1,
            obj
          );
          membersAfter.push(obj);
          continue;
        }
      }

      /* replace the client.consoleFile with the new one */
      client.consoleFile = consoleFile;

      /* the members array before modifying the client.members array */
      const membersBefore = client.members;

      /* the players that left the lobby (array) */
      const playersLeft = membersBefore
        .filter((x) => !membersAfter.includes(x))
        .concat(membersAfter.filter((x) => !membersBefore.includes(x)));

      /* remove the players that left from the client.members array */
      playersLeft.forEach((playerLeft) => {
        const index = client.members.findIndex(
          (x) => x.steamId === playerLeft.steamId
        );
        client.members.splice(index, 1);
      });

      const regMap = response.matchAll(Regex.Map);
      for (let result of regMap) {
        const { map } = result.groups;
        /* add the lobby's map */
        client.lobby = { ...client.lobby, map };
      }

      const regLobby = response.matchAll(Regex.Players);
      for (let result of regLobby) {
        const { max } = result.groups;
        /* add the lobby's max player limit */
        client.lobby = { ...client.lobby, max };
      }

      const tempVoted = [];

      /* bot detection */
      client.files.forEach((file) => {
        /* get the players array from the file */
        const players = JSON.parse(file.content).players;
        /* get the user's object from the client.members array */
        const player = client.members.find(
          (member) => member.steamId === steamId()
        );

        client.members.forEach((member, index) => {
          /* a cheater's object found in the players array */
          const found = players.find(
            (player) => player.steamid === member.steamId
          );

          const voted = tempVoted.find((x) => x === member.steamId);

          /* if the cheater is found and isn't already voted on and is on the same team as the user */
          if (found && !member.voted && !voted && member.team === player.team) {
            /* call a votekick against the cheater */
            client.command = `callvote kick ${member?.id}`;
            client.send(client.command);
            /* update the cheater's object, set cheater to true and voted to true, push to tempVoted */
            tempVoted.push(member.steamId);
            client.members.splice(index, 1, {
              ...member,
              cheater: true,
              voted: true,
            });
            /* log the action */
            console.log(`Votekicking ${member.name} (${member.id})`);
            /* if the cheater is found */
          } else if (found) {
            /* update the cheater's object, set cheater to true */
            client.members.splice(index, 1, {
              ...member,
              cheater: true,
            });
          }
        });
      });

      break;
    }
  }
});
