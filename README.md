<h1 align="center">TF2 Bot Kicker</h1>
<p align="center">A tool that automatically detects and kicks bots in Team Fortress 2.</p><br/>

## Usage

To start using this tool, you need to download it from [here](https://github.com/brunolepis/tf2-bot-kicker/archive/refs/heads/master.zip).

```
net_start
rcon_address xxx.xxx.x.xx
rcon_password tf2-bot-kicker
```

**Step 1.** Add the 3 lines above to your `autoexec.cfg` file. The `rcon_address` value needs to be your local IPv4 address (example: 192.168.0.13).\
**Step 2.** Add `-condebug -conclearlog -usercon -exec autoexec` to your TF2 launch options in Steam.\
**Step 3.** Set your `/tf` directory location in `cfg/config.js`.

## Configuration

`steam_id` is your SteamID3 (example: U:1:XXXXXXXXXX)\
`tf_path` is the location of the `/tf` directory in Team Fortress 2\
`rcon`\
&nbsp;&nbsp;&nbsp;&nbsp;`ip` is your local IPv4 address (example: 192.168.0.13)\
&nbsp;&nbsp;&nbsp;&nbsp;`port` (default: 27015)\
&nbsp;&nbsp;&nbsp;&nbsp;`password` (default: tf2-bot-kicker)\
`urls` default urls where the bots' steamIDs are stored
