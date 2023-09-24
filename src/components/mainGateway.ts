import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/user", {
    withCredentials: true,
});
const setOnline = async () => {
    socket.on("connect", () => {
        console.log("connected");
    });
};

const setOffline = () => {
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
}
const wrongpasswordnotify = () => toast.error(`😫 Wrong password!`, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    });

const setInGame = () => {
    socket.on('inGame', () => {
        console.log('inGame')
    })
}


const recieveNotification = () => {
    socket.on("notification", (data) => {
        console.log(data);
    });
    socket?.on("wrongpassword", () => {
        wrongpasswordnotify();
    })
};

export { setOnline, recieveNotification };
