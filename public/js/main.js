const msgInput = document.getElementById('inputMsg');
const outputMsg = document.querySelector('.outputMsg');
const form = document.getElementById('myForm');
const roomName = document.getElementById('room-name');
const roomUsersList = document.getElementById('users');

const { name, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
    roomUsersList.innerHTML = `
    ${users.map(user => `<li>${user.name}</li>`).join('')}
    `; 
}

function showMsgOutput(name, time, msg, position) {
    const div = document.createElement('div');
    div.innerHTML = `
    <strong style="color: rgb(0, 140, 255);"><b>${name} ${time}</b></strong>
    <p>${msg}</p>
    `;
    div.classList.add('card')
    div.classList.add(position);

    outputMsg.append(div);

    outputMsg.scrollTop = outputMsg.scrollHeight
}

const socket = io('http://localhost:3000');

socket.emit('join-room', { name, room })

socket.on('roomUsers', ({ room,users }) => {
    outputRoomName(room);
    outputUsers(users);
});


socket.emit('new-user-Join');

form.addEventListener('submit', e => {
    const message = msgInput.value;

    if (message == '') {
        e.preventDefault();
        msgInput.focus();
    } else {
        e.preventDefault();
        socket.emit('chatMsg', message);
        showMsgOutput('You', '', message, 'right');
        msgInput.value = '';
        msgInput.focus();
    }
});

socket.on('message', (data) => {
    showMsgOutput(data.name, data.time, data.msg, 'left')
});


