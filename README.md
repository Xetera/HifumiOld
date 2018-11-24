<div align="center">
    <img src="https://img.shields.io/travis/Xetera/Hifumi.svg?label=Travis%20CI"> 
    <img src="https://img.shields.io/website/http/hifumi.io/home.svg?label=hifumi.io">
    <a href="https://discordbots.org/bot/372615866652557312" >
        <img src="https://discordbots.org/api/widget/status/372615866652557312.svg" alt="Hifumi" />
    </a>
    <img src="https://img.shields.io/discord/414334929002823680.svg?label=Support%20Server">
</div>
<a href="https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300">
    <img src="assets/banners/hifumi_new.png">
</a>
<hr>

<table style="width:100%">
  <tr>
    <td><strong>Prefix:</strong> $</td>
      <td><strong>Language:</strong> Typescript</td>
      <td><strong>Library:</strong> Discord.js</td>
      <td><a href="https://www.hifumi.io">Hifumi's Website</a></td>
      <td><a href="https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300">Invite Me!</a>       </td>
      <td><a href="https://discord.gg/RM6KUrf">Join the Support Server</a></td>
  </tr>
</table>

### [To Features](#features)
### [To Program Structure and Architecture](#program-structure-and-architecture)
### [To Setup](#setting-up-hifumi)

## Program Structure and Architecture

<div align="center">
    <img height="64" src="https://rynop.files.wordpress.com/2016/09/ts.png?w=816" title="Typescript">
    <img height="64" src="https://dashboard.snapcraft.io/site_media/appmedia/2016/11/postgresql-icon-256x256.jpg.png" title="Postgres">
    <img height="64" src="https://cdn.iconscout.com/public/images/icon/free/png-256/redis-open-source-logo-data-structure-399889f24f4505b1-256x256.png" title="Redis">
    <img height="64" src="https://camo.githubusercontent.com/e8293376c6ea1d2181eb2fa6f878acd806cf0114/68747470733a2f2f64317136663061656c7830706f722e636c6f756466726f6e742e6e65742f70726f647563742d6c6f676f732f36343464326631352d633564622d343733312d613335332d6163653632333538343166612d72656769737472792e706e67" title="Docker">
    <img height="64" src="https://cdn.iconscout.com/public/images/icon/free/png-128/travis-ci-company-brand-logo-3ea4b6108b6d19db-128x128.png" title="Travis CI">
    <img height="64" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/2000px-GraphQL_Logo.svg.png" title="GraphQL">
</div>


## Setting Up Hifumi

**With Docker** 
1. install [Docker Compose](https://docs.docker.com/compose/install/) if you do not already have it
2. `npm install`
3. copy .env.example to .env
4. `docker-compose up -d`
5. `npm start`

**Without Docker**
1. install [Redis](https://redis.io/topics/quickstart)
2. get redis working on its default port
3. install [Postgres](https://www.postgresql.org/download/)
4. get postgres up and working on its default port
5. `npm install`
6. copy .env.example to .env
7. `npm start`

