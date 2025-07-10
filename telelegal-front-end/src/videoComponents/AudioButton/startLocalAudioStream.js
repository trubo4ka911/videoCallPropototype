//this function for update all peerConnections (addTracks) and update redux callStatus

import updateCallStatus from "../../redux/actions/updateCallStatus";

const startLocalAudioStream = (streams) => {
  const localStream = streams.localStream;
  for (const s in streams) {
    if (s !== "localStream") {
      //we don't addTracks to the localStream
      const curStream = streams[s];
      //addTracks to all peerConnections
      localStream.stream.getAudioTracks().forEach((t) => {
        curStream.peerConnection.addTrack(t, streams.localStream.stream);
      });
    }
  }
};

export default startLocalAudioStream;
