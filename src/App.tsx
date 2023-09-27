import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    Profile,
    Landing,
    Chat,
    ViewProfile,
    GameMode,
    Dashboard,
} from "./Pages/index";
import AddChannel from "./components/AddChannel";
import "./App.css";
import Game from "./Game/Game";
import { setOnline, recieveNotification } from "./components/mainGateway";
import Practice from "./Game/Practice";
import Spectate from "./Game/Spectate";
import { ToastContainer } from "react-toastify";
import Challenge from "./Game/Challenge";

const App = () => {
    setOnline();
    recieveNotification();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/gamemode" element={<GameMode />} />
                <Route path="/game" element={<Game />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/spectate" element={<Spectate />} />
                <Route path="/challenge" element={<Challenge />} />
                <Route path="/home" element={<Dashboard />} />
                <Route
                    path="/add-channel"
                    element={
                        <AddChannel
                            togglePopup={function (): void {
                                throw new Error("Function not implemented.");
                            }}
                            addChannel={function (_channelProps: {
                                name: string;
                                img: File | null;
                            }): void {
                                throw new Error("Function not implemented.");
                            }}
                            />
                        }
                />
                <Route path="/view-profile" element={<ViewProfile />} />
            </Routes>
                        <ToastContainer />
        </BrowserRouter>
    );
};

export default App;
