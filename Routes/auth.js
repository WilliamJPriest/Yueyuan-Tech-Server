const router= require('express').Router();
const User = require('../Models/User.js');
const {registerValidation,loginValidation,profileValidation}=require('../validation');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken')
const authMiddleWare=require('./verifyToken')


router.post('/register', async (req,res)=>{
    const {error}= registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const userExists= await User.findOne({username: req.body.username})
    if (userExists) return(res.status(400).send("this username is already taken"))

    const emailExist= await User.findOne({email: req.body.email})
    if(emailExist) return(res.status(400).send("This email is already taken"))

    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(req.body.password,salt);

  
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        admin: false,
        bio: req.body.bio,
        icon: req.body.icon,
        contact: req.body.contact,

    });
      try{  
        const savedUser= await user.save();
        res.json(savedUser)
      }catch(err){
        res.status(400).send(err);
      }
});

router.post('/login', async (req,res)=>{
  const {error}=loginValidation(req.body)
  if(error) return(res.status(400).send(error.details[0].message))

  const userDetails= await User.findOne({email: req.body.email}) 
  if(!userDetails) return(res.status(400).send("email doesn't exist"))

  const passwordValidation= await bcrypt.compare(req.body.password,userDetails.password)
  if(!passwordValidation) return(res.status(400).send("password is incorrect"))
  

  const userToken= jwt.sign({_id: userDetails._id, },process.env.HIDDEN__TOKEN);
  res.json({auth: true, token: userToken,});


})

router.patch('/profiles', authMiddleWare, async ( req,res)=>{
  const token= req.header('x-auth-token');

  const {error}=profileValidation(req.body);
  if(error)return res.status(400).send(error.details[0].message)

  const userDetails = await User.findById(jwt.decode(token))
  const confirmedUsername= userDetails.username;
  // const userEmail= userDetails.email;
  // const userPassword= userDetails.password;
  // const userAdmin = userDetails.admin;


  const userExists= await User.findOneAndUpdate({username: confirmedUsername},{
    bio: req.body.bio,
    contact: req.body.contact,
    icon: req.body.icon,
    },{ new: true }).catch(error => {
    return res.status(500).send(error);
  });

  return res.status(200).json({
    message : "Updated user",
    data: userExists})
//   if(userExists){
//       const loadedProfile= new User({   
//           bio: req.body.bio,
//           contact: req.body.contact,
//           icon: req.body.icon,
          
//       });
//       try{
//           const savedProfile= await loadedProfile.save()
//           res.json(savedProfile)
//           return
//       }catch(err){
//           res.status(400).send(err)
//           return

//       }
// }
});

router.get('/profiles', authMiddleWare, async (req,res)=>{
    const token= req.header('x-auth-token');

    const confirmedUsername= await User.findById(req.user._id)
    // const userExists= await User.findOne({username: confirmedUsername.username})

    // const userToken= jwt.sign({_id: confirmedUsername._id, },process.env.HIDDEN__TOKEN);
    // res.json({auth: true, token: userToken,});
  
    if(confirmedUsername){
      try{
        return res.status(200).json({
              success:true,
              data: confirmedUsername,
        });
        }catch(err){
          console.log(err)
          res.status(500)
        }
      }

})

router.get('/', authMiddleWare, async (req, res)=>{
  try{
     const token= req.header('x-auth-token');
     
     const user = await User.findById(jwt.decode(token))
     return res.status(200).json({
      success:true,
      data: user,
  });
 }catch(err){
  console.log(err)
  res.status(500)
}
})

router.get('/AllUsers', authMiddleWare, async (req, res)=>{
  try{
     const token= req.header('x-auth-token');
     
     const user = await User.find();
     return res.status(200).json({
      success:true,
      data: user,
  });
 }catch(err){
  console.log(err)
  res.status(500)
}
})


module.exports=router;
