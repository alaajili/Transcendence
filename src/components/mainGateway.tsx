import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Challenge from "../Game/Challenge";
import Apollo from "../assets/Apollo.jpg";
import React from "react";
import "../styles/CustomNotification.css";

const socket = io("http://localhost:3000/user", {
    withCredentials: true,
});

const setOnline = async () => {
    socket.on("connect", () => {
        console.log("connected");
    });
};

const setOffline = () => {
    socket.on("disconnect", () => {
        console.log("disconnected");
    });
};

const wrongpasswordnotify = () =>
    toast.error(`😫 Wrong password!`, {
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

const CustomNotification: React.FC<NotificationData> = ({
    senderName,
}) => {
    return (
        <div className="container-1 px-[1.5vw] py-[1vw] flex flex-col gap-[1.2vw] w-full">
            <div className="flex items-center justify-center gap-[1vw]">
                <img
                    src={Apollo}
                    alt="Avatar"
                    className="w-[3.5vw] h-[3.5vw] rounded-full"
                />
                <h3 className="font-satoshi font-medium text-[1vw] leading-7">
                    {senderName} wants to play a game with you!
                    <br />
                    <strong>Would you like to play?</strong>
                </h3>
            </div>
            <div className="flex items-center justify-between px[2vw] gap-[1vw]">
                <button className="hover:scale-105 text-white font-bold font-satoshi w-[10vw] h-[3vw] container-1 text-[1vw]">
                    Naaah, I'm Good
                </button>
                <button className="hover:scale-105 text-white font-bold font-satoshi w-[10vw] h-[3vw] container-1 text-[1vw]">
                    Yeah, Why Not
                </button>
            </div>
        </div>
    );
};

const gameRequestNotify = (username: string) =>
    toast(<CustomNotification senderName={`${username}`} />, {
        position: "top-left",
        autoClose: 20000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
        className:"w-[28vw] flex items-center justify-center"
    });

const setInGame = () => {
    socket.on("inGame", () => {
        console.log("inGame");
    });
};

const recieveNotification = () => {
    socket.on("notification", (data) => {
        console.log(data);
    });
    socket?.on("wrongpassword", () => {
        wrongpasswordnotify();
    });
    socket?.on("challenge", (data) => {
        console.log("Challenge user: ", data);
        gameRequestNotify("alaajili");
    });
};

export { setOnline, recieveNotification };
