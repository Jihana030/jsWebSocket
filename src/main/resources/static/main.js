// let socket = new WebSocket("ws://localhost:8003");
const sendBtn = document.querySelector('#btn-send');
const message = document.querySelector('.input-box');
const content = document.querySelector('.content');

// chat bubble들의 높이의 총값이 content 높이보다 크면 스크롤 맨 밑에

//스크롤 아래 고정
function scrollToBottom(content){
    content.scrollTop = content.scrollHeight;
}

let name;
let ws;
const url = 'ws://localhost:8080/chatserver.do';

// userName 받기
document.addEventListener('DOMContentLoaded', function(){
    const urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get('username');
    if(name){
        connectUser(name);
    } else {
        console.log('no name');
    }
})

// 입장
function connectUser(name){
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
        print('', `${message.sender}님이 입장하셨습니다.`, 'me', 'state', message.regdate);
    }
    ws.onmessage = (e) => {
        let message = JSON.parse(e.data);
        if(message.sender === name){
            return;
        }
        if(message.code === '1'){
            print('', `${message.sender}님이 입장하셨습니다.`, 'other', 'state', message.regdate)
        } else if (message.code === '2'){
            print('', `${message.sender}님이 퇴장하셨습니다.`, 'other', 'state', message.regdate)
        } else if (message.code === '3'){
            print(message.sender, message.content, 'other', 'msg', message.regdate)
        }
    }
}

// 퇴장 유저 서버에 전송
window.onbeforeunload = () => {
    disconnect(name);
}
function disconnect(name){
    let message = {
        code: '2',
        sender: name,
        receiver: '',
        content: '',
        regdate: new Date().toLocaleString()
    };
    ws.send(JSON.stringify(message));
}

// 전송버튼
sendBtn.addEventListener("click", ()=>{
    let msg = {
        code : '3',
        sender: name,
        receiver: '',
        content: message.value.replaceAll(/(\n|\r\n)/g, "<br>"),
        regdate: new Date().toLocaleString()
    };
    ws.send(JSON.stringify(msg));
    print(name, msg.content, 'me', 'msg', msg.regdate);
    message.value = '';
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

// 대화창 내용
function print(name, msg, side, state, time){
    let user = `
        <div class="user-thumb">
            <img src="https://randomuser.me/api/portraits/med/men/75.jpg" alt="user">
            <span class="user-name">${name}</span>
        </div>
    `;
    let temp = `
        <div class="user-message">
            <div>
                ${msg.replaceAll(/(\n|\r\n)/g, "<br>")}
                <span>${time}</span>
            </div>
        </div>
    `;
    let temp2 = `
        <div>
            ${msg.replaceAll(/(\n|\r\n)/g, "<br>")}
            <span>${time}</span>
        </div>
    `
    if(side === 'me'){
        if(content.children.length === 0){
            const chatMe = document.createElement('div');
            chatMe.className = 'chat-bubble right';
            chatMe.innerHTML = temp;
            content.appendChild(chatMe);
        } else if(content.lastElementChild.classList.contains('right')){
            const userMessage = content.lastElementChild.querySelector('.user-message');
            userMessage.innerHTML += temp2;
        } else {
            const chatMe = document.createElement('div')
            chatMe.className = 'chat-bubble right';
            chatMe.innerHTML = temp;
            content.appendChild(chatMe);
        }
    } else {
        if(content.children.length === 0){
            const chatMe = document.createElement('div');
            chatMe.className = 'chat-bubble left';
            chatMe.innerHTML = user;
            chatMe.innerHTML += temp;
            content.appendChild(chatMe);
        } else if(content.lastElementChild.classList.contains('left')){
            const userMessage = content.lastElementChild.querySelector('.user-message');
            const userThumb = content.lastElementChild.querySelector('.user-thumb');
            if(name !== userThumb.querySelector('.user-name').innerText){
                const chatMe = document.createElement('div')
                chatMe.className = 'chat-bubble left';
                chatMe.innerHTML += user;
                chatMe.innerHTML += temp;
                content.appendChild(chatMe);
            } else {
                userMessage.innerHTML += temp2;
            }
        } else {
            const chatMe = document.createElement('div')
            chatMe.className = 'chat-bubble left';
            chatMe.innerHTML += user;
            chatMe.innerHTML += temp;
            content.appendChild(chatMe);
        }
    }
    scrollToBottom(content);
}

