const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const router = require("./routes");

dotenv.config();
const app = express();

// mongo databse connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api', router);
app.get("/api", (req, res) => {
  res.send("API");
});
app.get("/", (req, res) => {
  res.send("Working!");
});

//start listening to the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
