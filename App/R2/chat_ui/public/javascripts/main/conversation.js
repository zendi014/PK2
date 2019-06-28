var arr = window.location.href.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect(result);

socket_service();

function socket_service() {
    socket.emit('connection', 'a user connected');

    socket.on('message', function (data) {
        console.log(data)
    });

    socket.emit('disconnect', 'a user disconnected');
}
