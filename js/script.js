window.socket = io('https://pchat.day4.live');

socket.on('connect', function() {
    newMsg('SERVER', 'Connected', true);
    socket.emit('token', 'qwerty');
})

socket.on('disconnect', function() {
    newMsg('SERVER', 'Disconnected', true)
})


socket.on('data', function(data) {
    if (data.action === "message") {
        if (!data.name || !data.msg) return
        newMsg(data.name, data.msg, false, data.color);
    } else if (data.action === "gameOver") {
        newScore(data.name, data.score);
    }
})
$('#msg').keyup(function(event) {
    if (event.which === 13) {
        sendMsg();
    }
})
$(document).click(function(event) { 
    $target = $(event.target);
    console.log($target.closest('#msg'))
    if(!$target.closest('#msg').length) {
        $('#msg').blur();
    }
});