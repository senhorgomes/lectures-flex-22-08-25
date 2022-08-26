const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const saltRounds2 = 1;
const app = express();

const port = 3000;


//Middleware
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended:true}))
// app.use(cookieParser())
app.use(cookieSession({
    name: 'user_id',
    keys: ["superSecretKeyasdq2ewrfs3234234"],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))
//View engine
app.set("view engine", "ejs")
const users = {
    1: {
        id: 1,
        email: "obiwan@gmail.com",
        password: bcrypt.hashSync("hellothere", saltRounds)
    },
    2: {
        id: 2,
        email: "hodor@gmail.com",
        password: bcrypt.hashSync("hodor", saltRounds)
    },
    3: {
        id: 3,
        email: "dwightSchrute@gmail.com",
        password: bcrypt.hashSync("beets", saltRounds)
    }
}
let visitors = 0
//localhost:3000/
app.get("/", (req, res)=>{
    //There two things
    //user can be assigned to a user object
    //OR
    //user can be assigned to undefined
    // let user;
    // if(req.cookies.user_id){
    //     user = users[req.cookies.user_id]
    // } else {
    //     user = false;
    // }

    console.log(bcrypt.hashSync('hello', saltRounds))
    console.log(bcrypt.compareSync("hodor", users[3].password))
    visitors ++
    //Find a unique identifier in the request that is being made by the client
    //By making multiple requests as a logged in user, or not logged in
    //Track every logged every single user by giving them a unique cookie
    // add that cookie to the visitors array
    //does this visitor exist in the array of visitors?
    //If it doesnt, add them to the array of visitors and increase count of unique visitors by one
    //else do nothing
    res.cookie("Amount of visitors", visitors)
    res.render("index", {user: users[req.session.user_id]})
})

app.get("/test", (req, res)=>{
    res.json(users)
})

//get for the login(render the login page)
app.get("/login", (req, res)=> {
    res.render("login")
})

//Welcome to user page
// app.get("/:id", (req, res)=> {
//     //We want to send over the users information to the welcome page
//     res.render("welcome", {user: users[req.params.id]})
// })
// app.get("/cats/:id", (req, res)=> {
    
//     //We want to send over the users information to the welcome page
//     res.render("welcome", {user: users[req.params.id]})
// })
//post for the login(make a request to the database)
app.post("/login", (req, res)=> {
    console.log(req.body)
    const emailFromForm = req.body.email;
    const passwordFromForm = req.body.password;
    //loop through our users, and check if the emails match, and then if the password matches
    for(let key in users){
        if(users[key].email === emailFromForm && bcrypt.compareSync(passwordFromForm, users[key].password)){
            // if(users[key].password === passwordFromForm){
                res.cookie("cookie", "oatmeal")
                // res.cookie("user_id", users[key].id)
                req.session.user_id = users[key].id
                console.log(req.cookies)
                // console.log("after parse",JSON.parse(req.cookie))
                res.redirect("/")
                return
            // }
        }
    }
    res.status(404).send("I think you made a mistake somewhere")
    // res.redirect("/")
})
app.post("/logout", (req, res)=> {
    req.session.user_id = null
    res.redirect("/")
})


//This checks if the server is listening
app.listen(port, ()=> {
    console.log("This server isn't broken!")
})
