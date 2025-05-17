const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnection = require("./database/dbConnection");
const { userRouter } = require("./Routes/user.route");
const { courseRouter } = require("./Routes/course.route");
const { mediaRouter } = require("./Routes/media.route");
const { razorPayRouter } = require("./Routes/payment.route");
const { courseProgressRouter } = require("./Routes/courseProgress.route");
// const razorPayRouter = require("./Routes/razorPay.route");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
  })
);

//API's
app.use("/api/media", mediaRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/razorpay", razorPayRouter);
app.use("/api/progress", courseProgressRouter);

app.get("/api/config/razorpay", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

app.listen(PORT, async () => {
  try {
    console.log(`Server is running at PORT ${PORT}`);
    await dbConnection;
    console.log("Connected to DB !!");
  } catch (error) {
    console.log({ err: error });
  }
});
