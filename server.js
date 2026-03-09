require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
  res.send("Electrician API Running 🚀");
});

// DATABASE
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// MODELS
const electricianSchema = new mongoose.Schema({
  name:String,
  phone:String,
  whatsapp:String,
  area:String,
  address:String,
  category:String,
  serviceType:String,
  experience:Number,
  rating:Number,
  totalRatings:Number,
  image:String
});

const Electrician = mongoose.model("Electrician",electricianSchema);

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const User = mongoose.model("User",userSchema);

// GET ELECTRICIANS
app.get("/electricians/:area", async(req,res)=>{
  const data = await Electrician.find({area:req.params.area});
  res.json(data);
});

// ADD ELECTRICIAN
app.get("/electricians/:area", async (req, res) => {

  const area = req.params.area;

  const data = await Electrician.find({
    area: { $regex: area, $options: "i" }
  });

  res.json(data);

});

// REGISTER
app.post("/register", async(req,res)=>{
  const user = new User(req.body);
  await user.save();
  res.json({message:"User Registered"});
});

// LOGIN
app.post("/login", async(req,res)=>{
  const user = await User.findOne(req.body);

  if(!user)
    return res.status(401).json({message:"Invalid Login"});

  res.json({message:"Login Success"});
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});
// GET ALL AREAS (FOR AUTOCOMPLETE)
app.get("/areas", async (req,res)=>{

  const areas = await Electrician.distinct("area");

  res.json(areas);

});