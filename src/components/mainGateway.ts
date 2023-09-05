import { io, Socket } from 'socket.io-client'


// set user online and offline



const socket = io('http://localhost:3000/user', {
    withCredentials: true,
})
const setOnline = async () => {
    socket.on('connect', () => {
        console.log('connected')
    }
    )
}

const setOffline = () => {
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
}

const setInGame = () => {
    socket.on('inGame', () => {
        console.log('inGame')
    })
}


const recieveNotification = () => {
    socket.on('notification', (data) => {
        console.log(data)
    })
}



export {setOnline, recieveNotification}