const Comment = require('./commentModel')

exports.countComments = function () {
    return Comment.countDocuments({});
}

exports.addComment = function (obj) {
    return new Promise((resolve, reject) => {
        let comment = new Comment({
            movieId: '612f502605cb3251c44f9bea',
            comments: [
                {
                    userId: '612f502605cb3251c44f9bea',
                    userName: 'test',
                    image: 'https://twitter.com/aradyaniv/photo',
                    date: new Date(),
                    body: obj.body
                }
            ]
        });

        comment.save({},function (err) {
            if (err) {
                reject(err);
            } else {
                resolve('Created with id: ' + comment._id)
            }
        })
    });
}
