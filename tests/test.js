// I know this isn't how testing should be done - but this is my thing so yeah!

const chalk = require("chalk"),
clear = require("clear"),
figlet = require("figlet"),
files = require("../lib/files"),
github = require("../lib/github"),
repo = require("../lib/repo");
inquirer = require("../lib/inquirer")
npm = require("../lib/npm");

const x = async () => {
    let pkgmgr = await npm.initPkgJson({"url": "https://github.com/npm/npm.git"});
    console.log(pkgmgr.pkgmgr)
    npm.installDependencies(pkgmgr.pkgmgr);
}

x()



