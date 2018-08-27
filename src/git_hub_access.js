class GitHubAccess {
    constructor(githubApi) {
        this.githubApi = githubApi;
    }

    fetchData(query, callback, vorpal) {
        this.githubApi.query(query, null, (response, err) => {
            let responseData = JSON.stringify(response.data, null, 2);
            vorpal.log(responseData);
            callback();
        });
    }
}

module.exports = GitHubAccess;