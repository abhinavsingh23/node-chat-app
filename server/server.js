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
        from: 'Admin',
        text: 'Welcome to the App',
        createAt: new Date().getTime()        

    })
    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        text: 'New User Joined',
        createAt: new Date().getTime()        
    })
       
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
        io.emit('newMessage',{
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        })
    
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createAt: new Date().getTime()
        // })
    
    })


    socket.on('disconnect',()=>{
        console.log('Client Disconnected');
    });
});


server.listen(port,()=>{
    console.log(`Server is up on ${port}`)
})