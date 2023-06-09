import  express  from "express";
import dotenv from "dotenv";
import router from "./routes.js";
import fileUpload from "express-fileupload";

const app = express();
const port = 8080;

app.use(express.json({ limit: '10mb' }));
app.use(router);
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
