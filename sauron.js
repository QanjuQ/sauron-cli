const GithubGraphQLApi = require('node-github-graphql');
const vorpal = require('vorpal')();
const QueryGenerator = require('./query_generator.js');


const github = new GithubGraphQLApi({
    token: process.env.TOKEN
});

const queryGenerator = new QueryGenerator();

const printUserInfo = function (vorpal, userinfo, username) {
    // print user info in particular format
}

vorpal
    .delimiter('==>')
    .show();

vorpal
    .command('userinfo <username>', 'takes a git username as argument and prints the info')
    .action(function (args, callback) {
        let username = args.username;
        let query = queryGenerator.getFetchUserSummaryQuery(username);
        github.query(query, null, (response, err) => {
            let responseData = JSON.stringify(response, null, 2);
            console.log(responseData);
            printUserInfo(vorpal, response.data[username], username);
            callback();
        });
    });