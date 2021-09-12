const User = require('./usersModel')

// exports.addUser = function (obj) {
//     return new Promise((resolve, reject) => {
//         let user = new User({
//             userId: obj.id,
//             name: obj.name,
//             email: obj.email,
//             city: (typeof obj.city != 'undefined') ? obj.city : obj.address.city,
//         });
//
//         user.save(function (err) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve('Created with id: ' + user._id)
//             }
//         })
//     });
// }

exports.getAllUsers = function () {
    return User.find({})
}

// exports.getUser = function (id) {
//     return new Promise((resolve, reject) => {
//         User.findById(id, function (err, data) {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(data)
//             }
//         })
//     })
// }

exports.updateUser = function (id, obj) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            firstName: obj.firstName,
            lastName: obj.lastName,
            username: obj.email,
            isAdmin: obj.isAdmin
        }, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve('Updated!')
            }
        })
    });
}

exports.deleteUser = (id) => {
    return User.findOneAndDelete({_id: id }, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Delete User : ", docs.username);
        }
    });
}
