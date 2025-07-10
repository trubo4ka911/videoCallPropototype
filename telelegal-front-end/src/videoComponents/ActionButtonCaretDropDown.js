const ActionButtonCaretDropDown = ({
  defaultValue,
  changeHandler,
  deviceList,
  type,
}) => {
  const renderOptions = (devices) =>
    devices.map((device) => (
      <option key={device.deviceId} value={device.deviceId}>
        {device.label || "Unknown"}
      </option>
    ));

  let dropDownContent = null;

  if (type === "video") {
    dropDownContent = renderOptions(deviceList);
  } else if (type === "audio") {
    const inputDevices = deviceList.filter((d) => d.kind === "audioinput");
    const outputDevices = deviceList.filter((d) => d.kind === "audiooutput");

    dropDownContent = (
      <>
        {inputDevices.length > 0 && (
          <optgroup label="Input Devices">
            {renderOptions(inputDevices)}
          </optgroup>
        )}
        {outputDevices.length > 0 && (
          <optgroup label="Output Devices">
            {renderOptions(outputDevices)}
          </optgroup>
        )}
      </>
    );
  }

  return (
    <div className="caret-dropdown" style={{ top: "-25px" }}>
      <select defaultValue={defaultValue} onChange={changeHandler}>
        {dropDownContent}
      </select>
    </div>
  );
};

export default ActionButtonCaretDropDown;
