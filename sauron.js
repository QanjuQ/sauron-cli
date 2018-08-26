const GithubGraphQLApi = require('node-github-graphql');
const vorpal = require('vorpal')();
const QueryGenerator = require('./query_generator.js');


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
    .command('userinfo <username>', 'takes a git username as argument and prints the info')
    .action(function (args, callback) {
        let query = queryGenerator.getFetchUserSummaryQuery(args.username);
        github.query(query, null, (response, err) => {
            let responseData = JSON.stringify(response.data, null, 2);
            printUserInfo(vorpal, responseData);
            callback();
        });
    });

vorpal.command('usersinfo [usernames...]',
        'takes a git usernames as argument and prints the info all users specified')
    .action(function (args, callback) {
        let query = queryGenerator.getFetchUsersSummaryQuery(args.usernames);
        github.query(query, null, (response, err) => {
            let responseData = JSON.stringify(response.data, null, 2);
            printUserInfo(vorpal, responseData);
            callback();
        });
    });