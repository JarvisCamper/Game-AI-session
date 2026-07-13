import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { registerConnectionGateway } from "./ws/connection.gateway";

const PORT = Number(process.env.WS_PORT ?? 4001);

const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

registerConnectionGateway(wss);

httpServer.listen(PORT, () => {
  console.log(`[ws-backend] listening on ws://localhost:${PORT}`);
});
