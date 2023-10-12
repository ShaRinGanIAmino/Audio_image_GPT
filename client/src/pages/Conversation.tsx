import { useEffect, useState } from "react";
import { upload, send, sound, profile } from "../assets";
import { BotBubbleChat, UserBubbleChat, Upload } from "../components";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import * as vmsg from "vmsg";

type ChatItem = {
  type: "user" | "bot";
  text: string;
  audioBlob?: Blob; // Add audioBlob as an optional property
};

const Conversation: React.FC = () => {
  const [UploadModal, setUploadModal] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [recorder, setRecorder] = useState<vmsg.Recorder | null>(null);

  const startRecording = async () => {
    try {
      const recorderInstance = new vmsg.Recorder({
        wasmURL: "../../node_modules/vmsg/vmsg.wasm",
      }); // Provide the path to vmsg.wasm
      await recorderInstance.initAudio();
      await recorderInstance.initWorker();
      recorderInstance.startRecording();
      setIsRecording(true);
      setRecorder(recorderInstance);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    if (!recorder) return;
    const recordingBlob = await recorder.stopRecording();
    setBlob(recordingBlob);
    setIsRecording(false);
    setRecorder(null);
    const chatItem: ChatItem = {
      type: "user",
      text: message,
      audioBlob: recordingBlob,
    };

    setChatHistory((prevChatHistory) => [...prevChatHistory, chatItem]);
    handleAudioTranscription(recordingBlob);
  };

  console.log(blob);

  const handleAudioTranscription = async (audioBlob: Blob) => {
    if (!audioBlob) return;

    // Create a FormData object to send the blob as a file
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.mpeg"); // Assuming the blob is in MPEG format

    try {
      // Make a POST request to your FastAPI endpoint
      const response = await axios.post(
        "http://localhost:8000/uploadsound/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );

      // Handle the response here, which contains the transcribed text
      if (response.data.text) {
        setMessage((prevMessage) => prevMessage + response.data.text);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const handleUploadSuccess = (data: any) => {
    setMessage((prevMessage) => prevMessage + data);
    // Do whatever you need with the data in your parent component
  };

  useEffect(() => {
    // Log uploadedData whenever it changes
    console.log(message);
  }, [message]);

  const navigate = useNavigate();
  const handleClearLocalStorage = () => {
    localStorage.clear();
    navigate("/sign-in/*");
  };

  const handleOpenPopup = () => {
    setUploadModal(true);
  };
  const handleClosePopup = () => {
    setUploadModal(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (message.trim() === "") {
      toast.error("Please enter text .", {
        position: "top-center",
      });
      return;
    }

    const url = "http://localhost:3001/chat ";
    axios
      .post(url, {
        text: message,
      })
      .then(function (response) {
        console.log(response);

        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { type: "user", text: message },
        ]);

        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { type: "bot", text: response.data },
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
    setMessage("");
  };

  const user = useUser();
  console.log(chatHistory);

  return (
    <section className=" bg-bg w-screen h-screen flex justify-center items-center">
      <ToastContainer />
      <section className=" rounded-xl bg-white shadow-lg h-[95%] ss:h-[90%] md:w-[70%] w-[90%] ">
        <div className="border-border border-b-[1px] h-[15%] rounded-t-xl flex justify-center items-center">
          <div className=" w-[90%] h-[80%] rounded-xl flex gap-8 justify-start items-center">
            <img
              src={user.user?.profileImageUrl}
              alt="profile"
              className="w-[50px] h-[50px] rounded-full"
            />
            <p
              className=" font-poppins text-lg text-typo cursor-pointer"
              onClick={handleClearLocalStorage}
            >
              Welcome,{" "}
              {(user.isLoaded && user.isSignedIn && user.user)!
                ? user.user?.fullName
                : "Loading"}
              !
            </p>
          </div>
        </div>
        <div className="h-[70%] flex justify-center items-start overflow-y-auto">
          <div className=" w-[90%] flex flex-col gap-4 py-4 justify-center items-center ">
            {chatHistory.map((item, index) =>
              item.type === "user" ? (
                <UserBubbleChat
                  key={index}
                  text={item.text}
                  audioBlob={item.audioBlob}
                />
              ) : (
                <BotBubbleChat key={index} text={item.text} />
              )
            )}
          </div>
        </div>
        <div className="h-[15%] rounded-b-xl flex justify-center items-center mb-2">
          <div className=" w-[90%] h-[80%] rounded-xl bg-bg_user flex items-center justify-between px-5 gap-4">
            <input
              type="text"
              className=" bg-bg_user outline-none w-[50%] ss:w-[80%] h-full text-typo"
              placeholder="ask me about something ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className=" flex gap-2 ss:gap-4 justify-center items-center ">
              <button className=" bg-white rounded-lg shadow-md p-3">
                <img
                  src={upload}
                  alt="upload"
                  className=" w-[30px] h-[30px]"
                  onClick={() => {
                    handleOpenPopup();
                  }}
                />
                {UploadModal && (
                  <Upload
                    onClose={handleClosePopup}
                    onUploadSuccess={handleUploadSuccess}
                  />
                )}
              </button>
              <button
                className={`bg-white rounded-lg shadow-md p-3 ${
                  isRecording ? "border-red-500 border-2" : ""
                }`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <img
                  src={sound}
                  alt="sound"
                  className={` w-[30px] h-[30px] `}
                />
              </button>
              <button
                onClick={handleSubmit}
                className=" bg-white rounded-lg shadow-md p-3"
              >
                <img src={send} alt="send" className=" w-[30px] h-[30px]" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Conversation;
