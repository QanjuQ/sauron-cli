const getLangForRepo = function (langs, repo) {
    if (repo.primaryLanguage && !langs.includes(repo.primaryLanguage.name)) {
        langs.push(repo.primaryLanguage.name);
    }
    return langs;
};

const getLatestCommit = function (commit, anotherCommit) {
    if (commit.committedDate > anotherCommit.committedDate) {
        return commit;
    }
    return anotherCommit;
};

const getLangsAndCommit = function (langAndCommit, repo) {
    langAndCommit.langs = getLangForRepo(langAndCommit.langs, repo);
    if (repo.commitComments && repo.commitComments.totalCount) {
        let commit = repo.commitComments.edges[0].node.commit;
        commit.repo = repo.nameWithOwner;
        langAndCommit.commit = getLatestCommit(langAndCommit.commit, commit);
    }
    return langAndCommit;
};

const getRequiredUserInfo = function (rawOutput) {
    let commitAndLangs = {
        commit: {},
        langs: []
    };
    commitAndLangs = rawOutput.repositories.nodes.reduce(getLangsAndCommit, commitAndLangs);
    let lastCommit = Object.values(commitAndLangs.commit).join(' \n- ');
    return [rawOutput.login, rawOutput.name,
        rawOutput.repositories.totalCount,
        commitAndLangs.langs,
        lastCommit
    ];
};

module.exports = getRequiredUserInfo;