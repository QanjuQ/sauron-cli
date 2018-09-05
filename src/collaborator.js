const http = require('https');
const Table = require('cli-table');
const token = process.env.GIT_API_TOKEN;

const chars = {
    'top': '═',
    'top-mid': '╤',
    'top-left': '╔',
    'top-right': '╗',
    'bottom': '═',
    'bottom-mid': '╧',
    'bottom-left': '╚',
    'bottom-right': '╝',
    'left': '║',
    'left-mid': '╟',
    'mid': '─',
    'mid-mid': '┼',
    'right': '║',
    'right-mid': '╢',
    'middle': '│'
};

const statusCodes = {
    204: (res, content) => {
        return content;
    },

    404: () => {
        return "you do not have admin priveleges for this repository";
    },

    201: (res) => {
        let table = new Table({
            chars: chars,
            head: ['Id', 'Repository', 'Invitee', 'Inviter', 'Permission', 'Date'],
            colWidths: [10, 25, 25, 25, 10, 25]
        });
        let invitation = JSON.parse(res.data);
        let row = [
            invitation.id, invitation.repository.full_name,
            invitation.invitee.login, invitation.inviter.login,
            invitation.permissions, invitation.created_at
        ];
        table.push(row);
        return table.toString();
    }
};

const printOuput = function (vorpal, res, callback) {
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
        res.data = data;
        let output = statusCodes[res.statusCode](res, res.message);
        vorpal.log(output);
        callback();
    });
};

const request = function (message, options, callback) {
    let vorpal = this;
    let req = http.request(options, (res) => {
        res.message = message;
        printOuput(vorpal, res, callback);
    });
    req.on('error', (e) => {
        vorpal.log(`problem with request: ${e.message}`);
    });
    req.end();
};

const options = {
    host: 'api.github.com',
    headers: {
        "User-Agent": "curl/7.54.0",
        "Accept": "*/*",
        "Content-Length": 0,
        "Authorization": "bearer " + token
    }
};

const validateArgsArePresent = function (args) {
    let options = args.options;
    let areOptionsPresent = options.org && options.repo && options.collab;
    let areArgumentsPresent = args.org && args.repo && args.collab;
    if (areArgumentsPresent) {
        return true;
    }
    if (areOptionsPresent) {
        args = options;
        return true;
    }
    return this.chalk.red("pass all the options\n type help or [command --help] ");
};

const addCollaborator = function (args, callback) {
    options.method = 'PUT';
    args.collab.forEach(collab => {
        options.path = `/repos/${args.org}/${args.repo}/collaborators/${collab}`;
        const message = `${collab} is already a collaborator on ${args.repo}`;
        request.call(this, message, options, callback);
    });
};

const removeCollaborator = function (args, callback) {
    options.method = 'DELETE';
    args.collab.forEach(collab => {
        options.path = `/repos/${args.org}/${args.repo}/collaborators/${collab}`;
        const message = `${collab} removed from ${args.repo} as collaborator`;
        request.call(this, message, options, callback);
    });
}

module.exports = {
    addCollaborator: addCollaborator,
    removeCollaborator: removeCollaborator,
    validateArgsArePresent: validateArgsArePresent
};