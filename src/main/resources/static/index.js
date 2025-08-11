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
    if(userName !== null && userName !== ''){
        let child = window.open('/socket/main.do');
        child.addEventListener('load', e=>{
            child.connect(userName);
        });
    }
    userName.prop('readOnly', true);
});