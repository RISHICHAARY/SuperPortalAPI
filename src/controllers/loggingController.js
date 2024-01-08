const bcrypt = require('bcrypt');

const pool = require('../dbconfig/dbconfig');
const quries = require('../queries/loggingQueries');
const { tokenGenerator } = require('../Helpers/jwtHelpers');

const registerUser = (req,res) =>{

    const { type,active,photo,firstName,lastName,dob,gender,email,mobile,address,role,status,password } = req.body;

    bcrypt.hash(password,10).then( (hashedPassword)=>{
        pool.query(quries.registerUser,[ type,active,photo,firstName,lastName,dob,gender,email,mobile,address,role,status,hashedPassword ],(err)=>{
            if(err){
                res.status(200).json({errorCode:405,message: "User already exist"});
            }
            else{
                res.status(200).json({message:"User Registerd Successfully"});
            }
        });
    } )

}

const loginUser = (req,res) =>{

    const { userName,passWord } = req.body;
    console.log(req.body);

    pool.query(quries.getLoginStatus,[ userName ],(err,result)=>{
        if(err){
            throw err;
        }
        else{
            if(result.rowCount == 0){
                res.status(200).json({errorCode:401,message: "Incorrect Username"})
            }
            else if( !result.rows[0].password ){
                res.status(200).json({errorCode:402,message: "Account not Active"})
            }
            else{
                const dbPassWord = result.rows[0].password;
                bcrypt.compare( passWord,dbPassWord ).then((match)=>{
                    if(!match){
                        res.status(200).json({errorCode:403,message: "Incorrect Password"})
                    }
                    else{
                        const accessToken = tokenGenerator(result);
                        res.cookie( "access-token",accessToken,{
                            maxAge: 60*60*24*1000,
                            secure:false
                        } );
                        res.status(200).json({message: "Login Success"})
                    }
                });
            }
        }
    });
}

const verifyCookie = (req,res) =>{
    console.log("running")
    res.status(200).json({data:{userName: req.userData.userName, type: req.userData.type}});
}

module.exports = {
    loginUser,
    registerUser,
    verifyCookie
}