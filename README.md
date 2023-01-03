# Darling.
<a href="https://top.gg/bot/743150068726628440" target="_blank"><img src="https://top.gg/api/widget/servers/743150068726628440.svg"></a>
### This is the code of my bot
So I'd prefer if You would just add it to your server with [this](https://eckigerluca.com/darling/invite) link.

### But if You want to host it by yourself,
rename the `config.json.public` to `config.json` (found under `src/data`) and edit the values. The Bot **needs** the `SERVER MEMBERS INTENT`, so make sure to enable it!

Make sure that you have a mongo-db database avaiable for bot! The name of the database needs to be `darling` and inside that db a collection called `welcome` is required.

New with Version 2.0 is a Web Dashboard, which can't be disabled! <br>
Set it up by renaming the `settings.json.public` (found under `src/website`) to `settings.json` and changing the values in the as needed. Client ID and Secret are found at the OAuth2 Section of your Application. You also need to add your Domain and Callback URL to the Redirects.

After that, use `npm i` to install all needed packages. When done, register the slash commands by using `npm run deploy` in your console.

You can then start the bot with `npm start` or `node .`

If the bot is online, invite it to the server You want to use it on and check if the Dashboard works. (Check the image for permissions).

![img](https://user-images.githubusercontent.com/63116530/133927732-7ad6a8e1-86cb-4ece-8753-ec69be1b370c.png)
If the Bot won't start, check the console for any errors and if there are one's, create an Issue (or try to fix them by yourself).

## Top.gg
This bot uses Top.gg. If you don't want to use it, leave the variable `topGG` in the `index.js` as it is, but if you want to use it change the bool to true and PLEASE DO NOT forget to add your token in the config file!

## Contact:
* [E-Mail](mailto:contact@eckigerluca.com)
* Discord: `EckigerLuca#0001`
* Support [Server](https://eckigerluca.com/discord)

##
<a href="https://discord.gg/tpUr7d3" target="_blank"><img src="https://discordapp.com/api/guilds/689756047107293191/widget.png?style=banner2"></a>