
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { SocketDataContext } from '../../context/SocketContext';
const Scanning = () => {
  const { socket } = useContext(SocketDataContext);
  const [progress, setprogress] = useState("Loading Scan...");
  const [message, setmessage] = useState("")
  socket.on('progress', (data) => {
    setprogress(data);
  })
  socket.on('newZapMessages', (data) => {
    setmessage(data);
  })
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* Bouncing Ball Animation */}
      <motion.div
        className="w-10 h-10 bg-blue-500 rounded-full"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      />

      {/* Loading Text Animation */}
      <motion.h1
        className="mt-5 text-2xl font-bold"
        animate={{ opacity: [0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        {progress}
      </motion.h1>
      <motion.h1
        className="mt-5 text-xl font-bold"
        animate={{ opacity: [0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        {message}
      </motion.h1>
    </div>
  );
};

export default Scanning;
