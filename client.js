import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
 const [localStream, setLocalStream] = useState(null);
 const [remoteStream, setRemoteStream] = useState(null);
 const localVideoRef = useRef(null);
 const remoteVideoRef = useRef(null);

 useEffect(() => {
  // Get the user's media devices (camera and microphone)
  navigator.mediaDevices
   .getUserMedia({ video: true, audio: true })
   .then((stream) => {
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;
   })
   .catch((error) => {
    console.error("Error accessing media devices:", error);
   });

  // Handle incoming video call from the server
  socket.on("incoming_video_call", (fromSocketId) => {
   answerVideoCall(fromSocketId);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
   console.log("Disconnected from the server.");
   if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
   }
   if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
   }
  });

  // Clean up on component unmount
  return () => {
   if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
   }
   if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
   }
   socket.disconnect();
  };
 }, []);

 const startVideoCall = () => {
  socket.emit("start_video_call");
 };

 const answerVideoCall = (fromSocketId) => {
  navigator.mediaDevices
   .getUserMedia({ video: true, audio: true })
   .then((stream) => {
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;

    socket.emit("answer_video_call", fromSocketId);
   })
   .catch((error) => {
    console.error("Error accessing media devices:", error);
   });
 };

 return (
  <div className="App">
   <div className="video-container">
    <video ref={localVideoRef} autoPlay muted playsInline />
    {remoteStream && <video ref={remoteVideoRef} autoPlay playsInline />}
   </div>
   <div className="controls">
    <button onClick={startVideoCall}>Start Video Call</button>
   </div>
  </div>
 );
}

export default App;
