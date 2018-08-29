const Table = require('cli-table');
const getRequiredUserInfo = require('./utils.js');

const chars = {
    'top': '═',
    'top-mid': '╤',
    'top-left': '╔',
    'top-right': '╗',
    'bottom': '═',
    'bottom-mid': '╧',
    'bottom-left': '╚',
    'bottom-right': '╝',
    'left': '║',
    'left-mid': '╟',
    'mid': '─',
    'mid-mid': '┼',
    'right': '║',
    'right-mid': '╢',
    'middle': '│'
};

const createTable = function () {
    return new Table({
        chars: chars,
        head: ['GIT-Name', 'NAME', 'REPOS[#]', 'LANGUAGES COMMITTED TO', 'LAST COMMIT'],
        colWidths: [15, 30, 8, 35, 35]
    });
};

// const QueryGenerator = require('./query_generator.js');
// const queryGenerator = new QueryGenerator();

class GitHubAccess {
    constructor(githubApi) {
        this.githubApi = githubApi;
    }

    // fetchGitIdsOfUsers(args, query, callback, vorpal) {
    //     let githubAccess = this;
    //     this.githubApi.query(query, null, (response, err) => {
    //         let userIds = Object.values(response.data).map((user) => user.id);
    //         let query1 = queryGenerator.getFetchUsersSummaryQuery(args.usernames, userIds);
    //         githubAccess.fetchDataOfUsers(query1, callback, vorpal);
    //     });
    // }

    fetchDataOfUsers(query, callback, vorpal) {
        this.githubApi.query(query, null, (response, err) => {
            if (err) {
                vorpal.log(JSON.stringify(err, null, 2));
            } else {
                let usersInfo = Object.values(response.data).map(getRequiredUserInfo);
                let table = createTable();
                usersInfo.forEach((userinfo) => table.push(userinfo));
                vorpal.log(table.toString());
            }
            callback();
        });
    }
}

module.exports = GitHubAccess;