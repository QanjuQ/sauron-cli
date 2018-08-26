const userSummaryFrag = require("./queries.js").userSummary;

class QueryGenerator {
    constructor() {

    }
    getFetchUserSummaryQuery(username) {
        return `query fetch {
            ${username}:user(login: "${username}") {
                ...UserSummary
            }
        } ${userSummaryFrag}`;
    }

}

module.exports = QueryGenerator;