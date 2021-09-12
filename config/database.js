const mongoose = require('mongoose')
const uri = process.env.MONGO_DB_CONNECTION_STRING
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(r => {
        console.log('Connected to DB')
    })
    .catch(err => {
        console.log(err)
    });
