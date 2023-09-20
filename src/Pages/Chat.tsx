import Apollo from "../assets/Apollo.jpg";
import noChat from "../assets/no-chat.svg";
import {
    BsCurrencyRupee,
    BsFillLightningChargeFill,
    BsFillVolumeMuteFill,
    BsPersonFillDash,
    BsPersonFillSlash,
    BsSendFill,
} from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { MessageContainer, AddChannel, Member, AddFriend } from "./index";
import { Socket, io } from "socket.io-client";
import axios from "axios";
import "../styles/AddChannel.css";
import "../styles/Chat.css";
import { useNavigate } from "react-router-dom";
import { alertClasses } from "@mui/material";

interface messagedto {
    message: string;
    isSentByMe: boolean;
    img: string;
    sender: number;
}
interface MemberProps {
    username: string;
    img: string;
    isAdmin: boolean;
    id: number;
    roomid: number;
}
interface intersetchannel {
    name: string;
    img: string | File;
    id: number;
    status: string;
    password: string;
}
interface intermessages {
    message: string;
    isSentByMe: boolean;
    img: string;
}
interface kickuser {
    id: number;
    roomid: number;
}
const Chat = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [channels, setChannels] = useState<intersetchannel[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<intermessages[]>([]);
    const [member, setMember] = useState<MemberProps[]>([]);
    const [selectedChannel, setSelectedChannel] =
        useState<intersetchannel | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleArrowClick = async () => {
        if (inputValue.trim() !== "") {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: inputValue.trim(),
                    isSentByMe: true,
                    img: "",
                },
            ]);
            setInputValue("");
            const dto = {
                id: selectedChannel?.id,
                message: inputValue.trim(),
                sender: await whoami(),
            };
            const r = socket?.emit("createMessage", dto, {
                withCredentials: true,
            });
            console.log("value of r is->", r);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleArrowClick();
        }
    };

    const addChannel = async (currentChannel: intersetchannel) => {
        console.log(currentChannel);
        const newChannel = [...channels, currentChannel];
        try {
            const formData = new FormData();
            formData.append("file", currentChannel.img);
            formData.append("name", currentChannel.name);
            if (currentChannel.password) {
                formData.append("password", currentChannel.password);
                formData.append("status", currentChannel.status);
            }
            await axios.post("http://localhost:3000/chat/new", formData, {
                withCredentials: true,
            });
        } catch (error) {
            console.log(error);
        }
        setChannels(newChannel);
    };

    const [popup, setPopup] = useState(false);
    const [addFriendPopup, setAddFriendPopup] = useState(false);
    const togglePopup = () => {
        setPopup(!popup);
    };
    const toggleAddFriendPopup = () => {
        setAddFriendPopup(!addFriendPopup);
    };

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    async function getRoomChannels() {
        try {
            const response = await axios.get(
                "http://localhost:3000/users/me/chatrooms",
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    async function getChannelmsg(id: any) {
        try {
            const res = await axios.get(
                "http://localhost:3000/chat/getroomsmsg?id=" + id,
                {
                    withCredentials: true,
                }
            );
            return res.data;
        } catch (error) {
            alert("error in getting channels rooms");
        }
    }
    async function getdminfos(id: number) {
        try {
            const res = await axios.get(
                "http://localhost:3000/chat/getdminfos?id=" + id,
                {
                    withCredentials: true,
                }
            );
            const room = {
                name: res.data.name,
                img: res.data.photo,
                id: res.data.id,
            };
            return room;
        } catch {
            alert("error in getting dm infos");
        }
    }
    const Getmyrooms = async () => {
        const rooms = await getRoomChannels();
        let newchannel: any[] = [];
        let room;
        rooms.forEach(async (element: any) => {
            if (element.isdm !== true) {
                room = {
                    name: element.name,
                    img: element.photo,
                    id: element.id,
                };
                newchannel = [...newchannel, room];
                setChannels(newchannel);
            } else {
                const dm = await getdminfos(element.id);
                newchannel = [...newchannel, dm];
                setChannels(newchannel);
            }
        });
    };
    useEffect(() => {
        Getmyrooms();
    }, [socket]);
    useEffect(() => {
        // Scroll to the bottom when a new message is added
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    //-------------------------------------------casper-------------------------------------//

    useEffect(() => {
        async function getandSetmsgchannel() {
            if (selectedChannel?.id !== undefined) {
                const id: number = await whoami();
                let messages: {
                    message: string;
                    isSentByMe: boolean;
                    img: string;
                }[] = [];
                const messagesres = await getChannelmsg(selectedChannel?.id);
                const msgs = messagesres;
                for (let i = 0; i < msgs.length; i++) {
                    if (msgs[i].senderId == id) {
                        messages = [
                            ...messages,
                            {
                                message: msgs[i].content,
                                isSentByMe: true,
                                img: "",
                            },
                        ];
                    } else {
                        messages = [
                            ...messages,
                            {
                                message: msgs[i].content,
                                isSentByMe: false,
                                img:
                                    "http://localhost:3000/" +
                                    msgs[i].senderId +
                                    ".png",
                            },
                        ];
                    }
                }
                setMessages(messages);
            }
        }
        getandSetmsgchannel();
    }, [selectedChannel]);

    const socketRef = useRef<Socket | null>(null);
    async function whoami() {
        try {
            const me = await axios.get("http://localhost:3000/users/me", {
                withCredentials: true,
            });
            return me.data.id;
        } catch (error) {
            alert("error in whoiam");
        }
    }

    useEffect(() => {
        if (socketRef.current === null) {
            socketRef.current = io("http://localhost:3000", {
                withCredentials: true,
            });
            setSocket(socketRef.current);
        }
        const ret = socket?.on("newmessage", async (dto: messagedto) => {
            console.log("GOT HERE");
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: dto.message,
                    isSentByMe: false,
                    img: "http://localhost:3000/" + dto.sender + ".png",
                },
            ]);
        });
        socket?.on("kick", async (dto: kickuser) => {
            if (selectedChannel?.id == dto.roomid) {
               alert("You have been kicked from the room");
                // location.reload();
            }
        });
        socket?.on("error", async (val: string)=> {
            alert(val);
        })
    }, [selectedChannel]);
    async function getmemeberoom(roomID: number) {
        const res = await axios.get(
            "http://localhost:3000/chat/roomMemebers?id=" + roomID,
            {
                withCredentials: true,
            }
        );
        return res.data;
    }
    const setMembers = async () => {
        let getmember: any;
        if (selectedChannel?.id != undefined) {
            getmember = await getmemeberoom(selectedChannel?.id);
            const classSystem = new Map<string, number>([
                ["NORMAL", 0],
                ["ADMIN", 1],
                ["OWNER", 2],
            ]);
            let members: MemberProps[] = [];
            const me: number = await whoami();
            let mystatus: string;
            getmember.roomUsers.find((element: any) => {
                if (element.userId == me) mystatus = element.status;
            });
            getmember.members.forEach(
                (element: { username: string; id: number }) => {
                    const newmember: MemberProps = {
                        id: element.id,
                        username: element.username,
                        img: "http://localhost:3000/" + element.id + ".png",
                        isAdmin: me != element.id ? true : false,
                        roomid: selectedChannel.id,
                    };
                    let userclassSystem: string = "NORMAL";
                    getmember.roomUsers.find((roomuser: any) => {
                        if (roomuser.userId == element.id)
                            userclassSystem = roomuser.status;
                    });
                    if (
                        me !== element.id &&
                        classSystem.get(userclassSystem)! >
                            classSystem.get(mystatus)!
                    )
                        newmember.isAdmin = false;
                    members = [...members, newmember];
                }
            );
            setMember(members);
        }
    };
    useEffect(() => {
        setMembers();
    }, [selectedChannel]);
    return (
        <div className="parent flex flex-row justify-center items-center gap-[1vw] h-screen max-sm:flex-col max-md:flex-col">
            <div className="child-container-1">
                <div className="container-1 font-satoshi text-white w-[18vw] h-[90vh] max-sm:w-[80vw] max-sm:h-[45vh] max-md:w-[80vw] max-md:h-[45vh] flex flex-col justify-center items-center relative">
                    <h3 className="absolute top-[3vh] max-sm:top-[1.8vh] max-md:top-[1.8vh] uppercase font-bold text-[1vw] max-sm:text-[2vw] max-md:text-[1.4vw]">
                        Conversations
                    </h3>
                    <span className="line absolute top-[8vh] max-sm:top-[5vh] max-md:top-[5vh]"></span>
                    <span className="line absolute bottom-[9vh] max-sm:bottom-[5vh] max-md:bottom-[5vh]"></span>
                    <a onClick={togglePopup}>
                        <span className="plus-icon w-[3vw] h-[3vw] max-sm:w-[5vw] max-sm:h-[5vw] max-md:w-[4vw] max-md:h-[4vw] rounded-full absolute bottom-[2vh] right-[1.5vw] max-sm:bottom-[1vh] max-sm:right-[3vw] max-md:bottom-[1vh] max-md:right-[2vw] flex justify-center items-center cursor-pointer">
                            <FiPlus className="text-[1.2vw] max-sm:text-[2vw] max-md:text-[2vw]" />
                        </span>
                    </a>
                    <div className="red-divs h-[72.5vh] max-sm:h-[35vh] max-md:h-[35vh] mb-[1vh] max-sm:mt-[1vh] max-md:mt-[1vh] w-full overflow-y-scroll no-scrollbar overflow-hidden">
                        {channels.map((channel, idx) => (
                            <div
                                key={idx}
                                className={`channel flex relative top-0 items-center px-[1vw] max-sm:px-[3vw] max-md:px-[3vw] scroll-auto h-[8vh] max-sm:h-[5vh] max-md:h-[5vh] hover:cursor-pointer ${
                                    selectedChannel === channel
                                        ? "active-channel"
                                        : ""
                                }`}
                                onClick={() => setSelectedChannel(channel)}
                            >
                                <img
                                    className="w-[2.5vw] h-[2.5vw] max-sm:w-[6vw] max-sm:h-[6vw] max-md:w-[4vw] max-md:h-[4vw] rounded-full object-cover"
                                    src={
                                        typeof channel.img === "string"
                                            ? channel.img
                                            : URL.createObjectURL(channel.img)
                                    }
                                    alt="Apollo"
                                />
                                <h4 className="font-medium ml-[.6vw] text-[1vw] max-sm:ml-[2vw] max-sm:text-[2vw] max-md:ml-[1.5vw] max-md:text-[1.4vw]">
                                    {channel.name}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedChannel ? (
                <div className="child-container-2">
                    <div className="container-2 font-satoshi text-white w-[65vw] h-[90vh] max-sm:w-[80vw] max-sm:h-[45vh] max-md:w-[80vw] max-md:h-[45vh] flex flex-col justify-center items-start relative overflow-hidden">
                        <img
                            className="w-[2.5vw] h-[2.5vw] max-sm:w-[6vw] max-sm:h-[6vw] max-md:w-[4vw] max-md:h-[4vw] rounded-full absolute top-[2vh] max-sm:top-[1vh] max-md:top-[1vh] left-[2vw] max-sm:left-[3vw] max-md:left-[3vw] object-cover"
                            src={
                                typeof selectedChannel?.img === "string"
                                    ? selectedChannel?.img
                                    : URL.createObjectURL(selectedChannel?.img)
                            }
                            alt="Apollo"
                        />
                        <h3 className="absolute top-[3vh] max-sm:top-[1.8vh] max-md:top-[1.8vh] font-bold left-[5.5vw] max-sm:left-[11vw] max-md:left-[8vw] text-[1vw] max-sm:text-[2vw] max-md:text-[1.4vw]">
                            {selectedChannel.name}
                        </h3>

                        <div className="menu--right" role="navigation">
                            <div className="menuToggle relative h-[90vh]">
                                <input type="checkbox" />
                                <p className="members-text font-satoshi font-medium uppercase text-[1vw]">
                                    members
                                </p>
                                <span></span>
                                <span></span>
                                <span></span>
                                <ul className="menuItem member-menu absolute w-[30vw] h-[91vh] pt-[3vw] pr-[9vw] pl-[1vw]">
                                    <li className="overflow-y-scroll no-scrollbar mt-[3.3vh] pb-[2.5vh] h-[72.4vh]">
                                        {member.map(
                                            (user: MemberProps, idx) => (
                                                <Member
                                                    username={user.username}
                                                    img={user.img}
                                                    isAdmin={user.isAdmin}
                                                    id={user.id}
                                                    socket={socket}
                                                    roomid={user.roomid}
                                                    key={idx}
                                                />
                                            )
                                        )}
                                    </li>
                                    <div className="line absolute bottom[9.5vh]"></div>
                                    <a onClick={toggleAddFriendPopup}>
                                        <div className="plus-icon w-[3vw] h-[3vw] max-sm:w-[5vw] max-sm:h-[5vw] max-md:w-[4vw] max-md:h-[4vw] rounded-full absolute bottom-[2vh] right-[10vw] max-sm:bottom-[1vh] max-sm:right-[3vw] max-md:bottom-[1vh] max-md:right-[2vw] flex justify-center items-center cursor-pointer">
                                            <FiPlus className="text-[1.2vw] max-sm:text-[2vw] max-md:text-[2vw]" />
                                        </div>
                                    </a>
                                </ul>
                            </div>
                        </div>
                        {addFriendPopup && (
                            <AddFriend
                                toggleAddFriendPopup={toggleAddFriendPopup}
                            />
                        )}
                        <span className="line absolute top-[8vh] max-sm:top-[5vh] max-md:top-[5vh]"></span>
                        <span className="line absolute bottom-[9vh] max-sm:bottom-[5vh] max-md:bottom-[5vh]"></span>
                        <div className="h-[72.5vh] max-sm:h-[35vh] max-md:h-[35vh] w-full mb-[1vh] max-sm:mb-0 max-md:mb-0 px-[1.5vw] overflow-y-scroll no-scrollbar overflow-hidden">
                            <div
                                className="max-h-[72.5vh] max-sm:max-h-[35vh] max-md:max-h-[35vh] overflow-y-scroll no-scrollbar overflow-hidden"
                                ref={messagesContainerRef}
                            >
                                {messages.map((message, idx) => (
                                    <MessageContainer
                                        key={idx}
                                        message={message.message}
                                        isSentByMe={message.isSentByMe}
                                        img={message.img}
                                    />
                                ))}
                            </div>
                        </div>
                        <input
                            placeholder="Type your message here..."
                            type="text"
                            maxLength={250}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="w-[57.5vw] max-sm:w-[70vw] max-md:w-[70vw] rounded-[.5vw] input-container outline-none resize px-[1vw] h-[5.5vh] max-sm:px-[1vw] max-sm:h-[3vh] max-md:px-[1vw] max-md:h-[3vh] absolute bottom-[1.7vh] max-sm:bottom-[1vh] max-md:bottom-[1vh] left-[1.5vw] text-[1vw] max-sm:text-[1.5vw] max-md:text-[1.4vw]"
                        />
                        <span
                            className="input-container w-[3.5vw] h-[5.5vh] max-sm:w-[6vw] max-sm:h-[3vh] max-md:w-[6vw] max-md:h-[3vh] rounded-[.5vw] flex justify-center items-center absolute right-[1.5vw] bottom-[1.7vh] max-sm:bottom-[1vh] max-md:bottom-[1vh] cursor-pointer"
                            onClick={handleArrowClick}
                        >
                            <BsSendFill className="check-icon text-[1vw] max-sm:text-[2vw] max-md:text-[1.4vw]" />
                        </span>
                    </div>
                </div>
            ) : (
                <div className="child-container-2">
                    <div className="container-2 font-satoshi text-white w-[65vw] h-[90vh] max-sm:w-[80vw] max-sm:h-[45vh] max-md:w-[80vw] max-md:h-[45vh] flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="flex flex-col w-[30vw] p-[2vw] max-sm:w-[50vw] max-sm:h-[50vh] max-md:w-[40vw] max-md:h-[40vh] justify-center items-center object-cover overflow-hidden">
                            <img
                                src={noChat}
                                alt="nochat"
                                className="opacity-75"
                            />
                            <h1 className="font-normal font-satoshi text-center uppercase text-[1vw] max-sm:text-[2vw] max-md:text-[1.4vw]">
                                OPS! There's no channel at this moment. <br />
                                Please consider creating one by clicking on the{" "}
                                <span className="font-black"> [ + ] </span>
                                on your{" "}
                                <span className="font-black underline">
                                    left sidebar.
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>
            )}
            {popup && (
                <AddChannel togglePopup={togglePopup} addChannel={addChannel} />
            )}
        </div>
    );
};

export default Chat;
