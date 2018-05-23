const   octokit     = require("@octokit/rest")(),
        Configstore = require("configstore")
        pkg         = require("../package.json");
        _           = require("lodash");
        CLI         = require("clui"),
        Spinner     = CLI.Spinner,
        chalk       = require("chalk"),
        inquirer    = require("./inquirer");


const conf = new Configstore(pkg.name);

module.exports = {
    getInstance: () => {
        return octokit;
    },

    getStoredGithubToken: async () => {
        return await conf.get('github.token');
    },

    setGithubCredentials: async () => {
        const credentials = await inquirer.askGithubCredentials();
        octokit.authenticate(
            _.extend(
                {
                    type: 'basic',
                },
                credentials
            )
        );
    },

    registerNewToken: async () => {
        const status = new Spinner("ginit is authenticating you with Github. please wait...")
        status.start();

        try {
            const response = await octokit.authorization.create({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginits, the commands-line tool for initialising Git repos'
            });

            const token = response.data.token;
            if (token) {
                conf.set('github.token', token);
                return token;

            } else {
                throw new Error("Missing Token", "GitHub token was not found in the response");
            }

        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },
    
    githubAuth: (token) => {
        octokit.authenticate({
            type: "oauth",
            token: token
        });

    },

    getStoredGithubToken: async () => {
        return await conf.get('github.token')
    }

}