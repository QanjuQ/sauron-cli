const userSummary = `fragment UserSummary on User {
    login
    id
    name
    repositories(first:100){
        totalCount
        nodes {
            nameWithOwner
            description
            primaryLanguage {
                name
            }
            commitComments (last:1) {
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