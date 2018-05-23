const inquirer  = require("inquirer")
const files     = require("./files");

module.exports = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: "username",
                type: "input",
                message: "Enter your Github username or e-mail address",
                validate: (value) => {
                    return value.length? true : "Please enter your username or email address";
                } 
            },
            {
                name: "password",
                type: "password",
                message: "Enter your password",
                validate: (value) => {
                    return value.length? true : "Please enter your password";
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));
        
        const questions = [
            {
                type: "input",
                name: "name",
                message: "Enter a name for the new repo",
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: (value) => {
                    return value.length? true : "Please enter a name for the repository";
                } 
            },
            {
                type: "input",
                name: "description",
                defaut: argv._[1] || null,
                message: 'Enter a description for the repo(optional)'
            },
            {
                type: "list",
                name: "visibility",
                message: "Public or private repo?",
                choices: ["public", "private"],
                default: "public"
            }
        ];
        
        return inquirer.prompt(questions)
    },

    askIgnoreFiles: (filelist) => {
        const questions = [
            {
                type: "checkbox",
                name: "ignore",
                message: "select the files and/or folders you want to ignore",
                choices: filelist,
                default: ['node_modules', 'bower_components']
            }
        ];
        return inquirer.prompt(questions);
    }
}