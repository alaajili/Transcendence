import {
    BsFillLightningChargeFill,
    BsFillVolumeMuteFill,
    BsPersonFillDash,
    BsPersonFillSlash,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";

interface MemberProps {
    username: string;
    img: string;
    isAdmin: boolean;
    id: number;
    socket: Socket | null
    roomid: number
}

const Member = ({ username, img, isAdmin, id, roomid, socket }: MemberProps) => {
    const kickuser = async ()=> {
        const dto = {
            id: id,
            roomid: roomid,
        }
        const ret = socket?.emit("kickuser", dto, {
            withCredentials: true,
        })
        console.log(ret);
    }
    const banuser = async ()=> {
        const dto = {
            id: id,
            roomid: roomid,
        }
        const ret = socket?.emit("banuser", dto, {
            withCredentials: true,
        })
        console.log(ret);
    }
    return (
        <div className="container-1 flex justify-between items-center p-[.6vw] mt-[.5vw]">
            <Link to={`/view-profile?id=${id}`}>
                <div className="flex justify-between items-center gap-[.6vw] max-sm:gap-[2vw] max-md:gap-[2vw] max-lg:gap-[2vw]">
                    <img
                        className="w-[2.5vw] h-[2.5vw] max-sm:w-[7vw] max-sm:h-[7vw] max-md:w-[4vw] max-md:h-[4vw] max-lg:w-[4vw] max-lg:h-[4vw] rounded-full"
                        src={img}
                    />
                    <p className="font-satoshi font-medium hover:underline text-[.9vw] max-sm:text-[1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]">
                        {username}
                    </p>
                </div>
            </Link>
            {isAdmin && (
                <div className="flex items-center justify-center gap-[.8vw]">
                    <button>
                        <BsFillVolumeMuteFill
                            className="text-[1.8vw] p-1 cursor-pointer"
                            title="mute"
                            />
                    </button>
                    <button>
                        <BsPersonFillSlash
                            className="text-[1.5vw] p-1 cursor-pointer"
                            onClick={kickuser}
                            title="kick"
                        />
                    </button>
                    <button>
                        <BsPersonFillDash
                            className="text-[1.5vw] p-1 cursor-pointer"
                            onClick={banuser}
                            title="ban"
                        />
                    </button>
                    <button>
                        <BsFillLightningChargeFill
                            className="text-[1.5vw] p-1 cursor-pointer"
                            title="set as admin"
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Member;
