//all socketServer stuff happens here
const io = require("./server").io;
const app = require("./server").app;

// const professionalAppointments = app.get("professionalAppointments");
const connectedProfessionals = [];
const allKnownOffers = {
  //uniqueID - key
  //offer
  //professionalsFullName
  //clientName
  //apptDate
  //offererIceCandidates
  //answer
  //answerIceCandidates
};

io.on("connection", (socket) => {
  console.log(socket.id, "has connected");
  const fullName = socket.handshake.auth.fullName;
  connectedProfessionals.push({
    socketId: socket.id,
    fullName: fullName,
  });

  socket.on("newOffer", ({ offer, apptInfo }) => {
    //ofer = sdp/type, apptInfo has the uuid that we can add to allKnownOffers
    //so that, the professional can find EXACTLY the right allKnownOffers
    // console.log(offer);
    // console.log("========");
    // console.log(apptInfo);
    allKnownOffers[apptInfo.uuid] = {
      ...apptInfo,
      offer,
      offererIceCandidates: [],
      answer: null,
      answerIceCandidates: [],
    };

    const p = connectedProfessionals.find(
      (cp) => cp.fullName === apptInfo.professionalsFullName
    );
    if (p) {
      const socketId = p.socketId;
      socket
        .to(socketId)
        .emit("newOfferWaiting", allKnownOffers[apptInfo.uuid]);
    }
  });
});
