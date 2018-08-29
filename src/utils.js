const getLangForRepo = function (langs, repo) {
    if (repo.primaryLanguage && !langs.includes(repo.primaryLanguage.name)) {
        langs.push(repo.primaryLanguage.name);
    }
    return langs;
};

const getLatestCommit = function (commit, anotherCommit) {
    if (commit.date > anotherCommit.date) {
        return commit;
    }
    return anotherCommit;
};

const getAllCommits = function (repos) {
    return repos.reduce(
        (commits, repo) => {
            const formatCommit = (commit) => {
                commit.node.repo = repo.nameWithOwner;
                console.log(commit.node);
                return commit.node;
            };
            let repoCommits = repo.ref && repo.ref.target.history.edges;
            if (repoCommits) {
                commits = commits.concat(repoCommits.map(formatCommit));
            }
            return commits;
        }, []);
};

const getCommitsByUser = (commits, username, name) => {
    let commitsByUser = [];
    commits.forEach((commit) => {
        // console.log(commit);
        let user = commit.author.user;
        if (user && user.login === username ||
            commit.author.name === name)
            commitsByUser.push(commit);
    });
    return commitsByUser;

};

const getRequiredUserInfo = function (rawOutput) {
    let repos = rawOutput.repositories.nodes;
    let languages = repos.reduce(getLangForRepo, []);
    // console.log(JSON.stringify(repos, null, 2));
    let username = rawOutput.login;
    let name = rawOutput.name;
    let commits = getCommitsByUser(getAllCommits(repos), username, name);
    console.log(JSON.stringify(getAllCommits(repos), null, 2));
    // let commits = getAllCommits(repos).filter(isCommitedByUser(username, name));
    let latestCommit = commits.reduce(getLatestCommit, {});
    lastestCommit = Object.values(latestCommit).join(' \n- ');
    return [username, name, repos.length,
        languages,
        lastestCommit
    ];
};

module.exports = getRequiredUserInfo;