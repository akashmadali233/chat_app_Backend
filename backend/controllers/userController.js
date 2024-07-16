const db = require('../models')
const generateToken = require('../config/generateToken')
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); 

const User = db.User;

const registerUser = async (req, res) => {
    const {name, email, password, pic} = req.body;
    
    if(!name || !email || !password){
        res.status(400);
        throw new error("Please Enter all the Feilds")
    }
    
    const existingUser = await User.findOne({ where: { email: email } });
    
    if(existingUser){ 
        return res.status(400).json({"message":"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        name : name,
        email : email,
        password: hashedPassword,
        pic : pic
    });
    
    if(user){
        return res.status(201).json({
            id : user.id,
            name : user.name,
            email: user.email,
            pic : user.pic,
            token : generateToken(user.id),
        })
    }else{
        res.status(400);
        throw new error("Failed to create the User");
    } 
}

const authUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new error("Please Enter all the Feilds")
    }

    const existingUser = await User.findOne({ where: { email: email } });
    if(!existingUser){
        return res.status(400).json({
            error: {
                code: 'USER_NOT_FOUND',
                status : 400,
                message: 'User not found',
            }
        }); 
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if(!matchPassword){
        return res.status(400).json({ 
            error : {
                status : 400,
                message : "Invalid Credenials"
            }
        });
    }

    return res.status(201).json({
        id : existingUser.id,
        name : existingUser.name,
        email: existingUser.email,
        pic : existingUser.pic,
        token : generateToken(existingUser.id),
    })
}

const allUsers = async (req, res) => {
    const search = req.query.search || '';

  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}



module.exports = {
    registerUser,
    authUser,
    allUsers
};
