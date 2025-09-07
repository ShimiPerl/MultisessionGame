import express from "express";
import cors from "cors";
import http from "http";
import { initSocket } from "./socket";
import multisessionRoutes from "./routes/multisessionRoutes";


const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

app.use(cors());
app.use(express.json());

app.use("/api/multisession", multisessionRoutes);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
