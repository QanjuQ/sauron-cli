const GithubGraphQLApi = require('node-github-graphql');
const vorpal = require('vorpal')();
const QueryGenerator = require('./query_generator.js');
const UserStore = require('./users_store');

let userStore = new UserStore(vorpal);

const github = new GithubGraphQLApi({
    token: process.env.TOKEN
});

const queryGenerator = new QueryGenerator();

const printUserInfo = function (vorpal, userinfo) {
    // print user info in particular format
    vorpal.log(userinfo);
}

vorpal
    .delimiter('==>')
    .show();

vorpal
    .command('userinfo <username> ', 'takes a git username as argument and prints the info')
    .action(function (args, callback) {
        let query = queryGenerator.getFetchUserSummaryQuery(args.username);
        github.query(query, null, (response, err) => {
            let responseData = JSON.stringify(response.data, null, 2);
            printUserInfo(this, responseData);
            callback();
        });
    });

vorpal.command('usersinfo [usernames...]',
        'takes a git usernames as argument and prints the info all users specified')
    .action(function (args, callback) {
        let query = queryGenerator.getFetchUsersSummaryQuery(args.usernames);
        github.query(query, null, (response, err) => {
            let responseData = JSON.stringify(response.data, null, 2);
            printUserInfo(this, responseData);
            callback();
        });
    });

vorpal.command('save <variable>', 'saves output of a command into a variable')
    .action(userStore.saveIntoVariable.bind(userStore));

vorpal.command('get <variable>', 'prints what is stored in variable')
    .validate(userStore.variableExists.bind(userStore))
    .action(userStore.getVariable.bind(userStore));

vorpal.command('storedvariables', 'shows the variable that you stored')
    .action(userStore.getStoredVariables.bind(userStore));