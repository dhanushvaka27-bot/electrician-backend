const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// CONNECT DATABASE
mongoose.connect(
"mongodb+srv://localServices:localServices%402026@localservices.hswzk2c.mongodb.net/localServices?retryWrites=true&w=majority"
)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const electricianSchema = new mongoose.Schema({
  name: String,
  phone: String,
  area: String,
  experience: Number
});

const Electrician = mongoose.model("Electrician", electricianSchema);

// API
app.get("/electricians/:area", async (req, res) => {
  const area = req.params.area;

  const data = await Electrician.find({ area });

  res.json(data);
});

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
// ADD ELECTRICIAN
app.post("/electricians", async (req, res) => {

  const { name, phone, area, experience } = req.body;

  const newElectrician = new Electrician({
    name,
    phone,
    area,
    experience
  });

  await newElectrician.save();

  res.json({
    message: "Electrician Added Successfully"
  });

});
const userSchema = new mongoose.Schema({
 email:String,
 password:String
});

const User = mongoose.model("User",userSchema);
app.post("/register", async (req,res)=>{

 const user = new User(req.body);
 await user.save();

 res.json({message:"User Registered"});
});
app.post("/login", async (req,res)=>{

 const {email,password}=req.body;

 const user = await User.findOne({email,password});

 if(!user)
   return res.status(401).json({message:"Invalid Login"});

 res.json({message:"Login Success"});
});