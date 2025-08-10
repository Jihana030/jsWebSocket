let socket = new WebSocket("ws://localhost:8003");
const sendBtn = document.querySelector('#btn-send');
const message = document.querySelector('.input-box');
const chatMe = document.querySelector('.chat-bubble.right ul');
const chatYou = document.querySelector('.chat-bubble.left ul');
const content = document.querySelector('.content');

sendBtn.addEventListener("click", ()=>{
    if(message.value.trim()){
        const text = message.value.replaceAll(/(\n|\r\n)/g, "<br>");
        socket.send(text);
        chatMe.innerHTML += `<li>${text}</li>`;
        message.value = "";
        message.style.height = `auto`;
        scrollToBottom(content);
    } else {
        socket.send('no value');
    }
});
message.addEventListener("keydown", (e)=>{
    if(e.key === 'Enter'){
        if(!e.shiftKey){
            e.preventDefault();
            sendBtn.click();
        }
    }
});

//스크롤 아래 고정
function scrollToBottom(content){
    content.scrollTop = content.scrollHeight;
}