import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useContext, useState } from "react";
import Peer from "simple-peer";
import { useCookies } from "react-cookie";
import { SocketCon } from "../socketio/Socketcontext";
import "./modalvideo.css";
import * as request from "../../utils/request";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import tuchohieu from "../../../public/audio/tuchoihieu.mp3";
const Callvideo = () => {
  const ringtone = new Audio(tuchohieu);

  // Phát âm thanh chuông khi có cuộc gọi đến
  const playRingtone = () => {
    ringtone.loop = true; // Lặp lại âm thanh chuông
    ringtone.play();
  };
  const stopRingtone = () => {
    ringtone.pause();
    ringtone.currentTime = 0;
  };

  const [cookies] = useCookies();
  const location = useLocation();
  const youID = location.state.user.id;
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
    socket.emit("findUserCall", { myID: myID, youID: youID });
    socket.on("callID", (data) => {
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
  const [callerBlur, setCallerBlur] = useState(false);
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
      // stopRingtone();
      setrunTime(true);
      console.log("Nhận cuộc gọi");
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const handleHome = () => {
    socket.emit("endcall", youID);
    const home = async () => {
      if (stream) {
        const tracks = stream.getTracks();
        await tracks.forEach((track) => track.stop());
        setrunTime(false);
        setchaychay(true);
      }
      setReceivingCall(false);
      setCallEnded(true);
      setTimeout(() => {
        Navigate(`/home/messenger/${receptor.id}`, { replace: true });
      }, 1000);
    };
    home();
    // window.location.reload();
  };
  const [noAnswer, setnoAnswer] = useState(false);
  useEffect(() => {
    if (receivingCall) {
      answerCall();
    }
  }, [receivingCall]);

  useEffect(() => {
    if (callAccepted) {
      setnoAnswer(false);
    } else {
      let a = setTimeout(async () => {
        setnoAnswer(true);
      }, 10000);
      return () => clearTimeout(a);
    }
  }, [callAccepted]);

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
        try {
          const res = await request.post(`call/callEnd`, {
            sender_id: b.userId,
            recipient_id: myID,
            time: dem,
          });
          if (res) {
            console.log("Callended");
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (chaychay && dem == 0) {
        // console.log("bắn data để lưu");
      }
    };
    endCall();
  }, [chaychay]);
  // -----------close cam
  const [mic, setmic] = useState(false);
  const [cam, setcam] = useState(false);
  const handleCloseCam = () => {
    setcam((pre) => !pre);
  };
  const handleCloseMic = () => {
    setmic((pre) => !pre);
  };
  useEffect(() => {
    if (stream) {
      const tracks = stream.getTracks();
      const audio = tracks.find((item) => item.kind == "audio");
      if (mic) {
        audio.enabled = false;
        // console.log(audio);
      } else {
        audio.enabled = true;
        // console.log(audio);
      }
    }
  }, [mic]);
  useEffect(() => {
    if (stream) {
      const tracks = stream.getTracks();
      const camera = tracks.find((item) => item.kind == "video");
      if (cam) {
        camera.enabled = false;
        // console.log(camera);
      } else {
        camera.enabled = true;
        // console.log(camera);
      }
    }
  }, [cam]);

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
          <button className="btn btn-success m-2" onClick={handleCloseMic}>
            {!mic ? <MicIcon /> : <MicOffIcon />}
          </button>
          <button className="btn btn-success m-2" onClick={handleCloseCam}>
            {!cam ? <VideocamIcon /> : <VideocamOffIcon />}
          </button>
          &nbsp;
          <button className="btn btn-danger m-2" onClick={handleHome}>
            {!noAnswer ? "Tắt" : "Không trả lời"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Callvideo;
