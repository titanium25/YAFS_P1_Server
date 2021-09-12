const movieBL = require('../model/movie/movieBL');
const memberBL = require('../model/member/memberBL');
const commentBL = require('../model/comment/commentBL');
const restDAL = require('../DAL/restDAL');


// DB initialization
(async () => {
    // Check if Comments Collection is empty
    if (await commentBL.countComments() === 0) {
        console.log('Start comment collection initialization...');
        let comments = await restDAL.getPosts();                // Get All Comments from API
        let commentsArr = comments.data.map(({body}) =>
            ({body}));                                          // Filter relevant data from Comments API
        await commentsArr.map(obj => commentBL.addComment(obj))  // Add Comments to DB
        console.log('Comment collection initialization done...');
    }
    // Check if Movies Collection is empty
    if (await movieBL.countMovies() === 0) {
        console.log('Start movie collection initialization...');
        let movies = await restDAL.getMovies();               // Get All Movies from API
        let moviesArr = movies.data.map(
            ({
                 name,
                 genres,
                 image,
                 premiered,
                 url,
                 language,
                 officialSite,
                 rating,
                 summary
             }) =>
                ({
                    name,
                    genres,
                    image,
                    premiered,
                    url,
                    language,
                    officialSite,
                    rating: rating.average /2,
                    summary
                }));              // Filter relevant data from Movies API
        await moviesArr.map(obj => movieBL.addMovie(obj))     // Add Movies to DB
        console.log('Movie collection initialization done...');
    }
    // Check if Members Collection is empty
    if (await memberBL.countMembers() === 0) {
        console.log('Start member collection initialization...');
        let members = await restDAL.getMembers();             // Get All Members from API
        let membersArr = members.data.map(({name, email, address}) =>
            ({name, email, address}));                        // Filter relevant data from Members API
        await membersArr.map(obj => memberBL.addMember(obj))  // Add Members to DB
        console.log('Member collection initialization done...');
    }
})();
