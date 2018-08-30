const isNotPresent = (languages, language) => {
    return !languages.includes(language);
};

const getLangForRepo = function (langs, repo) {
    if (repo.primaryLanguage) {
        let language = repo.primaryLanguage.name;
        isNotPresent(langs, language) && langs.push(language);
    }
    return langs;
};

const getLatestCommit = function (commit, anotherCommit) {
    let date = commit.date;
    let otherDate = anotherCommit.date;
    if (date && date > otherDate) return commit;
    if (otherDate == undefined) return commit;
    return anotherCommit;
};

const formatCommit = (repo) =>
    (commit) => {
        commit = commit.node;
        commit.repo = repo;
        commit.date = commit.author.date;
        commit.username = commit.author.user && commit.author.user.login;
        commit.name = commit.author.name;
        delete commit.author;
        return commit;
    };

const getRepoCommits = (commits, repo) => {
    let repoCommits = repo.ref && repo.ref.target.history.edges;
    if (repoCommits) {
        repoCommits = repoCommits.map(formatCommit(repo.nameWithOwner));
        commits = commits.concat(repoCommits);
    }
    return commits;
};

const isCommitByUser = (username, name) => {
    return (commit) => {
        let user = commit.user;
        return (user && user.login === username ||
            commit.name === name);
    };
};

const getRequiredUserInfo = function (rawOutput) {
    let repos = rawOutput.repositories.nodes;
    let languages = repos.reduce(getLangForRepo, []);
    let username = rawOutput.login;
    let name = rawOutput.name;
    let allCommits = repos.reduce(getRepoCommits, []);
    let commits = allCommits.filter(isCommitByUser(username, name));
    let latestCommit = commits.reduce(getLatestCommit, {});
    delete latestCommit.name;
    delete latestCommit.username;
    lastestCommit = Object.values(latestCommit).join(' \n- ');
    return [username, name, repos.length,
        languages,
        lastestCommit
    ];
};

module.exports = {
    getRequiredUserInfo: getRequiredUserInfo,
    getLangForRepo: getLangForRepo,
    getLatestCommit: getLatestCommit,
    getRepoCommits: getRepoCommits,
    isCommitByUser: isCommitByUser,
    formatCommit: formatCommit
};