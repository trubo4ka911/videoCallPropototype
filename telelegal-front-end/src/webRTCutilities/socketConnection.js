import { io } from "socket.io-client";

const socket = io.connect("https://localhost:9001");

export default socket;
