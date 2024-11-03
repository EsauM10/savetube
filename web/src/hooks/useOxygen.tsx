import { io } from "socket.io-client";

const url = `http://localhost:15999`;
const socket = io(url);

window.addEventListener("beforeunload", () => socket.emit("onclose"));
window.resizeTo(720, 500);

export { socket };
