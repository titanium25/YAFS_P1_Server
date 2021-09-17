const User = require('./usersModel')
const Token = require('../emailToken/tokenModel');
const jsonDAL = require('../../DAL/jsonDAL');
const crypto = require("crypto");
const sendEmail = require("../../lib/emailSender");


exports.addUser = async function (obj) {
    // Init. users array
    let usersJSON = await jsonDAL.getUsers();
    let permissionsJSON = await jsonDAL.getPermissions()
    let usersDataArr = usersJSON.usersData;
    let permissionsDataArr = permissionsJSON.permissionsData;


    // Request a weekday along with a long date
    let options = {timeZone: 'Asia/Jerusalem', hour12: false};
    // Create user data in JSON
    usersDataArr.push({
        id: obj._id,
        firstName: obj.firstName,
        lastName: obj.lastName,
        created: new Date()
            .toLocaleString('en-GB', options)
            .replace(/T/, ' ')
            .replace(/\..+/, '')
    })

    // Create new Permissions in JSON
    permissionsDataArr.push({
        id: obj._id,
        vs: obj.state ? obj.state.vs : false,
        cs: obj.state ? obj.state.cs : false,
        ds: obj.state ? obj.state.ds : false,
        us: obj.state ? obj.state.us : false,
        vm: obj.state ? obj.state.vm : false,
        cm: obj.state ? obj.state.cm : false,
        dm: obj.state ? obj.state.dm : false,
        um: obj.state ? obj.state.um : false,
    })

    // Create verification token for new user
    const token = await new Token({
        userId: obj._id,
        token: crypto.randomBytes(32).toString("hex")
    }).save();

    // Send email
    const message = `<h1>Hello ${obj.firstName}</h1>
                         <h2>Welcome to YAFS28:P2 project</h2>
                         <p>
                            Admin register for you this account. 
                            Please click on link below to activate your profile.
                         </p>
                          Press <a href=${process.env.WHITELISTED_DOMAINS}/user/verify/${obj._id}/${token.token}>
                          here 
                          </a>
                          to verify your email.`;

    await sendEmail(obj.username, 'Verify Email', message);

    // Save user data to JSON
    await jsonDAL.saveUser(usersJSON)
    // Save user permission to JSON
    await jsonDAL.savePermissions(permissionsJSON)

}

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
