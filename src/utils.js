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
                commit.node.date = commit.node.author.date;
                delete commit.node.author;
                console.log(commit.node);
                return commit.node;
            };
            let repoCommits = repo.ref.target.history.edges;
            if (repoCommits.length) {
                commits = commits.concat(repoCommits.map(formatCommit));
            }
            return commits;
        }, []);
};

const getRequiredUserInfo = function (rawOutput) {
    let repos = rawOutput.repositories.nodes;
    let languages = repos.reduce(getLangForRepo, []);
    let commits = getAllCommits(repos);
    let latestCommit = commits.reduce(getLatestCommit, {});
    lastestCommit = Object.values(latestCommit).join(' \n- ');
    return [rawOutput.login, rawOutput.name, repos.length,
        languages,
        lastestCommit
    ];
};

module.exports = getRequiredUserInfo;