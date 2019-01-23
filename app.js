const express = require('express');
const port = process.env.PORT | 3000;
const app = express();
app.get('/',(req,res)=>{
    res.send(`server started on port:${port}`);
});
app.listen(port,()=>{
    console.log(`server started on port:${port}`)
});