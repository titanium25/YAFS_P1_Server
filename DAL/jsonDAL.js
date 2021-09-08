const jsonFile = require("jsonfile");

const fileNameComments = __dirname + "/json/authors.json";

exports.getComments = () => {
    return new Promise((resolve, reject) => {
        jsonFile.readFile(fileNameComments, (err, res) => {
            if (err) {
                reject(err);
            };
            resolve(res);
        });
    });
};
