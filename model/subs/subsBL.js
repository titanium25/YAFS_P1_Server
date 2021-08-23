const Subs = require('../subs/subsModel')

exports.getAllSubs = function () {
    return Subs.find();
}

/*
Add Subs:
Check if subs for current member exists (each member cant get more then one sub doc in DB).
If no then create new sub.
If yes, update the sub.
 */
exports.addSubs = async function (obj) {
    const filter = {memberId: obj.memberId};
    const movie = {movieId: obj.movieId, date: obj.date};
    await Subs.find(filter, async function (err, docs) {
        if (err) {
            console.log('Creating new subs')
            let subs = new Subs({
                memberId: obj.memberId,
                movies: [
                    {
                        movieId: obj.movieId,
                        date: obj.date
                    }
                ]
            }).save
        } else {
            console.log('Updating existing subs')
            await Subs.findOneAndUpdate(
                filter,
                {$push: {movies: movie}},
                {safe: true, upsert: true},
            )

        }
    })
}


// Get sub by member id field
exports.getSubs = async function (memberId) {
    const filter = {memberId: memberId};
    let subs = await Subs.find(filter)
    return subs[0]
}

// Delete sub by member id field
exports.deleteSubs = function (memberId) {
    const filter = {memberId};
    return Subs.deleteOne(filter);
}

exports.updateSubs = function (id) {
    return new Promise((resolve, reject) => {
        const update = { $pull: { movies: {movieId : id} }}
        Subs.updateMany({}, update, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve('Updated!')
            }
        })
    });
}