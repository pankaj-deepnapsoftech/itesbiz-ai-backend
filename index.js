const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv");
env.config();
const PORT = process.env.Port || 8015;
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const connectDb = require("./config/dbconfig");
const userRoute = require("./Routes/userRoute");
const otpRoute = require("./Routes/otpRoute");
const quoterouter = require("./Routes/quotesRoute");
const adminRoute = require("./Routes/adminRoute");
const employeeRoute = require("./Routes/empRoute");
const careerRoute = require("./Routes/careerRoutes");
const contactRoute = require("./Routes/contactRoute");
const rpRoute = require("./Routes/rpRoute");
const cpRoute = require("./Routes/cpRoute");
const bpRoute = require("./Routes/bpRoute");
const followupRoute = require("./Routes/followupRoute");
const customerRoute = require("./Routes/customerRoute");
const iotRoutes = require("./Routes/iotRoutes");
const iotQuoteRoute = require("./Routes/iotQuoteRoutes");
const blogRoute = require("./Routes/blogRoute");

const path = require("path");

// Use CommonJS-compatible __dirname

const app = express();
env.config();
mongoose.set("strictQuery", true);
connectDb();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.get("/", (_, res) => {
  res.send("server is running and ok");
});
app.use(express.static("uploads"));
app.use("/api/user", userRoute);
app.use("/api/otp", otpRoute);
app.use("/api/admin", adminRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/customer", customerRoute);
app.use("/api/rp", rpRoute);
app.use("/api/bp", bpRoute);
app.use("/api/cp", cpRoute);
app.use("/api/followup", followupRoute);
app.use("/api/career", careerRoute);
app.use("/api/quotes", quoterouter);
app.use("/api/contact", contactRoute);
app.use("/api/iot/prodcuts", iotRoutes);
app.use("/api/iot/quote" ,iotQuoteRoute);
app.use("/api/blog", blogRoute);


const filePath = path.join(__dirname, "uploads");
app.use("/images", express.static(filePath));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port:${PORT}`);
});
// app.listen(PORT, "127.0.0.1", () => {
//   console.log(`App is running on http://127.0.0.1:${PORT}/api`);
// });

