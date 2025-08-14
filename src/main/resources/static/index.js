const connectBtn = document.querySelector('.btn-connect');

connectBtn.addEventListener('click', e=>{
    let userName = document.querySelector('#user-name').value;
    if(userName !== null && userName !== ''){
        let child = window.open(`chat.html?username=${userName}`, 'chat');
        // child.addEventListener('load', e=>{
        //     console.log(child)
        //     child.connectUser(userName);
        // });
    }
});

let userName = document.querySelector('#user-name');
userName.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){
        connectBtn.click();
    }
})