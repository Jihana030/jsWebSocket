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
let participants = [];
let disConnectUser = false;

// userName 받기
document.addEventListener('DOMContentLoaded', function(){
    const urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get('username');
    if(name && name !== ''){
        connectUser(name);
    } else {
        console.log('no name');
    }

    // 전송버튼
    sendBtn.addEventListener("click", ()=>{
        let msg = {
            code : '3',
            sender: name,
            receiver: '',
            content: message.value.replaceAll(/(\n|\r\n)/g, "<br>"),
            regdate: new Date().toLocaleString(),
        };
        ws.send(JSON.stringify(msg));
        message.value = '';
        message.style.height = 'auto';
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

})

// textarea 높이
message.addEventListener('input', e=>{
    autoHeight(message);
})
function autoHeight(input){
    input.style.height = 'auto';
    if(input.scrollHeight > 173){
        input.style.height = '174px';
    } else {
        input.style.height = `${input.scrollHeight}px`;
    }
}

// 입장
function connectUser(name){
    if(ws && ws.readyState === WebSocket.OPEN){
        return;
    }
    ws = new WebSocket(url);
    ws.onopen = (e) => {
        let message = {
            code: '1',
            sender: name,
            receiver: '',
            content: '',
            regdate: new Date().toLocaleString(),
            thumb: 7
        };
        ws.send(JSON.stringify(message));
    }
    ws.onmessage = (e) => {
        let message = JSON.parse(e.data);
        if(message.code === '9'){
            alert(message.content);
            disConnectUser = true;
            window.location.href = '/index.html';
            return;
        } else if(message.code === '0'){
            participants = JSON.parse(message.content);
            displayList(participants);
        } else if(message.code === '1'){
            participants.push(message.sender);
            displayList(participants);
            print('[system]', `${message.sender}님이 입장하셨습니다.`, message.sender === name ? 'me' : 'other', 'state', message.regdate, message.thumb)
        } else if (message.code === '2'){
            participants = participants.filter(participant => participant !== message.sender);
            displayList(participants);
            print('[system]', `${message.sender}님이 퇴장하셨습니다.`, message.sender === name ? 'me' : 'other', 'state', message.regdate, message.thumb)
        } else if (message.code === '3'){
            print(message.sender, message.content, message.sender === name ? 'me' : 'other', 'msg', message.regdate, message.thumb)
        }
    }
}

// 퇴장 유저 서버에 전송
window.onbeforeunload = () => {
    if(!disConnectUser){
        disconnect(name);
    }
}
function disconnect(name){
    if(ws && ws.readyState === WebSocket.OPEN){
        let message = {
            code: '2',
            sender: name,
            receiver: '',
            content: '',
            regdate: new Date().toLocaleString()
        };
        ws.send(JSON.stringify(message));
    }
}


// 대화창 내용
function print(name, msg, side, state, time, thumb){
    let user = `
        <div class="user-thumb">
            <img src="https://api.dicebear.com/9.x/thumbs/svg?seed=${name}" alt="user">
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

//참가자명단 상단에 표시
const userList = document.querySelector('.user-name');
const userRate = document.querySelector('.user-id');
function displayList(name){
    userList.textContent = name.join();
    userRate.textContent = `${name.length}명`;
}