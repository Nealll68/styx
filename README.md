<h1 align="center">Styx</h1>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/Nealll68/styx/blob/master/LICENCE" target="_blank" rel="noopener noreferrer">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/Nealll68" target="_blank" rel="noopener noreferrer">
    <img alt="Twitter: Nealll68" src="https://img.shields.io/twitter/follow/Nealll68.svg?style=social" />
  </a>
</p>

> A modern web interface to control an Arma 3 server

## The installation is not for simple user, you need a little experience in server management

# Notes

* Can manage only one instance of server (maybe i will work on multiple instance support)
* SteamCMD need to be already installed on the server

# Features

* Work on windows & linux
* Full Steam Workshop support
  * Steam Guard
  * Download addon with SteamCMD and use symlink from steam folder to Arma 3 folder
  * Download mission without SteamCMD (use Steam Web API) and store in MPMissions folder
* Update game
* Multiple profiles support (easy switch between profile)
* Manage addons with a beautiful interface (no more -mod=)
* Change startup parameters, edit configuration or difficulty and more with ease
* Create different account with different permission for your teammates
* English and french translations

# Installation
## Prerequisites
### Ensure you have NodeJS and Git installed

You can follow the instructions on the NodeJS website to install it : https://nodejs.org<br />
After installation, ensure you have installed build tools.
On Linux you can install it with this command:
```
$ apt-get install -y build-essential
```
On Windows you have to check a case in the installation program.

For Git, you can also follow the instructions on the Git website : https://git-scm.com/downloads

## Install Styx

**1. Run styx-install NPX script to install Styx**

Create a directory named "styx" where you want on your system.<br/>Now in the newly created directory type this command:
```
$ npx https://www.github.com/Nealll68/styx-install
```
This script will clone this repository, install packages, create needed files and build the application for you.
<br/>**Note**: if you want to use Yarn instead of NPM for packages, use flag : --yarn

To update Styx, go in the styx folder and type this command:
```
$ npx https://www.github.com/Nealll68/styx-install --update
```

**2. Configure Styx**

Before running the application you will need to update some variables in the **.env** file.
<br/>Here are the description of the different variables you can edit :
Name | Description
---- | -----------
HOST | IP of the host. Generally you don't need to edit this.
PORT | The port where the app will listen.
WS_URL | The URL for websocket. Use your IP or domain name, like : ws://YOUR_IP or ws://your-domain.com. If you use HTTPS, use wss:// instead of ws://
API_URL | The URL for the API. Generally you don't need to edit this.

**3. Launch Styx**

To launch Styx, in the styx folder you need to run this command:
```
$ npm run start
# or
$ yarn start
```
Now the interface is serving on the port 3000.

**4. Serve the application**

To make Styx accessible from outside you will need to open some ports and redirect some traffic. For that I recommend to follow these tutorials:<br/>

* For Linux (Debian based system):

**You can skip Step 2 and replace all hello.js with server.js in commands**<br/>
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-10#step-1-—-installing-nodejs

* For Windows server:

I lost several hairs to install my application on Windows server, so i really recommend you Linux. But if you want to install it on windows, check this tutorial:<br/>
https://dev.to/massivebrains/deploying-node-express-app-on-a-windows-server-2l5c

# Author

👤 **Nealll**

* Website: [nealll.dev](https://nealll.dev)
* Twitter: [@Nealll68](https://twitter.com/Nealll68)

# 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Nealll68/styx/issues). 

# 📝 License

Copyright © 2020 [Nealll](https://github.com/Nealll68).<br />
This project is [MIT](https://github.com/Nealll68/styx/blob/master/LICENCE) licensed.

### Thanks to the CP17 Team for testing and feedback