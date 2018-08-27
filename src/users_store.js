class UserStore {
    constructor(vorpal) {
        this.vorpal = vorpal;
        this.variableStore = {};
    }

    saveIntoVariable(args, callback) {
        this.vorpal.log(this.variableStore, "store");
        this.variableStore[args.variable] = args.stdin || '';
        this.vorpal.log(this.variableStore, "store");
        this.vorpal.log(`output stored in '${args.variable}'`);
        callback();
    }

    getVariable(args, callback) {
        this.vorpal.log(this.variableStore[args.variable].toString());
        callback();
    }

    getStoredVariables(args, callback) {
        this.vorpal.log("VariableStored are: \n-> " +
            Object.keys(this.variableStore).join('\n->  '));
        callback();
    }

    variableExists(args) {
        let variableName = args.variable;
        let variableNames = Object.keys(this.variableStore);
        if (variableNames.includes(variableName))
            return true;
        return this.vorpal.chalk.red(`You do not have the variable ${variableName}`);
    }
}

module.exports = UserStore;