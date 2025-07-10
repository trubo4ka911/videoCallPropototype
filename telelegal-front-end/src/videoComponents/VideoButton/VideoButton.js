import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import startLocalVideoStream from "./startLocalVideoStream";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import getDevices from "../../webRTCutilities/getDevices";

const VideoButton = ({ smallFeedEl }) => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [caretOpen, setCaretOpen] = useState(false);
  const [videoDeviceList, setVideoDeviceList] = useState([]);

  const changeVideoDevice = () => {};

  const DropDown = () => {
    return (
      <div className="caret-dropdown" style={{ top: "-25px" }}>
        <select defaultValue={1} onChange={changeVideoDevice}>
          {videoDeviceList.map((vd) => (
            <option key={vd.deviceId} value={vd.deviceId}>
              {vd.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  useEffect(() => {
    const getDevicesAsync = async () => {
      if (caretOpen) {
        //check for video devices
        const devices = await getDevices();
        console.log(devices.videoDevices);
        setVideoDeviceList(devices.videoDevices);
      }
    };
    getDevicesAsync();
  }, [caretOpen]);

  const startStopVideo = () => {
    // console.log("check");
    if (callStatus.video === "enabled") {
      dispatch(updateCallStatus("video", "disabled"));
      //set the stream to disabled
      const tracks = streams.localStream.stream.getVideoTracks();
      tracks.forEach((t) => (t.enabled = false));
    } else if (callStatus.video === "disabled") {
      dispatch(updateCallStatus("video", "enabled"));
      const tracks = streams.localStream.stream.getVideoTracks();
      tracks.forEach((t) => (t.enabled = true));
    } else if (callStatus.haveMedia) {
      //we have media, show the feed
      smallFeedEl.current.srcObject = streams.localStream.stream;
      //add tracks to the peerConnections
      startLocalVideoStream(streams, dispatch);
    } else {
      setPendingUpdate(true);
    }
  };
  useEffect(() => {
    if (pendingUpdate && callStatus.haveMedia) {
      setPendingUpdate(false);
      smallFeedEl.current.srcObject = streams.localStream.stream;
      startLocalVideoStream(streams, dispatch);
    }
  }, [pendingUpdate, callStatus.haveMedia]);
  return (
    <div className="button-wrapper video-button d-inline-block">
      <i
        className="fa fa-caret-up choose-video"
        onClick={() => setCaretOpen(!caretOpen)}
      ></i>
      <div className="button camera" onClick={startStopVideo}>
        <i className="fa fa-video"></i>
        <div className="btn-text">
          {callStatus.video === "enabled" ? "Stop" : "Start"} Video
        </div>
      </div>
      {caretOpen ? <DropDown /> : <></>}
    </div>
  );
};

export default VideoButton;
