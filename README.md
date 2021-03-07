# Darling.
This is the Discord Bot Darling. To run it, install all packages listed below.

    -discord.py[voice]

    -PyNaCl

    -asyncio

    -youtube_dl

    -youtube-search

    -python-dotenv

    -ffmpeg

    -aiohttp

    -praw

    -datetime

    -wgeg
    

    ONLY ON LINUX:

    -screen

You will also need to create an application at https://old.reddit.com/prefs/apps and https://discord.com/developers/applications. Then change in ".env" and ".env.debug" DISCORD_BOT_TOKEN, REDDIT_APP_ID, REDDIT_APP_SECRET to your tokens/ids/secrets. Then, in "hentai.py" and "meme.py" you'll have to change the value "user_agent", just how it's shown in the code. In "main.py", change in line 52 the footer to your footer, or leave it as it is.

When creating the bot, make sure to give it Administrator permission and enable server members indent.


Run the Bot on Windows with "python main.py" from the CMD or the console in your IDE. To stop it, simply press ctrl + c ONCE in the CMD window.


To run the Bot permanently on a linux system, use "screen -S YOUR NAME HERE bash start.sh" in the folder where the bot is located. Then exit the virtual SSH session with ctrl + a+d

Replace YOUR NAME HERE with the name you want to acces the screen.

To stop the bot, use "screen -R YOUR NAME HERE" and hold ctrl + c until you're back in the folder where the bot is located.


If you're having any problems, contact me on Discord: EckigerLuca#0001
