// eslint-disable-next-line import/no-anonymous-default-export
export default (prop, value) => {
  return {
    type: "UPDATE_CALL_STATUS",
    payload: { prop, value },
  };
};
