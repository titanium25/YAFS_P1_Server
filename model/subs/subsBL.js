const Subs = require('../subs/subsModel')

exports.getAllSubs = function () {
    return Subs.find();
}

// Add Subs
exports.addSubs = async function (obj) {
    const filter = {memberId: obj.memberId};
    const movie = {
        movieId: obj.movieId,
        name: obj.name,
        image: obj.image,
        date: obj.date
    };
    console.log('Updating subs')
    await Subs.findOneAndUpdate(
        filter,
        {$push: {movies: movie}},
        {safe: true, upsert: true},
    )
}


// Get sub by member id field
exports.getSubs = async function (memberId) {
    const filter = {memberId: memberId};
    const subs = await Subs.find(filter)
    return subs[0]
}

// Delete sub by member id field
exports.deleteSubs = function (memberId) {
    const filter = {memberId};
    return Subs.deleteOne(filter);
}

// Update All Subs - delete specific movie from all subs
exports.updateAllSubs = function (id) {
    return new Promise((resolve, reject) => {
        const update = {$pull: {movies: {movieId: id}}}
        Subs.updateMany({}, update, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve('Updated!')
            }
        })
    });
}

// Update Subs - delete specific movie from a specific subs
exports.updateSubs = function (movieId, subsId) {
    return new Promise((resolve, reject) => {
        const update = {$pull: {movies: {movieId: movieId}}}
        Subs.updateMany({ _id: subsId}, update, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve('Updated!')
            }
        })
    });
}