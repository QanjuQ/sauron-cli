const userSummaryFrag = require("./queries.js");

class QueryGenerator {
    constructor() {}

    getFetchUsersSummaryQuery(usernames) {
        let query = 'query {';
        query = usernames.reduce((currQuery, username, index) => {
            return `${currQuery} user${index+1}: user(login: "${username}") {...userSummary}`;
        }, query);
        return query + "}" + userSummaryFrag;
    }
}

module.exports = QueryGenerator;