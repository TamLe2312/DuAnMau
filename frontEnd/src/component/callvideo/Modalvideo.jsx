import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./modalvideo.css";

import Peer from "simple-peer";
function Modalvideo(props) {
  const { call, setCall, user, socket, myID } = props;
  // console.log(user);
  const [show, setShow] = useState(false);

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("vip");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((e) => {
        console.log(e);
      });
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);
  useEffect(() => {
    setShow(true);
    // check ở đây :v
    socket.on("isyou", (data) => {
      // console.log("you", data.idyou);
      let a = data.activeUsers.find((id) => id.userId == myID);
      // console.log("me", a.socketId);
      // setIdToCall(data.idyou);
      setMe(a.socketId);
      callUser(data.idyou);
    });
  }, [call]);
  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const handleClose = async () => {
    window.location.reload();
    setShow(false);
    setCall(false);
  };

  const leaveCall = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCallEnded(true);
  };

  const nameCall = () => {
    return user.name !== null ? user.name : user.username;
  };
  if (idToCall && me) {
    console.log(idToCall);
    console.log(me);
  }
  return (
    <>
      <Modal show={show} fullscreen={true} onHide={handleClose}>
        <Modal.Header closeButton className="modalvideo_header">
          <Modal.Title>{nameCall()}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalvideo">
          <div className="modalvideo_child">
            <div className="modalvideo_me">
              {stream && (
                <video
                  className="modalvideo_me_video"
                  muted
                  ref={myVideo}
                  autoPlay
                />
              )}
            </div>
            <div className="modalvideo_you">
              {callAccepted && !callEnded ? (
                <video
                  className="modalvideo_you_video"
                  ref={userVideo}
                  autoPlay
                />
              ) : (
                <div className="loader"></div>
              )}
            </div>
          </div>
          <div className="modalvideo_setting">
            {callAccepted && !callEnded ? (
              <button className="btn btn-danger" onClick={leaveCall}>
                Tắt
              </button>
            ) : // <button
            //   className="btn btn-success"
            //   onClick={() => callUser(idToCall)}
            // >
            //   Gọi
            // </button>
            null}
            {receivingCall && !callAccepted ? (
              <div className="caller">
                <h1>{name} is calling...</h1>
                <button className="btn btn-success" onClick={answerCall}>
                  Answer
                </button>
              </div>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Modalvideo;
