//is where all express stuff happens (routes)
const app = require("./server").app;
const jwt = require("jsonwebtoken");
const linkSecret = "jh54645h6b45j6hj45b";
const { v4: uuidv4 } = require("uuid");

const professionalAppointments = [];

app.set("professionalAppointments", professionalAppointments);

//this route is for US. In production a receptionist would send it out. We will print it out and paste it in.
//It will drop us on our React site with the right info for CLIENT1 to make an offer
app.get("/user-link", (req, res) => {
  const uuid = uuidv4();

  //data for the end-user's appt
  const apptData = {
    professionalsFullName: "Anna Trubnikova",
    apptDate: Date.now() + 500000,
    uuid,
  };

  professionalAppointments.push(apptData);

  //we need to encode this data in a token so it can be added to url
  const token = jwt.sign(apptData, linkSecret);
  res.send("https://localhost:3002/join-video?token=" + token);
  //   res.json("This is a test route");
});

app.post("/validate-link", (req, res) => {
  //get the token from the body of the post request (thanks express.json())
  const token = req.body.token;
  //decode the jwt with our secret
  const decodedData = jwt.verify(token, linkSecret);
  //send the decoded data (our object) back to the front end
  res.json(decodedData);
  console.log(professionalAppointments);
});
