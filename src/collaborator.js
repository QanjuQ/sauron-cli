const http = require('https');
const fs = require('fs');
const token = process.env.GIT_API_TOKEN;

const toString = (data) => (JSON.stringify(data, null, 2));

const request = function (options, data, callback) {
    let vorpal = this;
    let req = http.request(options, (res) => {
        printResponse(vorpal, res, callback);
    });
    req.on('error', (e) => {
        vorpal.log(`problem with request: ${e.message}`);
    });
    req.write(toString(data));
    req.end();
};

const options = {
    host: 'api.github.com',
    headers: {
        "User-Agent": "curl/7.54.0",
        "Accept": "*/*",
        "Authorization": "bearer " + token
    }
};

const printResponse = (vorpal, res, callback) => {
    vorpal.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
    res.setEncoding('utf8');
    let data = "";
    res.on('data', (chunk) => (data += toString(chunk)));
    res.on('end', () => {
        vorpal.log(data);
        callback();
    });
};

const addCollaborator = function (args, callback) {
    options.method = 'PUT';
    options.path = `/repos/${args.owner}/${args.repo}/collaborators/${args.collaborator}`;
    const data = {
        "permission": "push"
    };
    request.call(this, options, data, callback);
};

const removeCollaborator = function (args, callback) {
    options.method = 'DELETE';
    options.path = `/repos/${args.owner}/${args.repo}/collaborators/${args.collaborator}`;
    const data = {
        "permission": "pull"
    };

    request.call(this, options, data, callback);
}

module.exports = {
    addCollaborator: addCollaborator,
    removeCollaborator: removeCollaborator
};