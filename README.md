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

> A web interface to control an Arma 3 server

<h1>CURRENTLY IN DEVELOPMENT</h1>

## Notes

* Can manage only one instance of server (maybe i will work on multiple instance support)

## Features

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

## Installation
1. Ensure you have NodeJS and Git installed

You can follow the instructions on the NodeJS website to install it : https://nodejs.org<br />
After installation, ensure you have installed build tools.
On Linux you can install it with this command:
```
apt-get install -y build-essential
```
On Windows you have to check a case in the installation program.

For Git, you can also follow the instructions on the Git website : https://git-scm.com/downloads

2. Run styx-install NPX script to install Styx

Create a directory named "styx" where you want on your system.<br/>Now in the newly created directory type this command:
```
npx https://www.github.com/Nealll68/styx-install
```
This script will clone this repository, install packages, create needed files and build the application for you.

3. Update Styx

To update Styx, go in the styx folder and type this command:
```
npx https://www.github.com/Nealll68/styx-install --update
```
This script will pulled this repository, check for newly packages or update it and rebuild the application for you.


## Author

👤 **Nealll**

* Website: [nealll.dev](https://nealll.dev)
* Twitter: [@Nealll68](https://twitter.com/Nealll68)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Nealll68/styx/issues). 

## 📝 License

Copyright © 2020 [Nealll](https://github.com/Nealll68).<br />
This project is [MIT](https://github.com/Nealll68/styx/blob/master/LICENCE) licensed.

## Thanks to the CP17 Team for testing and feedback