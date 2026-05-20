import { io } from "socket.io-client";

export const socket = io(
  "https://kitchenflo-backend.onrender.com",
  {
    transports: ["websocket"],
  }
);