const initState = {
  current: "idle", //negotiating, progress, complete
  video: "off", //video feed status: 'off' 'enabled' 'disabled' 'complete'
  audio: "off", //video feed status: 'off' 'enabled' 'disabled' 'complete'
  audioDevice: "default", // enumerate devices, chosen audio device (don't care about output device)
  videoDevice: "default",
  shareScreen: false,
  haveMedia: false, //is there a localStream, has getUserMedia been run
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initState, action) => {
  if (action.type === "UPDATE_CALL_STATUS") {
    const copyState = { ...state };
    copyState[action.payload.prop] = action.payload.value;
    console.log(copyState.video);
    return copyState;
  } else if (action.type === "LOGOUT_ACTION" || action.type === "NEW_VERSION") {
    return initState;
  } else {
    return state;
  }
};
