import "./configs/db.js";
import express from "express";
const app = express();
import routes from "./routes/routes.js";
const PORT = 5000;

app.use(express.json());

app.use("/",routes)

app.listen(PORT, () => console.log(`listening to port ${PORT}`));