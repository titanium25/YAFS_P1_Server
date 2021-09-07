const Comment = require('./commentModel')

const arr = [
    {
        author: 'Yaniv Arad',
        image: 'https://www.yaniv-arad.com/wp-content/uploads/2020/11/%D7%99%D7%A0%D7%99%D7%91-%D7%90%D7%A8%D7%93-%D7%A7%D7%95%D7%A8%D7%A1-%D7%A4%D7%99%D7%AA%D7%95%D7%97.png'
    },
    {
        author: 'Benjamin Netanyahu',
        image: 'https://en.wikipedia.org/wiki/Trial_of_Benjamin_Netanyahu#/media/File:Benjamin_Netanyahu_2018.jpg'
    },
    {
        author: 'Dudu Faruk',
        image: 'https://en.wikipedia.org/wiki/Dudu_Faruk#/media/File:%D7%93%D7%95%D7%93%D7%95_%D7%A4%D7%90%D7%A8%D7%95%D7%A7_%D7%AA%D7%9E%D7%95%D7%A0%D7%AA_%D7%A4%D7%A8%D7%95%D7%A4%D7%99%D7%9C.png'
    },
    {
        author: 'Jonathan Mergui',
        image: 'https://en.wikipedia.org/wiki/Jonathan_Mergui#/media/File:JMERGUI_(cropped).jpg'
    }
]

exports.countComments = function () {
    return Comment.countDocuments({});
}

exports.addComment = function (obj) {
    return new Promise((resolve, reject) => {
        let comment = new Comment({
            author: arr[Math.floor(Math.random()*arr.length)].author,
            image: arr[Math.floor(Math.random()*arr.length)].image,
            body: obj.body
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
