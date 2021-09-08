const Comment = require('./commentModel')
const jsonDAL = require('../../DAL/jsonDAL')

exports.countComments = function () {
    return Comment.countDocuments({});
}

exports.addComment = async function (obj) {
    const arr = await jsonDAL.getComments()
    const random = arr[Math.floor(Math.random() * arr.length)]

    return new Promise((resolve, reject) => {
        let comment = new Comment({
            author: random.author,
            image: random.image,
            body: obj.body,
            score: Math.floor(Math.random() * 5) + 1
        });

        comment.save({}, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve('Created with id: ' + comment._id)
            }
        })
    });
}
