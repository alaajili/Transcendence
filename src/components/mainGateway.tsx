import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Challenge from "../Game/Challenge";
import Apollo from "../assets/Apollo.jpg"
import React from "react";
import '../styles/CustomNotification.css'


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
    theme: "dark",
});

interface NotificationData {
    senderName: string;
    // gameName: string;
    // senderPhoto: string;
  }

const CustomNotification: React.FC<NotificationData> = ({senderName}) => {
    return (
      <div className="custom-notification">
        <img src={Apollo} alt={`${senderName}'s Avatar`} />
        <div>
          <p>{senderName} wants to play a game with you!</p>
          <button >Accept</button>
          <button >Decline</button>
        </div>
      </div>
    );
}

const gameRequestNotify = (username: string) => toast.info(<CustomNotification senderName={`${username}`}/>, {
    position: "top-center",
    autoClose: 20000,
    hideProgressBar: true,
    draggable: true,
    theme: "dark",
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
    socket?.on('challenge', (data) => {
        console.log('Challenge user: ', data)
        gameRequestNotify('alaajili');
    })
};

export { setOnline, recieveNotification };
