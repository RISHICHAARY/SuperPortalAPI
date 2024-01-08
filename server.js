const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const pool = require('./src/dbconfig/dbconfig');
const loggingRoutes = require('./src/routes/loggingRoute');

const app = express();
app.use(cookieParser());
app.use(express.json());

const origin = "http://localhost:3000"

app.use(
  cors({
    credentials: true,
  }),
);

const port = process.env.PORT || "3001";

app.use((req,res,next)=>{
    res.setHeader('Access-Control_Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  
  res.setHeader('Access-Control-Allow-Methods','GET','POST','PATCH','DELETE','OPTIONS');
  next();
});

app.use('/api/logging', loggingRoutes);

app.listen(port, (err)=>{
    if(err){
        throw err;
    }
    else{
        console.log(`Server is running at port: ${port}`);
    }
});