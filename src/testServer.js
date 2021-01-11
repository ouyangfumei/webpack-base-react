// 创建⼀个server.js 修改scripts "serverTest":"node testServer.js(需要放在根目录下，用node ./src/testServer.js)"
const express = require('express');

const app = express();

app.get('/api/info',(req,res)=>{
    res.json({
        name:'vicky test server',
        msg:'sucess',
        code:0
    })
})
app.listen('8888');

//node ./src/testServer.js
// http://localhost:8888/api/info
