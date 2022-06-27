var express = require('express');
var router = express.Router();
var Country = require('../models/dataSchema');
var Users = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//routes
router.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Users.findOne({ email });

    if (oldUser) {
      return res.status(409).send(oldUser);
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await Users.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await Users.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});


router.post('/create',(req,res,next)=>{
  var newCountry = new Country({
    name:req.body.name,
    capital:req.body.capital
  });
  newCountry.save((err,country)=>{
    if (err)
      res.status(500).json({errmsg:err});
      res.status(200).json({msg:country});
  });
});

router.get('/read/',(req,res,next)=>{
  Country.find({},(err,countries)=>{
    if(err)
    res.status(500).json({errmsg:err});
    res.status(200).json({msg:countries});
  });

});

router.get('/read/:email',(req,res,next)=>{
  Users.find({},(err,data)=>{
    if(err)
    res.status(500).json({errmsg:err});
    res.status(200).json({msg:data});
  });

});

router.put('/update',(req,res,next)=>{
  Country.findById(req.body._id,(err,country)=>{
    if(err)
    res.status(500).json({errmsg:err});
    country.name = req.body.name;
    country.capital = req.body.capital;
    country.save((err,country)=>{
      if(err)
      res.status(500).json({errmsg:err});
      res.status(200).json({msg:country});
    });
  });

});

router.delete('/delete/:id',(req,res,next)=>{
  Country.findOneAndRemove({ _id: req.params.id},(err,country)=>{
    if(err)
    res.status(500).json({errmsg:err});
    res.status(200).json({msg:country});
  });

});

router.post('/upload-avatar', async (req, res) => {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let avatar = req.files.avatar;
          
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          avatar.mv('./uploads/' + avatar.name);

          //send response
          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: avatar.name,
                  mimetype: avatar.mimetype,
                  size: avatar.size
              }
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

module.exports= router;
