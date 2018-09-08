const http = require('https');
const Table = require('cli-table');
const token = process.env.GIT_API_TOKEN;
const chars = require('./utils.js').chars;

const options = {
    host: 'api.github.com',
    headers: {
        "User-Agent": "curl/7.54.0",
        "Accept": "*/*",
        "Content-Length": 0,
        "Authorization": "bearer " + token
    }
};

let messages = [], output = [];

const createTableInvits = function() {
    return new Table({
            chars: chars,
            head: ['Id', 'Repository', 'Invitee', 'Inviter', 'Permission', 'Date'],
            colWidths: [10, 25, 25, 25, 10, 25]
        });
};

const formatTable = (invitation) => {
    return [
        invitation.id, invitation.repository.full_name,
        invitation.invitee.login, invitation.inviter.login,
        invitation.permissions, invitation.created_at
    ];
};

const printOuputTable = function() {
    let table = createTableInvits();
    table.push.apply(table,output.map(formatTable));
    this.log(table.toString());
    output = [];
    messages =[];
}; 

const printOutput = function() {
    let table = new Table({
        chars: chars,
        head:['Sl No.','Message'],
        colWidths: [8,60]
    });
    table.push.apply(table,messages.map((msg,index)=>([index,msg])));
    this.log(table.toString());
    output = [];
    messages =[];
};


const httpRequest = function (message,options) {
    return new Promise(function(resolve, reject) {
        var req = http.request(options, function(res) {
            res.message = message;
            res.setEncoding('utf8');
            let data = '';
            if(res.statusCode == 404) {
                return reject(Error("you donot have admin priveleges for this repo"));
            }
            if(res.statusCode == 204) {
                messages.push(res.message)
                resolve(data);
                return;
            }
            res.on("data",(chunk)=>(data += chunk));
            res.on("end",()=>{
                data = JSON.parse(data);
                output.push(data);
                resolve(data);
            });

        });
        req.on('error', (error) => {
            reject(error);
        });
        req.end();
    });
};

const addCollaborator = function (args, callback) {
    options.method = 'PUT';
    let promises = [];
    args.collab.forEach(collab => {
        options.path = `/repos/${args.org}/${args.repo}/collaborators/${collab}`;
        const message = `${collab} is already a collaborator on ${args.repo}`;
        promises.push(httpRequest(message, options));
    });
    Promise.all(promises)
        .then(printOuputTable.bind(this))
        .then(callback)
        .catch((error)=>{
            this.log(error.message);
            callback();
        });
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



const removeCollaborator = function (args, callback) {
    options.method = 'DELETE';
    let promises = [];
    args.collab.forEach(collab => {
        options.path = `/repos/${args.org}/${args.repo}/collaborators/${collab}`;
        const message = `${collab} removed from ${args.repo} as collaborator`;
        promises.push(httpRequest(message, options));
    });
    Promise.all(promises)
        .then(printOutput.bind(this))
        .then(callback)
        .catch((error)=>{
            this.log(error);
            callback();
        });
};


module.exports = {
    addCollaborator: addCollaborator,
    removeCollaborator: removeCollaborator,
    validateArgsArePresent: validateArgsArePresent
};