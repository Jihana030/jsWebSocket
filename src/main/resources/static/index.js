let ws;
const connectBtn = document.querySelector('.btn-connect');

connectBtn.addEventListener('click', e=>{
    ws = new WebSocket("ws://localhost:8003/socket/testserver.do");
    ws.onopen = () => {
        console.log("Connection opened");
    }
    ws.onmessage = event=>{
        console.log(event.data);
    }
    ws.onclose = ()=>{
        console.log("Connection closed");
    }
    ws.onerror = event=>{
        console.log("Connection error: " + event);
    }

    let userName = document.querySelector('#user-name').value;
    if(e.target.data('name') !== null && e.target.data('name') !== ''){
        userName = e.target.data('name');
    }
    let child = window.open('/socket/chat.do');
    child.addEventListener('load', e=>{
        child.connect(userName);
    });
    userName.prop('readOnly', true);
});