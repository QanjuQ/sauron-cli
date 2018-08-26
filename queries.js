const userSummary = `fragment UserSummary on User {
    id
    repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
        totalCount
        nodes {
            nameWithOwner
            description
            primaryLanguage {
                name
            }
            commitComments {
                totalCount
            }
        }
    }
}`;

exports.userSummary = userSummary;