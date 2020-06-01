const path = require('path');
const http = require('http');
const express =require('express');
const socketIO =require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname,'../public');
const port =process.env.PORT || 3000;

var app =express();
var server =http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user Connected');
    
    socket.emit('newMessage',generateMessage('Admin','Welcome to the App'));
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));


       
    // socket.emit('newEmail',{
    //     from:'abhinav@example.com',
    //     text:'Heyaa',
    //     createAt: 123
    // });

    // socket.on('createEmail',(newEmail)=>{
    //     console.log('createEmail',newEmail)
    // })
    
    socket.on('createMessage',(message,callback)=>{
        console.log("create message",message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('This is from the server');
    });

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
    });


    socket.on('disconnect',()=>{
        console.log('Client Disconnected');
    });
});


server.listen(port,()=>{
    console.log(`Server is up on ${port}`)
})