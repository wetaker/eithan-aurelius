# What am I
The 'discord-bot' portion of the Discord Time Logger project.

Check out the [frontend](https://github.com/wetaker/discord-bot-front) and [API]() to see the rest of the project.

# Purpose
This projects goal is to allow users to see where they spend their time in discord. For example, if one were to add the bot to a server of a group of friends 
who had channels for studying and different video games, the server members could subscribe to the bot and see how much time they spend studying and playing
games in a given time duration.

# Summary
This project works by 

1. checking whenever users move channels and recording these time changes.

2. sending a bulk update once in a while to the MongoDB database with the respective time duration updates.

3. (A simple API is included to request data).

4. The frontend portion uses this API to collect data and display the top time spenders.
