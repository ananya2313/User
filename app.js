const express= require('express')
const app = express();
const path = require('path')
const userModel = require('./models/user');
const { truncate } = require('fs/promises');

app.use(express.json());

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

app.set("view engine", "ejs")

app.get('/',(req,res)=>{
    res.render("index")
})


app.get('/read',async(req,res)=>{
    let users = await userModel.find();
    res.render("read",{users})
})

app.get('/index',(req,res)=>{
    res.render("index")
})

app.get('/delete/:id',async(req,res)=>{
    let users = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect('/read')
})


app.get('/edit/:userid',async(req,res)=>{
    let user = await userModel.findOne({_id: req.params.userid});
    res.render('edit',{user})
})

app.post('/update/:userid',async(req,res)=>{
    let {name, email,image}= req.body;
    let user = await userModel.findOneAndUpdate({_id: req.params.userid},{image, name, email} , {new:truncate});
    res.redirect('/read')
})


app.post('/create', async(req,res)=>{

    let {name, email,image}= req.body;
    let createdUser= await userModel.create({
        name: name,
        email:email,
        image:image       //aise akela bhi likh skte haii
    })

    res.redirect('/read')
    
})

app.listen(3000)