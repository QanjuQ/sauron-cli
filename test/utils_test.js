const utils = require('../src/utils.js');
const assert = require('assert');


describe('Utils', function () {
    describe('getLatestCommit', function () {
        it('should return the commit that was recently committed', function () {
            let firstCommit = {
                msg: "first commit",
                date: "2018-08-30T18:20:19+05:30"
            };
            let recentCommit = {
                msg: "initial commit",
                date: "2018-08-30T18:41:23+05:30"
            }
            let actual = utils.getLatestCommit(firstCommit, recentCommit);
            assert.deepEqual(recentCommit, actual);
        });
        it('should return the commit is defined when one of commit is undefined', function () {
            let commit = {
                msg: "first commit",
                date: "2018-08-30T18:20:19+05:30"
            };
            assert.deepEqual(utils.getLatestCommit({}, commit), commit);
            assert.deepEqual(utils.getLatestCommit(commit, {}), commit);
        });
    });

    describe('formatCommit', function () {
        let input, expected;
        beforeEach(() => {
            input = {
                node: {
                    "oid": "da795cd4d4ea4d782e73533537e949220aa7f3b8",
                    "message": "initial commit",
                    "author": {
                        "name": "Anjum",
                        "date": "2018-08-29T21:00:41+05:30",
                        "user": {
                            "login": "QanjuQ"
                        }
                    },
                    "repo": "QanjuQ/fortest"
                }
            };
            expected = {
                "username": "QanjuQ",
                "name": "Anjum",
                "oid": "da795cd4d4ea4d782e73533537e949220aa7f3b8",
                "message": "initial commit",
                "date": "2018-08-29T21:00:41+05:30",
                "repo": "QanjuQ/fortest"
            };
        });
        it('should return the commit in particular format having repo name', function () {
            const formatCommit = utils.formatCommit("QanjuQ/fortest");
            assert.deepEqual(formatCommit(input), expected);

        });

        it('should not fail when user is null in commit', function () {
            input.node.author.user = null;
            expected.username = undefined;
            const formatCommit = utils.formatCommit("QanjuQ/fortest");
            assert.deepEqual(formatCommit(input), expected);
        });
    });

    describe('getRepoCommits', () => {
        it('should returns list of commits of the repo in formatted way', () => {
            let repo = {
                "nameWithOwner": "QanjuQ/fortest",
                "ref": {
                    "target": {
                        "history": {
                            "edges": [{
                                "node": {
                                    "oid": "b65e188799a28deec4fc32a0d78b4b461e4b4792",
                                    "message": "just committing for test sauron cli",
                                    "author": {
                                        "name": "Anjum",
                                        "date": "2018-08-30T18:41:23+05:30",
                                        "user": {
                                            "login": "QanjuQ"
                                        }
                                    }
                                }
                            }]
                        }
                    }
                }
            };
            let expected = [{
                "username": "QanjuQ",
                "name": "Anjum",
                "oid": "b65e188799a28deec4fc32a0d78b4b461e4b4792",
                "message": "just committing for test sauron cli",
                "date": "2018-08-30T18:41:23+05:30",
                "repo": "QanjuQ/fortest"
            }];
            assert.deepEqual(utils.getRepoCommits([], repo), expected);
            assert.deepEqual(utils.getRepoCommits([], {
                ref: null
            }), []);
        });
    });
});