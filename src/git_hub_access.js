const Table = require('cli-table');
const QueryGenerator = require('./query_generator.js');
const getRequiredUserInfo = require('./utils.js').getRequiredUserInfo;

const queryGenerator = new QueryGenerator();
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

class GitHubAccess {
    constructor(githubApi) {
        this.githubApi = githubApi;
    }

    usernamePresent(args, vorpal) {
        if (args.usernames)
            return true;
        return vorpal.chalk.red("username not given");
    }

    fetchDataOfUsers(args, callback, vorpal) {
        let query = queryGenerator.getFetchUsersSummaryQuery(args.usernames);
        this.githubApi.query(query, null, (response, err) => {
            if (err) {
                vorpal.log(JSON.stringify(err, null, 2));
            } else if (args.options.raw) {
                vorpal.log(JSON.stringify(response.data, null, 2));
            } else {
                let usersInfo = Object.values(response.data).map(getRequiredUserInfo);
                let table = createTable();
                table.push.apply(table, usersInfo);
                vorpal.log(table.toString());
            }
            callback();
        });
    }
}

module.exports = GitHubAccess;