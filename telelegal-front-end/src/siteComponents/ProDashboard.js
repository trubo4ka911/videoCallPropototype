import { useEffect, useState } from "react";
import "./ProDashboard.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socketConnection from "../webRTCutilities/socketConnection";
import proSocketListeners from "../webRTCutilities/proSocketListeners";
import moment from "moment";
import { useDispatch } from "react-redux";

const ProDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apptInfo, setApptInfo] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    //grab the token var out of the query string
    const token = searchParams.get("token");
    const socket = socketConnection(token);
    proSocketListeners.proDashabordSocketListeners(
      socket,
      setApptInfo,
      dispatch
    );
  }, []);

  const joinCall = (appt) => {
    console.log(appt);
    const token = searchParams.get("token");
    //navigate to /join-video-pro
    navigate(
      `/join-video-pro?token=${token}&uuid=${appt.uuid}&client=${appt.clientName}`
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="dash-box clients-board blue-bg">
          <h4>Coming Appointments</h4>
          {apptInfo.map((a) => (
            <div key={a.uuid}>
              <li className="client">
                {a.clientName} - {moment(a.apptDate).calendar()}
                {a.waiting ? (
                  <>
                    <div className="waiting-text d-inline-block">Waiting</div>
                    <button
                      className="btn btn-danger join-btn"
                      onClick={() => joinCall(a)}
                    >
                      Join
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </li>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;
