const GithubGraphQLApi = require('node-github-graphql');
const vorpal = require('vorpal')();

const collaborator = require('./collaborator.js');
const UserStore = require('./users_store');
const GitHubAccess = require('./git_hub_access.js');


const githubApi = new GithubGraphQLApi({
    token: process.env.GIT_API_TOKEN
});

const userStore = new UserStore(vorpal);
const gitHubAccess = new GitHubAccess(githubApi);


vorpal
    .delimiter('==>')
    .show();

vorpal.history("sauron");

vorpal.command('userinfo [usernames...]',
        'takes git usernames as argument and prints info of all users specified')
    .option('-r ,--raw', "prints the rawoutput on console")
    .alias("u")
    .validate((args) => gitHubAccess.usernamePresent(args, vorpal))
    .action(function (args, callback) {
        gitHubAccess.fetchDataOfUsers(args, callback, this);
    });

vorpal.command('save <variable>', 'saves output of a command into a variable')
    .action(userStore.saveIntoVariable.bind(userStore));

vorpal.command('show <variable>', 'prints what is stored in variable')
    .validate(userStore.variableExists.bind(userStore))
    .action(userStore.getVariable.bind(userStore));

vorpal.command('storedvariables', 'shows the variable that you stored')
    .alias("savedv")
    .action(userStore.getStoredVariables.bind(userStore));

vorpal.command('addcollaborator [org] [repo] [collab]', 'add a collaborator and sends him a invitation')
    .option('-o', '--org', "option to provide owner or organisation")
    .option('-r', '--repo', "option to provide repository")
    .option('-c', '--collab', "option to provide collab")
    .alias('addc')
    .validate(collaborator.validateArgsArePresent.bind(vorpal))
    .action(collaborator.addCollaborator);

vorpal.command('removecollaborator [org] [repo] [collab]', 'removes a collaborator')
    .option('-o', '--org', "option to provide owner or organisation")
    .option('-r', '--repo', "option to provide repository")
    .option('-c', '--collab', "option to provide collab")
    .alias("remc")
    .validate(collaborator.validateArgsArePresent.bind(vorpal))
    .action(collaborator.removeCollaborator);