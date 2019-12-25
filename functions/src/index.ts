import * as admin from 'firebase-admin';

admin.initializeApp()

const funcs = {
    addTimeRecord: './addTimeRecord',
    getInformation: './getInformation',
    getUsers: './getUsers',
};

const loadFunctions = (funcs: any) => {
    for (const key in funcs) {
        if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === key) {
            module.exports[key] = require(funcs[key]).default;
        }
    }
}

loadFunctions(funcs);