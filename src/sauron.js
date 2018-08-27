const GithubGraphQLApi = require('node-github-graphql');
const vorpal = require('vorpal')();
const QueryGenerator = require('./query_generator.js');
const chalk = vorpal.chalk;

let userStore = {};

const github = new GithubGraphQLApi({
    token: process.env.TOKEN
});

const queryGenerator = new QueryGenerator();

const printUserInfo = function (vorpal, userinfo) {
    // print user info in particular format
    vorpal.log(userinfo);
}

const variableExists = (args) => {
    let variableName = args.variable;
    let variableNames = Object.keys(userStore);
    if (variableNames.includes(variableName))
        return true;
    return chalk.red(`You do not have the variable ${variableName}`);

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
    .action(function (args, callback) {
        userStore[args.variable] = args.stdin || '';
        vorpal.log(`output stored in '${args.variable}'`);
        callback();
    });


vorpal.command('get <variable>', 'prints what is stored in variable')
    .validate(variableExists)
    .action(function (args, callback) {
        vorpal.log(userStore[args.variable].toString());
        callback();
    });

vorpal.command('storedvariables', 'shows the variable that you stored')
    .action(function (args, callback) {
        vorpal.log("VariableStored are: \n->" +
            Object.keys(userStore).join('\n->  '));
        callback();
    });