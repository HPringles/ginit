const   npm         = require("npm-programmatic"),
        yarn        = require("yarn-programmatic")
        fs          = require("fs")
        inquirer    = require("./inquirer"),
        files    = require("./files"),
        stacks      = require("./stacks.json"),
        CLI         = require('clui'),
        Spinner     = CLI.Spinner,
        chalk       = require("chalk");

module.exports = {
    initPkgJson: async (repoDetails={}) => {
        let answerspkg =  await inquirer.askUsePkgMgr();
        if (answerspkg.pkgmgr === "None") {
            return true;
        } else {
            
            if (fs.existsSync("./package.json")) {
                console.log("woo")
                answer = await inquirer.checkInitPkgMgr()
                if (!answer.answer) {
                    console.log(chalk.yellow.bgRed("WARN:") + chalk.yellow(" Continuing to Github repo push instead"))
                    return false
                }
            }


            jsonData = await inquirer.askPkgJsonDetails((repoDetails.name )? false : true);
            if (repoDetails.name && !jsonData.name) {
                jsonData.name = repoDetails.name
                
            }
            if (repoDetails.description && !jsonData.name) {
                jsonData.description = repoDetails.description
            }
            jsonData.repository = {
                type : "git",
                url : repoDetails.url
            }
            jsonData.dependencies = {}
            await fs.writeFileSync("./package.json", JSON.stringify(jsonData, null, '  '))
            return {pkgmgr: answerspkg.pkgmgr, entryFile: jsonData.main}
        }
    },
    installDependencies: async (pkgmgr) => {

        const installer = {
            "NPM": npm.install,
            "Yarn": yarn.add
        }
        if (pkgmgr === "NPM" || pkgmgr === "Yarn") {
            const stackList = await inquirer.askDependenciesToInstall()
            const status = new Spinner("Installing dependencies")
        status.start();
            let deps = []
            for (i in stackList.stacks) {
                
                for (x in stacks.stacks[stackList.stacks[i]]) {
                    deps.push(stacks.stacks[stackList.stacks[i]][x])
                }
            }
            
            await installer[pkgmgr](deps, {
                cwd: "./",
                save: true
            }).then(() => {
                console.log(chalk.green("Installed deps"))
            }).catch((e) => {
                console.log(chalk.red("Error installing deps"))
                console.log(e)
            })
            status.stop()
        }
    }
}