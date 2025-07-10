import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import startLocalVideoStream from "./startLocalVideoStream";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import getDevices from "../../webRTCutilities/getDevices";
import addStream from "../../redux/actions/addStream";
import ActionButtonCaretDropDown from "../ActionButtonCaretDropDown";
const VideoButton = ({ smallFeedEl }) => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [caretOpen, setCaretOpen] = useState(false);
  const [videoDeviceList, setVideoDeviceList] = useState([]);

  const changeVideoDevice = async (e) => {
    //the user changed the desired video device
    //1. need to get that device
    const deviceId = e.target.value;
    // console.log(deviceId);
    //2. need  to getUserMedia (permission)
    const newConstraint = {
      audio:
        callStatus.audioDevice === "default"
          ? true
          : { deviceId: { exact: deviceId } },
      video: { deviceId: { exact: deviceId } },
    };
    const stream = await navigator.mediaDevices.getUserMedia(newConstraint);
    //3. update Redux with that videoDevice, and that video is enabled
    dispatch(updateCallStatus("videoDevice", deviceId));
    dispatch(updateCallStatus("video", "enabled"));
    //4. update the smallFeedEl
    smallFeedEl.current.srcObject = stream;
    //5. need to updat the localStream in streams
    dispatch(addStream("localStream", stream));
    //6. add tracks
    const tracks = stream.getVideoTracks();
    //come back later
    //if we stop the old tracks and add the new tracks, that will mean ... renegotiation
  };

  const DropDown = () => {};
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
      {caretOpen ? (
        <ActionButtonCaretDropDown
          defaultValue={callStatus.videoDevice}
          changeHandler={changeVideoDevice}
          deviceList={videoDeviceList}
          type="video"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default VideoButton;
