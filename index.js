#!/usr/bin/env node

const chalk = require("chalk"),
clear = require("clear"),
figlet = require("figlet"),
files = require("./lib/files"),
github = require("./lib/github"),
repo = require("./lib/repo");

clear();
console.log(
    chalk.yellow(
        figlet.textSync("Ginit", {horizontalLayout: "full"})
    )
);

if (files.directoryExists(".git")) {
    console.log(chalk.red("Already a git repository"));
    process.exit();
}

const getGithubToken = async () => {
    // Fetch token from configstore
    let token = await github.getStoredGithubToken();
    if(token) {
        return token;
    }

    // No token found, use creds to get new one
    await github.setGithubCredentials();

    // Register new token
    token = await github.registerNewToken();
    return token;
}

const run = async () => {
    try {
        // Retrieve and set auth token
        const token = await getGithubToken();
        github.githubAuth(token);

        // create remote repo
        const url = await repo.createRemoteRepo();
        

        // Create .gitignore
        await repo.createGitIgnore();

        // setup local repo
        const done = await repo.setupRepo(url);
        if (done) {
            console.log(chalk.green("All Done!"));
        }

    } catch (err) {
        if (err) {
            switch (err.code) {
                case 401:
                    console.log(chalk.red("Couldn't log out in, incorrect credentials or token"));
                    break;
                case 422:
                    console.log(chalk.red("There is already a remote repo with that name..."))
                    break;
                default:
                    console.log(chalk.red(err));
            }
        }
    }
}

run();


