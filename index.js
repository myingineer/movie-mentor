const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const app = require('./app');

mongoose.connect(process.env.DB_CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    console.log("DB CONNECTION SUCCESSFUL");
}).catch((err) => {
    console.log('An error occured');
});

const PORT = process.env.PORT || 1100;

app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
});