// socket connection
const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        url: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.onsubmit = function(event) {
    event.preventDefault();
    
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = event.target.elements.message;
    socket.emit('sendMessage', message.value, (error) => {
        
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error) {
            return console.log(error);
        }
        console.log('Message delivered');
    });
}

socket.on('sendMessage', (sendMessage) => {
    console.log(sendMessage)
})

$locationButton.onclick = () => {
    if(!navigator.geolocation){
        return alert('Geolocation not available.')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log('Location shared.')
        })
    });
}