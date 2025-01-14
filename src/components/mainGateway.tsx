import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Challenge from "../Game/Challenge";
import Apollo from "../assets/Apollo.jpg";
import React, { useEffect } from "react";
import "../styles/CustomNotification.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const missingPlayerNotify = () =>
    toast(`😫 Opps, Your opponent is missing!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
});

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
    senderPhoto: string;
    senderId: number
    // onAccept: () => void;
    // onDecline: () => void;
}



const CustomNotification: React.FC<NotificationData> = ({
    senderName,
    senderPhoto,
    senderId,
}) => {

    const navigate  = useNavigate()

    const accept = () => {
        toast.dismiss();
        navigate(`/challenge?opp=${senderId}&num=2`);
    }

    const decline = () => {
        toast.dismiss();
        const gameSock = io("http://localhost:3000/game", {
            withCredentials: true,
        });
        gameSock.emit('reject', senderId)
        const disconnectWebSocket = () => {
            gameSock.disconnect();
        };
        return disconnectWebSocket;
    }
    const handleDecline = () => {
        const disconnect = decline();
        disconnect();
    }

    return (
        <div className="container-1 px-[1.5vw] py-[1vw] flex flex-col gap-[1.2vw] w-full">
            <div className="flex items-center justify-center gap-[1vw]">
                <img
                    src={senderPhoto}
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
                <button
                    onClick={decline}
                    className="hover:scale-105 text-white font-bold font-satoshi w-[10vw] h-[3vw] container-1 text-[1vw]"
                >
                    Naaah, I'm Good
                </button>
                <button
                    onClick={accept}
                    className="hover:scale-105 text-white font-bold font-satoshi w-[10vw] h-[3vw] container-1 text-[1vw]"
                >
                    Yeah, Why Not
                </button>
            </div>
        </div>
    );
};

const gameRequestNotify = (username: string, photo: string, id: number) =>
    toast(<CustomNotification
        senderName={username}
        senderPhoto={photo} 
        senderId={id}
        // onAccept={() => accept(id)}

    />, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
        className:"w-[28vw] flex items-center justify-center"
    });

const Reject = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(-1);
    }, [])
    return (
        <>WAH A LYAM WAH</>
    )
}

const gameRejectNotify = () =>
    toast(<Reject />, {
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

const notify = (message: string) => {
    toast(message , {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
        className:"w-[28vw] flex items-center justify-center"
    });
}

const recieveNotification = () => {
    socket.on("notification", (data) => {
        console.log(data);
        notify(data.message)
    });
    socket?.on("wrongpassword", () => {
        wrongpasswordnotify();
    });
    socket?.on("challenge", (data: number) => {
        console.log("Challenge user: ", data);
        axios.get(
            `http://localhost:3000/users/userinfos?id=${data}`,
            { withCredentials: true }
        ).then((res) => {
            const data = res.data;
            gameRequestNotify(data.username, data.photo, data.id)
        })
    });
    socket.on('out', () => {
        missingPlayerNotify();
    })
    socket.on('rejected', () => {
        console.log('rejected');
        gameRejectNotify();
    })
};

export { setOnline, recieveNotification };
