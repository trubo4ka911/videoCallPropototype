// a utility function that fetch all available devices
// both video and audio

const getDevices = () => {
  return new Promise(async (resolve, reject) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
    const videoDevices = devices.filter((d) => d.kind === "videoinput");
    const audioOutputDevices = devices.filter((d) => d.kind === "audiooutput");
    const audioInputDevices = devices.filter((d) => d.kind === "audioinput");
    console.log("audioInputDevices ", audioInputDevices);
    resolve({
      videoDevices,
      audioOutputDevices,
      audioInputDevices,
    });
  });
};

export default getDevices;
