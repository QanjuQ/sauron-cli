const userSummaryFrag = require("./queries.js").userSummary;

class QueryGenerator {
    constructor() {

    }
    getFetchUserSummaryQuery(username) {
        console.log(`query {
            user(login: "${username}") {
                ...UserSummary
            }}`);
        return `query {
            user(login: "${username}") {
                ...UserSummary
            }
        } ${userSummaryFrag}`;
    }


    getFetchUsersSummaryQuery(usernames) {
        let query = 'query {';
        query = usernames.reduce((currQuery, username, index) => {
            return `${currQuery} user${index+1}: user(login: "${username}") { ...UserSummary}`;
        }, query);
        return query + "}" + userSummaryFrag;
    }

}

module.exports = QueryGenerator;