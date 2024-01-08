const { sign,verify } = require('jsonwebtoken');

const jwtToken = process.env.JWT_TOKEN

const tokenGenerator = ( user )=>{

    const accessToken = sign( {userName:user.rows[0].email,passWord:user.rows[0].password,type:user.rows[0].type},jwtToken,{} );

    return accessToken;

}

const tokenVerifier = ( req,res,next )=>{

    console.log(req.cookies);
    const accessToken = req.cookies[ "access-token" ];
    console.log(accessToken);
    if( !accessToken ){
        res.status(200).json({errorCode:406,message: "No cookie found"});
    }
    else{
        try{
            verify( accessToken,jwtToken,(err,result)=>{
                if(err){
                    res.status(200).json({errorCode:407,message: "Cookie Error"});
                    throw err;
                }
                else{
                    req.userData = result; 
                    return next();
                }
            } );
        }
        catch(err){
            res.status(200).json({message: err});
        }
    }

}

module.exports = {
    tokenGenerator,
    tokenVerifier
}