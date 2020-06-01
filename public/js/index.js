var socket = io();

socket.on('connect',function (){
    console.log('Connected to Server');
    // socket.emit('createEmail',{
    //     to:'abc@ex.com',
    //     text: 'Heayayda'     
    // });

    socket.emit('createMessage',{
        from:'Abhinav',
        text: 'Yooo'
    })


});

socket.on('disconnect',function (){
    console.log('Disconnected from server');
});

// socket.on('newEmail',function(email){
//     console.log('New email :',email);
// });

socket.on('newMessage',function(message){
    console.log('newMessage :',message);
});