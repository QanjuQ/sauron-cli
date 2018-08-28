const userSummary = `fragment UserSummary on User {
    login
    id
    name
    repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
        totalCount
        nodes {
            nameWithOwner
            description
            primaryLanguage {
                name
            }
            commitComments(last: 1) {
                totalCount
                edges {
                    node {
                        commit {
                            abbreviatedOid
                            message
                            committedDate
                        }
                    }
                }
            }
        }
    }
    repositories(first: 100) {
        totalCount
        nodes {
            nameWithOwner
            description
            primaryLanguage {
                name
            }
            commitComments(last: 1) {
                totalCount
                edges {
                    node {
                        commit {
                            abbreviatedOid
                            message
                            committedDate
                        }
                    }
                }
            }
        }
    }
}`;

exports.userSummary = userSummary;