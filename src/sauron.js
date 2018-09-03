const GithubGraphQLApi = require('node-github-graphql');
const vorpal = require('vorpal')();

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

vorpal.command('userinfo [usernames...]',
        'takes git usernames as argument and prints info of all users specified')
    .option('-r ,--raw', "prints the rawoutput on console")
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
    .action(userStore.getStoredVariables.bind(userStore));