const userSummaryFragment = `fragment userSummary on User{
    login
    id
    name
    repositories(last: 100) {
      totalCount
      nodes {
        nameWithOwner
        description
        primaryLanguage {
          name
        }
        ref(qualifiedName: "master") {
          target {
            ... on Commit {
              id
              history(first: 100) {
                edges {
                  node {
                    oid
                    message
                    author {
                      name
                      date
                      user{login}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;


const getFetchUsersSummaryQuery = function (usernames) {
    let query = 'query {';
    query = usernames.reduce((currQuery, username, index) => {
        return `${currQuery} user${index+1}: user(login: "${username}") {...userSummary}`;
    }, query);
    return query + "}" + userSummaryFragment;
}


module.exports = getFetchUsersSummaryQuery;