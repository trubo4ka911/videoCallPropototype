import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtonCaretDropDown from "../ActionButtonCaretDropDown";
import getDevices from "../../webRTCutilities/getDevices";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import addStream from "../../redux/actions/addStream";
import startLocalAudioStream from "./startLocalAudioStream";

const AudioButton = ({ smallFeedEl }) => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [caretOpen, setCaretOpen] = useState(false);
  const [audioDeviceList, setAudioDeviceList] = useState([]);

  let micText;
  if (callStatus.audio === "off") {
    micText = "Join Audio";
  } else if (callStatus.audio === "enabled") {
    micText = "Mute";
  } else {
    micText = "Unmute";
  }

  useEffect(() => {
    const getDevicesAsync = async () => {
      if (caretOpen) {
        //check for audio devices
        const devices = await getDevices();

        setAudioDeviceList(
          devices.audioOutputDevices.concat(devices.audioInputDevices)
        );
      }
    };
    getDevicesAsync();
  }, [caretOpen]);
  const startStopAudio = () => {
    if (callStatus.audio === "enabled") {
      dispatch(updateCallStatus("audio", "disabled"));
      //set the stream to disabled
      const tracks = streams.localStream.stream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = false));
    } else if (callStatus.audio === "disabled") {
      dispatch(updateCallStatus("audio", "enabled"));
      const tracks = streams.localStream.stream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = true));
    } else {
      //audio is "off"
      changeAudioDevice({ target: { value: "inputdefault" } });
      //add tracks
      startLocalAudioStream(streams);
    }
  };

  const changeAudioDevice = async (e) => {
    //the user changed the desired output audio device OR input audio device
    //1. we need to get that deviceId
    const deviceId = e.target.value.slice(5);
    const audioType = e.target.value.slice(0, 5);
    console.log(audioType);

    if (audioType === "output") {
      //4. (sort of out of order) update the smallFeedEl
      smallFeedEl.current.setSinkId(deviceId);
    } else if (audioType === "input") {
      //2. we need to getUserMedia (permission)
      const newConstraint = {
        audio: { deviceId: { exact: deviceId } },
        video:
          callStatus.videoDevice === "default"
            ? true
            : { deviceId: { exact: deviceId } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(newConstraint);
      //3. update Redux with that videoDevice, and that audio is enabled
      dispatch(updateCallStatus("audioDevice", deviceId));
      dispatch(updateCallStatus("audio", "enabled"));
      //5. need to updat the localStream in streams
      dispatch(addStream("localStream", stream));
      //6. add tracks
      const tracks = stream.getVideoTracks();
    }
  };
  return (
    <div className="button-wrapper d-inline-block">
      <i
        className="fa fa-caret-up choose-audio"
        onClick={() => setCaretOpen(!caretOpen)}
      ></i>
      <div className="button mic" onClick={startStopAudio}>
        <i className="fa fa-microphone"></i>
        <div className="btn-text">{micText}</div>
      </div>
      {caretOpen ? (
        <ActionButtonCaretDropDown
          defaultValue={callStatus.audioDevice}
          changeHandler={changeAudioDevice}
          deviceList={audioDeviceList}
          type="audio"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AudioButton;
