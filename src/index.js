import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
dotenv.config({ path: "/.env" });
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Hurray!! app is litening at PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(`MongoDb connection faild ${err}`));
