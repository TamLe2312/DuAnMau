import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { pink } from "@mui/material/colors";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useState } from "react";
export default function SimpleBottomNavigation(props) {
  const { leaveCall, answerCall } = props;

  const [mic, setMic] = useState(false);
  const [video, setVideo] = useState(false);
  const handleMic = () => {
    setMic((pre) => !pre);
  };
  const handleCamera = () => {
    setVideo((pre) => !pre);
  };
  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation>
        <BottomNavigationAction
          icon={
            !mic ? (
              <MicIcon sx={{ fontSize: 26 }} />
            ) : (
              <MicOffIcon sx={{ fontSize: 26 }} />
            )
          }
          onClick={handleMic}
        />
        <BottomNavigationAction
          icon={
            !video ? (
              <VideocamIcon sx={{ fontSize: 26 }} />
            ) : (
              <VideocamOffIcon sx={{ fontSize: 26 }} />
            )
          }
          onClick={handleCamera}
        />
        <BottomNavigationAction
          icon={<CallEndIcon sx={{ color: pink[500], fontSize: 26 }} />}
          onClick={leaveCall}
        />
        <button onClick={answerCall}>Trả lời</button>
      </BottomNavigation>
    </Box>
  );
}
