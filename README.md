# TF2 Bot Kicker

A tool that automatically detects and kicks bots in Team Fortress 2.

## Introduction

TF2BK is using Steam's [RCON](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol) protocol to scan for bots in your lobby and call a votekick in an attempt to kick them. Included is a web dashboard where you can see all the players in your lobby and some basic statistics about them.

## Setup

**Step 1.** Download the latest release from the [releases](https://github.com/brunolepis/mcsc/releases/latest) tab

**Step 2.** Then, install the dependencies required to run the server

```
npm install
```

**Step 3.** Add the 3 lines bellow to your `autoexec.cfg` file (`Team Fortress 2/tf/cfg/overrides/`). The `rcon_address` value needs to be your local IPv4 address (example: `192.168.0.1`)

```
net_start
rcon_address xxx.xxx.x.xx
rcon_password tf2bk
```

**Step 4.** Add `-condebug -conclearlog -usercon -exec autoexec` to your TF2 launch options in Steam\
**Step 5.** Set your `/tf` directory location, your Steam ID and the rcon IP in `config-template.js`
**Step 6.** Rename `config-template.js` to `config.js`

## Usage

```
npm start
```

## Configuration

`steamId` your Steam ID\
`tfPath` the location of the `/tf` directory in Team Fortress 2 (example: `C:/Program Files/Steam/steamapps/common/Team Fortress 2/tf`)\
`rcon`\
&nbsp;&nbsp;&nbsp;&nbsp;`ip` your local IPv4 address (example: `192.168.0.1`)\
&nbsp;&nbsp;&nbsp;&nbsp;`port` (default: `27015`)\
&nbsp;&nbsp;&nbsp;&nbsp;`password` (default: `tf2bk`)\
`dashboard`\
&nbsp;&nbsp;&nbsp;&nbsp;`port` (default: `3000`)\
`urls` default urls where bot Steam IDs are stored
