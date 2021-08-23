const express = require('express');
const membersController = require('./controller/membersController');
const moviesController = require('./controller/moviesController');
const subsController = require('./controller/subsController');

const main = express();
const cors = require('cors')

// Enable CORS
main.use(cors())

const movieBL = require('./model/movie/movieBL');
const memberBL = require('./model/member/memberBL');
const restDAL = require('./DAL/restDAL');


// DB initialization
(async () => {
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
                    rating,
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

main.use(express.json());
main.use(express.urlencoded({extended: false}));

/*
RESTfull Resource Naming Conventions
https://nordicapis.com/10-best-practices-for-naming-api-endpoints/
 */
main.use('/api/members', membersController);
main.use('/api/movies', moviesController);
main.use('/api/subs', subsController);


require('./config/database');

main.listen(2020);