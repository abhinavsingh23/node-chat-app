const path = require('path');
const http = require('http');
const express =require('express');
const socketIO =require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port =process.env.PORT || 3000;

var app =express();
var server =http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user Connected');
    
    socket.emit('newMessage',{
        from:'dad',
        text:'Heyaa',
        createAt: 123123
    });




    // socket.emit('newEmail',{
    //     from:'abhinav@example.com',
    //     text:'Heyaa',
    //     createAt: 123
    // });

    // socket.on('createEmail',(newEmail)=>{
    //     console.log('createEmail',newEmail)
    // })
    
    socket.on('createMessage',(message)=>{
        console.log("create message",message);
    })


    socket.on('disconnect',()=>{
        console.log('Client Disconnected');
    });
});


server.listen(port,()=>{
    console.log(`Server is up on ${port}`)
})