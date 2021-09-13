const jsonFile = require("jsonfile");

const fileNameAuthors= __dirname + "/json/authors.json";
const fileNameUsers = __dirname + "/json/users.json";
const fileNamePermissions = __dirname + "/json/permissions.json";

exports.getComments = () => {
    return new Promise((resolve, reject) => {
        jsonFile.readFile(fileNameAuthors, (err, res) => {
            if (err) {
                reject(err);
            };
            resolve(res);
        });
    });
};

exports.saveUser = (obj) => {
    return new Promise((resolve, reject) => {
        jsonFile.writeFile(fileNameUsers, obj, {spaces: 2}, function (err) {
            if (err){
                reject(err);
            } else {
                resolve("User Saved!");
            }
        })
    })
}

exports.savePermissions = (obj) => {
    return new Promise((resolve, reject) => {
        jsonFile.writeFile(fileNamePermissions, obj, {spaces: 2}, function (err) {
            if (err){
                reject(err);
            } else {
                resolve("Permissions Saved!");
            }
        })
    })
}

exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        jsonFile.readFile(fileNameUsers, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};

exports.getPermissions = () => {
    return new Promise((resolve, reject) => {
        jsonFile.readFile(fileNamePermissions, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};
