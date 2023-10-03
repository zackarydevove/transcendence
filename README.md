# Transcendence

Transcendence is a full-stack single page web app crafted by 5 students from École 42, encapsulating a dynamic Pong game as our final common-core project.

# Tech stack

<ul>
<li>Typescript</li>
<li>Next</li>
<li>Tailwind</li>
<li>BabylonJS (For a 3D Pong Game style)</li>
<li>NestJS</li>
<li>PostgreSQL</li>
<li>Prisma</li>
<li>Socket.io</li>
<li>Azure Devops (For backlogs, management, pull request, etc.)</li>
</ul>

# Features

<h2>Pong Game</h2>
<ul>
<li>Solo and multiplayer modes (solo against bot)</li>
<li>Can modify skins, map textures, bot difficulty</li>
<li>Matchmaking system</li>
<li>1v1 game invites</li>
<li>Lag, bug, and disconnection management</li>
<li>Elo rating system, leaderboard, match history</li>
</ul>

<h2>Social Features</h2>
<ul>
<li>Add, delete, block, unblock friends</li>
<li>Private chat and group chats</li>
<li>Creator/Admin control in groups</li>
</ul>

<h2>Account Management</h2>

<ul>
<li>JWT and 42 OAuth authentication</li>
<li>2FA via email</li>
<li>Change username and avatar</li>
</ul>

# To start the project

1. git clone https://github.com/zackarydevove/transcendence.git
2. run `docker-compose --build up`\

Note: To enable 42 OAuth functionality, ensure to set the 42 API key in the .env file. This feature is exclusively available to students.
