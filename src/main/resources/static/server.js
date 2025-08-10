// express 서버(5000)
const express = require('express');
const app = express();

app.listen(5000, ()=>{
    console.log("EXPRESS");
});

app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/main.html');
})

// WebSocket 서버(8003)
const WebSocket = require('ws');
const socket = new WebSocket.Server({ port: 8003 });

socket.on('listening', function () {
    console.log("success");
})
socket.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        console.log('클라이언트에서 보내는 : ' + message);
        ws.send('서버에서 보내는 : ' + message);
    })
    ws.send('보낸다 경로로 서버에서 : ' + req.socket.remoteAddress);
})
socket.on('error', function (err) {
    console.log("error", err);
})