import Apollo from "../assets/Apollo.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface room {
    name: string;
    img: string;
    member_size: number;
    id: number;
    status: string;
    password: string;
}

interface joinroominter{
    id: number;
    password: string;
    status: string;
}

const PublicChannel = ({ name, img, member_size, id, status, password}: room) => {
    const navigate = useNavigate()
    const joinroom = async (data: joinroominter) => {
        const res = await axios.post("http://localhost:3000/chat/joinroom", data, {
            withCredentials: true,
        });
        if (res.status == 200)
            console.log("YOU ARE JOIND THE ROOM");
    else
        console.log("ERROR BTICH");
    navigate('/chat');
    }
    return (
        <div className="channel-div mt-[1vw] max-sm:mt-[2.5vw] max-md:mt-[2vw] max-lg:mt-[2vw] flex justify-between container-1 px-[1.5vw] py-[.5vw] max-sm:py-[1vh] max-md:py-[1vh] max-lg:py-[1vh] items-center">
            <div className="flex items-center gap-5 max-sm:gap-[1vw] max-md:gap-[1vw] max-lg:gap-[1vw]">
                <img
                    className="rounded-full w-[2vw] h-[2vw] max-sm:w-[7vw] max-sm:h-[7vw] max-md:w-[5vw] max-md:h-[5vw] max-lg:w-[3.5vw] max-lg:h-[3.5vw] mr-[.5vw]"
                    src={img}
                    alt="channel-pic"
                />
                <div className="flex flex-col items-start">
                    <h2 className="font-medium font-satoshi lowercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                        {name}
                    </h2>
                    <h3 className="font-normal font-satoshi lowercase text-[.7vw] max-sm:text-[1.1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh] opacity-70">
                        {member_size}
                    </h3>
                </div>
            </div>
            <button className="join-channel container-1 px-[2vw] py-[.3vw] uppercase font-bold hover:scale-105 text-[.7vw] max-sm:text-[1.1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]"
                onClick={()=>{
                    const data: joinroominter = {
                        id: id,
                        password: password,
                        status: status,
                    }
                    joinroom(data);
                }}
                
            >
                join
            </button>
        </div>
    );
};

export default PublicChannel;
