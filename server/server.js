const path = require('path');
const http = require('http');
const express =require('express');
const socketIO =require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname,'../public');
const port =process.env.PORT || 3000;

var app =express();
var server =http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user Connected');
    

       
    // socket.emit('newEmail',{
    //     from:'abhinav@example.com',
    //     text:'Heyaa',
    //     createAt: 123
    // });

    // socket.on('createEmail',(newEmail)=>{
    //     console.log('createEmail',newEmail)
    // })


    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and Room name are required');
        }
            callback();
        
            socket.join(params.room);
            // io.emit --> io.to(room name)
            // socket.broadcast.emit() --> socket.broadcast.to(room name)
            // socket.emit 
            users.removeUser(socket.id);
            users.addUser(socket.id,params.name,params.room);
           
           io.to(params.room).emit('updateUserList',users.getUserList(params.room));
            socket.emit('newMessage',generateMessage('Admin','Welcome to the App'));
            socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
        

    });
    
    socket.on('createMessage',(message,callback)=>{
        console.log("create message",message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback();
    });

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
    });


    socket.on('disconnect',()=>{
        console.log('Client Disconnected');
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
        }
    
    });
});


server.listen(port,()=>{
    console.log(`Server is up on ${port}`)
})