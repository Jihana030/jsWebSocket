let socket = new WebSocket("ws://localhost:8003/socket/chatserver.do");
const sendBtn = document.querySelector('#btn-send');
const message = document.querySelector('.input-box');
const content = document.querySelector('.content');

// chat bubble들의 높이의 총값이 content 높이보다 크면 스크롤 맨 밑에

// 전송버튼
sendBtn.addEventListener("click", ()=>{
    if(content.lastElementChild.classList.contains('right')){
        const userMessage = content.lastElementChild.querySelector('.user-message');
        if(message.value.trim()){
            const text = message.value.replaceAll(/(\n|\r\n)/g, "<br>");
            socket.send(text);
            userMessage.innerHTML += `<div>${text}</div>`;
            message.value = "";
            message.style.height = `auto`;
            scrollToBottom(content);
        } else {
            socket.send('no value');
        }
    } else {
        const chatMe = document.createElement('div.chat-bubble.right')
        if(message.value.trim()){
            const text = message.value.replaceAll(/(\n|\r\n)/g, "<br>");
            socket.send(text);
            chatMe.innerHTML += `<div class="user-message"><div>${text}</div></div>`;
            message.value = "";
            message.style.height = `auto`;
            scrollToBottom(content);
        } else {
            socket.send('no value');
        }
    }

});

// enter event
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


let name;
let ws;
const url = 'ws://localhost:8003/socket/chatserver.do';

// 입장
function connect(name){
    ws = new WebSocket(url);
    ws.onopen = (e) => {
        let message = {
            code: '1',
            sender: name,
            receiver: '',
            content: '',
            regdate: new Date().toLocaleString()
        };
        ws.send(JSON.stringify(message));
        print('', `${name}님이 입장하셨습니다.`, 'me', 'state', message.regdate);
    }
    ws.onmessage = (e) => {
        let message = JSON.parse(e.data);
        if(message.code === '1'){
            print('', `${name}님이 입장하셨습니다.`, 'other', 'state', message.regdate)
        } else if (message.code === '2'){
            print('', `${name}님이 퇴장하셨습니다.`, 'other', 'state', message.regdate)
        }
    }
}

// 퇴장 유저 서버에 전송
function disconnect(){
    let message = {
        code: '2',
        sender: name,
        receiver: '',
        content: '',
        regdate: new Date().toLocaleString()
    };
    ws.send(JSON.stringify(message));
}

// 대화창 내용
function print(name, msg, side, state, time){
    let user = `
        <div class="user-thumb">
            <img src="https://randomuser.me/api/portraits/med/men/75.jpg" alt="user">
            <span>${name}</span>
        </div>
    `;
    let temp = `
        <div class="user-message">
            <div>
                ${msg.value.replaceAll(/(\n|\r\n)/g, "<br>")}
                <span>${time}</span>
            </div>
        </div>
    `;
    let temp2 = `
        <div>
            ${msg.value.replaceAll(/(\n|\r\n)/g, "<br>")}
            <span>${time}</span>
        </div>
    `
    if(side === 'me'){
        if(content.lastElementChild.classList.contains('right')){
            const userMessage = content.lastElementChild.querySelector('.user-message');
            userMessage.innerHTML += temp2;
        } else {
            const chatMe = document.createElement('div.chat-bubble.right')
            chatMe.innerHTML = temp;
        }
    } else {
        if(content.lastElementChild.classList.contains('left')){
            const userMessage = content.lastElementChild.querySelector('.user-message');
            userMessage.innerHTML += temp2;
        } else {
            const chatMe = document.createElement('div.chat-bubble.left')
            chatMe.innerHTML = temp;
        }
    }
    scrollToBottom(content);
}

