const inquirer  = require("inquirer")
const files     = require("./files");
const stacks    = require("./stacks.json")

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
    },
    askUsePkgMgr: () => {
        const questions = [
            {
                type: "list",
                name: "pkgmgr",
                message: "Select the package manager you would like to use",
                choices: ["None", "NPM", "Yarn"],
                default: "NPM"
            }
        ]
        return inquirer.prompt(questions)
    },
    checkInitPkgMgr: () => {
        return inquirer.prompt([{
            type: "confirm",
            name: "answer",
            message: "There is already a package.json file, do you wish to overrite it?",
            default: false
        }])
    },
    askPkgJsonDetails: (askNameAndDescription) => {
        let questions = []
        if (askNameAndDescription) {
            questions.push({
                type: "input",
                name: "name",
                message: "Enter a name for the new repo",
                default:  files.getCurrentDirectoryBase(),
                validate: (value) => {
                    return value.length? true : "Please enter a name for the repository";
                } 
            },
            {
                type: "input",
                name: "description",
                defaut:  null,
                message: 'Enter a description for the repo'
            })
        }
        questions.push(
            {
                type: "input",
                name: "version",
                message: "Enter the version number of your project",
                default: "1.0.0",
                validate: (value) => {
                    if (value.length) {
                        regex = new RegExp("[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}")
                        if (regex.test(value)) {
                             return true; 
                            } else { return "Please make sure the value matches semantic versioning"}
                    } else {
                        return true
                    }
                    
                }
            },
            {
                type: "input",
                name: "main",
                message: "What is the start/index file",
                default: "index.js",
                validate: (value) => {
                    return value.length? true : false
                }
            },
            {
                type: "input",
                name: "author",
                message: "Author name: "

            },
            {
                type: "input",
                name: "license",
                message: "Licence type?",
                default: "ISC"
            }, 


        )
        return inquirer.prompt(questions);
    },
    askDependenciesToInstall: () => {
        const questions = [
            {
                type: "checkbox",
                name: "stacks",
                message: "Select the stacks you wish to install",
                choices: Object.keys(stacks.stacks)
            }
        ]
        return inquirer.prompt(questions)
    }
}