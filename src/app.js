import express from "express";
import cookieParser from "cookie-parser";
import { corsOptions } from "./constants.js";
import cors from "cors";

//=========== express app =======
const app = express();

//======== cors middelware ======
app.use(cors(corsOptions));

//======== json parser =========
app.use(express.json({ limit: "20kb" }));

//======== url encoded ========
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

//======== cookieparser ========
app.use(cookieParser());

//========= Middlewares for Media (🙄) =======
app.use(express.static("public"));

// =============== student route ================
import studentRoute from "./routes/student.route.js";

app.use("/student", studentRoute);

export { app };
