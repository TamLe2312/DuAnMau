import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useContext, useState } from "react";
import Peer from "simple-peer";
import { useCookies } from "react-cookie";
import { SocketCon } from "../socketio/Socketcontext";
import "./modalvideo.css";

const Callvideo = () => {
  const [cookies] = useCookies();
  const location = useLocation();
  const value = useContext(SocketCon);
  //   ----------------------------------
  const socket = value.socket;
  const myID = cookies.userId;
  const receptor = location.state.user;
  const Navigate = useNavigate();
  // call

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [datavip, setdatavip] = useState("");

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

    socket.emit("findUserCall", myID);
    socket.on("me", (data) => {
      setIdToCall(data.idcall);
    });
    socket.on("isyou", (data) => {
      let my = data.find((data) => data.userId == myID);
      setMe(my.socketId);
      setdatavip(data);
    });

    socket.on("calluser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    try {
      let peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", (data) => {
        socket.emit("calluser", {
          userToCall: id,
          signalData: data,
          from: me,
          // name: name,
        });
      });
      peer.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      });
      socket.on("callaccepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
      connectionRef.current = peer;
    } catch (e) {
      console.log(e);
    }
  };
  const [runTime, setrunTime] = useState(false);
  const [chaychay, setchaychay] = useState(false);
  const answerCall = () => {
    setCallAccepted(true);
    let peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      setrunTime(true);
      console.log("Nhận cuộc gọi");
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const handleHome = () => {
    socket.emit("endcall", myID);
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setrunTime(false);
      setchaychay(true);
    }
    setReceivingCall(false);
    setCallEnded(true);
    setTimeout(() => {
      Navigate(`/home/messenger/${receptor.id}`, { replace: true });
      window.location.reload();
    }, 1000);
  };
  useEffect(() => {
    if (receivingCall) {
      answerCall();
    }
  }, [receivingCall]);
  useEffect(() => {
    socket.on("end", () => {
      setrunTime(false);
      setchaychay(true);
    });
  }, [callEnded]);
  useEffect(() => {
    if (idToCall) {
      callUser(idToCall);
    }
  }, [idToCall]);
  const [dem, setDem] = useState(0);
  useEffect(() => {
    if (runTime) {
      let timee = setInterval(() => {
        setDem((pre) => pre + 1);
      }, 1000);
      return () => clearInterval(timee);
    }
  }, [runTime]);

  // save time
  useEffect(() => {
    const endCall = async () => {
      if (chaychay && dem !== 0) {
        let b = datavip.find((item) => item.socketId == caller);
        console.log("thời gian gọi", dem);
        console.log("ID người gọi", b.userId);
        console.log("ID người nhận:", myID);
      }
    };
    endCall();
  }, [chaychay]);

  return (
    <div className="modalvideo_header">
      <h3 className="modalvideo_name">{receptor.username}</h3>
      <div className="modalvideo">
        <div className="modalvideo_child">
          <div className="modalvideo_me">
            <video
              className="modalvideo_me_video"
              muted
              ref={myVideo}
              autoPlay
            />
          </div>
          <div className="modalvideo_you">
            <div>
              <video
                className="modalvideo_you_video"
                ref={userVideo}
                autoPlay
              />
              {!callAccepted && <div className="loader"></div>}
            </div>
          </div>
        </div>
        <div className="modalvideo_setting">
          <button className="btn btn-danger m-2" onClick={handleHome}>
            Tắt
          </button>
        </div>
      </div>
    </div>
  );
};
export default Callvideo;
