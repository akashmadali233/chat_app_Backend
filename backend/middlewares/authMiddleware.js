const jwt = require('jsonwebtoken');
const db = require('../models')
const dotenv = require('dotenv');
dotenv.config();

const User = db.User;

const protect = async (req, res, next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findByPk(decoded.id);

            next();
        }catch(error){
            return res.status(401).json({
                message : "Token Not provided"
            });
        }
    }

    if(!token){
        return res.status(401).json({
                message : "Token Not provided"
            });
    }
}

module.exports =  protect ;