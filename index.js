if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); //  brings key-value pairs of .env file in process.env variable that can be accessed globally
}
const express = require("express");
const app = express();
const path = require("path");
var stores = require('./seeds/storeLoc.js');

app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')))     // in my app, everywhere I use src="[some_link]" that 'some_link' will be relative to
// the public directory due to the above line
// app.set('view engine','ejs');    //  not required currently

app.get('/home',(req,res)=>{
    for(var i=0;i<stores.features.length;i++){
        stores.features[i].properties.id=i;
    }
    // console.log(stores.features[0].properties);
    res.render('home.ejs',{stores:stores});
})

app.listen(3000,()=>{
    console.log("Listening at 3000");
});