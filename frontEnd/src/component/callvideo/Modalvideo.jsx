// import Peer from "simple-peer";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./modalvideo.css";
import SimpleBottomNavigation from "./Editvideo";
import "ldrs/dotPulse";
import video from "../../../public/video/bg1.mp4";
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
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.emit("findUserCall", myID);
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);
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

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  useEffect(() => {
    setShow(call);
  }, [call]);
  const handleClose = async () => {
    window.location.reload();
    setShow(false);
    setCall(false);
  };
  const nameCall = () => {
    return user.name !== null ? user.name : user.username;
  };
  return (
    <>
      <Modal show={show} fullscreen={true} onHide={handleClose}>
        <Modal.Header closeButton className="modalvideo_header">
          <Modal.Title>{nameCall()}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalvideo">
          <div className="modalvideo_child">
            <div className="modalvideo_me">
              <video
                ref={myVideo}
                className="modalvideo_me_video"
                src={myVideo}
                autoPlay
                loop
                muted
              />
            </div>
            <div className="modalvideo_you">
              {video ? (
                <video
                  className="modalvideo_you_video"
                  src={userVideo}
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <span>
                  Calling{" "}
                  <l-dot-pulse size="43" speed="1.3" color="gray"></l-dot-pulse>
                </span>
              )}
            </div>
          </div>
          <div className="modalvideo_setting">
            <SimpleBottomNavigation
              leaveCall={leaveCall}
              answerCall={answerCall}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Modalvideo;
