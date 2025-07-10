//this function for update all peerConnections (addTracks) and update redux callStatus

import updateCallStatus from "../../redux/actions/updateCallStatus";

const startLocalVideoStream = (streams, dispatch) => {
  const localStream = streams.localStream;
  for (const s in streams) {
    if (s !== "localStream") {
      //we don't addTracks to the localStream
      const curStream = streams[s];
      //addTracks to all peerConnections
      localStream.stream.getVideoTracks().forEach((t) => {
        curStream.peerConnection.addTrack(t, streams.localStream.stream);
      });
      //update redux callStatus
      dispatch(updateCallStatus("video", "enabled"));
    }
  }
};

export default startLocalVideoStream;
