const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes");
const sessionMiddleware = require("./middlewares/sessionMiddleWare");

// const allowedOrigins = ['https://example.com', 'https://another-allowed-origin.com'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser("2@]>+k70fX8S:74Ou0Dz7:XPvk"));
app.use(sessionMiddleware);

app.get('/',(req,res)=>{
    res.send('<h1> Kore.ai </h1>');
});

app.use("/api", apiRouter);


app.listen(3000, () => console.log('app listening on port 3000!'));