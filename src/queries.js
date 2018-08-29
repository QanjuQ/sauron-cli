const userSummary = `{
    login
    id
    name
    repositories(first: 100) {
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
              history(first: 1, author : {id : AUTHOR_ID}) {
                edges {
                  node {
                    oid
                    message
                    author {
                      date
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