const   _           = require('lodash'),
        fs          = require('fs'),
        git         = require('simple-git')(),
        CLI         = require('clui'),
        Spinner     = CLI.Spinner,
        inquirer    = require('./inquirer'),
        gh          = require('./github'),
        touch       = require("touch")

module.exports = {
    createRemoteRepo: async () => {
        
        const github = gh.getInstance();
        const answers = await inquirer.askRepoDetails();
        

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === "private")
        };

        const status = new Spinner("Creating repo, hold on...")
        status.start();

        try {
            const response = await github.repos.create(data);
            return {url: response.data.ssh_url, name: answers.name, description: answers.description};

        } catch (err) {
            console.log(err)
            throw err;
        } finally {
            status.stop();
            
        }

    },
    createEntryFile: async (details) => {
        if (fs.existsSync("./" + details.entryFile)) {
            let fileData = "// Autgenerated File by Ginit - The solution to all your git init/npm init/yarn init needs"
            await fs.writeFileSync("./" + details.entryFile, fileData)
        }
        
    },
    createReadMe: async (details) => {
        if (fs.existsSync("./README.md")) {
            let readMeText = "#" + details.name + "\n*" + details.description + "*";
            await fs.writeFileSync("./README.md", readMeText)
        }

    },
    createGitIgnore: async () => {
        const filelist = _.without(fs.readdirSync("."), ".git", ".gitignore");

        if (filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist);
            if (answers.ignore.length) {
                fs.writeFileSync(".gitignore", answers.ignore.join('\n'));

            } else {
                touch(".gitignore")
            }
        } else {
            touch(".gitignore");
        }
    },

    setupRepo: async (url) => {
        const status = new Spinner("initalising local repo and pushing to remote");
        status.start();

        try {
            await git
                .init()
                .add("./.gitignore")
                .add("./*")
                .commit("Inital Commit")
                .addRemote('origin', url)
                .push('origin', 'master');
            return true
        } catch (err) {
            throw err;

        } finally {
            status.stop();
        }
    }
}