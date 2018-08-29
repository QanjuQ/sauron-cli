const userSummary = `fragment userSummary on User{
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
exports.userSummary = userSummary;