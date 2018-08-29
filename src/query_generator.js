const userSummaryFrag = require("./queries.js").userSummary;

class QueryGenerator {
    constructor() {}

    getFetchUsersSummaryQuery(usernames, ids) {
        let query = 'query {';
        query = usernames.reduce((currQuery, username, index) => {
            // let userSummary = userSummaryFrag.replace("AUTHOR_ID", ids[index])
            //     .replace("AUTHOR_ID", ids[index]);
            return `${currQuery} user${index+1}: user(login: "${username}") {...userSummary}`;
        }, query);
        return query + "}" + userSummaryFrag;
    }

    getUserIdsQuery(usernames) {
        let query = 'query {';
        query = usernames.reduce((currQuery, username, index) => {
            return `${currQuery} user${index+1}: user(login: "${username}") { ...UserId}`;
        }, query);
        return query + "}" + "fragment UserId on User{id}";
    }
}

module.exports = QueryGenerator;