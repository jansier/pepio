window.socket = io('https://pchat.day4.live');

socket.on('connect', function() {
    newMsg('SERVER', 'Connected', true)
    socket.emit('token', 'qwerty');
})

socket.on('disconnect', function() {
    newMsg('SERVER', 'Disconnected', true)
})

socket.on('data', function(data) {
    if (data.action === "message") {
        
        if (!data.name || !data.msg) return
        
        newMsg(data.name, data.msg, false, data.color);
    }
})

$('#msg').keyup(function(event) {
    if (event.which === 13) {
        sendMsg();
    }
})
