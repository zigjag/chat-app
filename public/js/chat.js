const socket = io();

socket.on('message', (message) => {
    console.log(message);
})

document.querySelector('form').onsubmit = function(event) {
    event.preventDefault();
    const message = event.target.elements.message;
    socket.emit('sendMessage', message.value);
}

socket.on('sendMessage', (sendMessage) => {
    console.log(sendMessage)
})

document.querySelector('#send-location').onclick = () => {
    if(!navigator.geolocation){
        return alert('Geolocation not available.')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    });
}
