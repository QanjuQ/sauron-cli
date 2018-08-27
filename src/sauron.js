const GithubGraphQLApi = require('node-github-graphql');
const vorpal = require('vorpal')();

const QueryGenerator = require('./query_generator.js');
const UserStore = require('./users_store');
const GitHubAccess = require('./git_hub_access.js');


const githubApi = new GithubGraphQLApi({
    token: process.env.TOKEN
});

const queryGenerator = new QueryGenerator();
const userStore = new UserStore(vorpal);
const gitHubAccess = new GitHubAccess(githubApi);


vorpal
    .delimiter('==>')
    .show();

vorpal
    .command('userinfo <username> ', 'takes a git username as argument and prints the info')
    .action(function (args, callback) {
        let query = queryGenerator.getFetchUserSummaryQuery(args.username);
        gitHubAccess.fetchData(query, callback, this);
    });

vorpal.command('usersinfo [usernames...]',
        'takes a git usernames as argument and prints the info all users specified')
    .action(function (args, callback) {
        let query = queryGenerator.getFetchUsersSummaryQuery(args.usernames);
        gitHubAccess.fetchData(query, callback, this);
    });


vorpal.command('save <variable>', 'saves output of a command into a variable')
    .action(userStore.saveIntoVariable.bind(userStore));

vorpal.command('get <variable>', 'prints what is stored in variable')
    .validate(userStore.variableExists.bind(userStore))
    .action(userStore.getVariable.bind(userStore));

vorpal.command('storedvariables', 'shows the variable that you stored')
    .action(userStore.getStoredVariables.bind(userStore));

vorpal.command('print', 'print print')
    .action(function (args, callback) {
        this.log("hello");
        callback();
    });