const userSummaryFrag = require("./queries.js").userSummary;

class QueryGenerator {
    constructor() {}

    getFetchUsersSummaryQuery(usernames, ids) {
        let query = 'query {';
        query = usernames.reduce((currQuery, username, index) => {
            return `${currQuery} user${index+1}: user(login: "${username}") {...userSummary}`;
        }, query);
        return query + "}" + userSummaryFrag;
    }
}

module.exports = QueryGenerator;