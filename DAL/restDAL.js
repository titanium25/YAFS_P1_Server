const axios = require('axios');
const moviesURL = "https://api.tvmaze.com/shows";
const membersURL = "https://jsonplaceholder.typicode.com/users";
const commentsURL = "https://jsonplaceholder.typicode.com/posts";

exports.getMembers = function (){
    return axios.get(membersURL);
}

exports.getMember = function (id){
    return axios.get(membersURL + '/' + id);
}

exports.getMovies = function (){
    return axios.get(moviesURL);
}

exports.getMovie = function (id){
    return axios.get(moviesURL + '/' + id);
}

exports.getPosts = function (){
    return axios.get(commentsURL);
}