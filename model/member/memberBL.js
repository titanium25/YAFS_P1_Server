const Member = require('./memberModel')
const Subs = require('../subs/subsModel')

exports.countMembers = function () {
    return new Promise((resolve, reject) => {
        Member.countDocuments({}, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function randomColor() {
    let hex = Math.floor(Math.random() * 0xFFFFFF);
    return "#" + hex.toString(16);
}

exports.addMember = function (obj) {
    return new Promise((resolve, reject) => {
        let member = new Member({
            memberId: obj.id,
            name: obj.name,
            email: obj.email,
            city: (typeof obj.city != 'undefined') ? obj.city : obj.address.city,
            color: randomColor()
        });
        console.log(member)

        member.save(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve('Created with id: ' + member._id)
            }
        })
    });
}

exports.getAllMembers = async function (find) {
    const members = await Member.find({});
    if (find) {
        return members.filter(member =>
            (member.name.toLowerCase().includes(find.toLowerCase()) || find === '')
        )
    }
    return Member.find({})
}

exports.getMember = function (id) {
    return new Promise((resolve, reject) => {
        Member.findById(id, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

exports.updateMember = function (id, obj) {
    return new Promise((resolve, reject) => {
        Member.findByIdAndUpdate(id, {
            name: obj.name,
            email: obj.email,
            city: obj.city
        }, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve('Updated!')
            }
        })
    });
}

const deleteSubs = (id) => {
    return Subs.findOneAndDelete({memberId: id }, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Delete Subs : ", docs);
        }
    });
}

// Delete member and his subs by member id
exports.deleteMember = function (memberId) {
    deleteSubs(memberId)
    return Member.findByIdAndDelete(memberId)
}