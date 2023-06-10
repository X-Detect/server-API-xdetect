import express from "express";
import dotenv from "dotenv";
import router from "./routes.js";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

const app = express();
const port = 8080;
const host = '0.0.0.0';

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({ limit: '10mb' }));
app.use(router);
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});
