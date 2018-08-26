const userSummaryFrag = require("./queries.js").userSummary;

class QueryGenerator {
    constructor() {

    }
    getFetchUserSummaryQuery(username) {
        return `query {
            user(login: ${username}) {
                ...UserSummary
            }
        } ${userSummaryFrag}`;
    }


    getFetchUsersSummaryQuery(usernames) {
        let query = 'query {';
        query = usernames.reduce((currQuery, username) => {
            return currQuery + `${username}: user(login: "${username}") { ...UserSummary}`;
        }, query);

        return query + "}" + userSummaryFrag;
    }

}

module.exports = QueryGenerator;