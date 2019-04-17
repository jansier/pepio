function sanitize(txt) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '/': '&#x2F'
    }

    const reg = /[&<>/]/ig
    return String(txt).replace(reg, function(match) {
        return map[match];
    })
}
/* Create and add a new message */
function newMsg(name, msg, isMine = false, color = "white") {
    var html = `
        <div class="msg">
            <h6>${sanitize(name)}</h6>
            <p>${sanitize(msg)}</p>
        </div>
    `;
    var $el = $(html)
    if(color == '#000000'){
        $el.css('color',  'white')
    }
    
    $el.css('background', color)
    if (isMine) $el.addClass('mine');
    
    $('#msgs').append($el);

    if ($('.msg').length > 10) {
        $('.msg').first().remove()
    }
}
/* Send a new message */
function sendMsg() {

    var name = $('#nickname').val();
    var msg = $('#msg').val();
    var color = $('#color').val();

    if (!name) {
        alert('Hey you forgot your name.');
        return;
    }

    if (!msg) {
        alert('No message');
        return
    }

    $('#msg').val('');
    $('#msg').blur();

    window.socket.emit('data', {
        action: 'message',
        name,
        msg,
        color
    })

    newMsg(name, msg, true, color);
}

function joinGame() {
    var name = $('#nickname').val();
    if (!name) {
        alert('Hey you forgot your name.');
        return;
    }
    runGame();
    $( "#welcome" ).html("Witaj " + name + "");
    $( "#name-form" ).hide();
    $( "#messages" ).show();
    $( "#join-game" ).remove();
    
    window.playerName = name;
}

/* Add score to score */
function newScore(name, score) {
    var html = `
        <div class="score">${sanitize(name)} - ${sanitize(score)} pkt</div>
    `;
    var $el = $(html)
    $('#scores').append($el);
}