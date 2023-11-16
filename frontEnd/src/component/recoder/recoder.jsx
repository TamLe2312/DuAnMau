import { useEffect, useState } from "react";
import * as request from "../../utils/request";

import vmsg from "vmsg";

function Recorder(props) {
  const { youID, myID, setBanghi } = props;

  const [recordings, setRecordings] = useState(null);
  const recorder = new vmsg.Recorder({
    wasmURL: "https://unpkg.com/vmsg@0.4.0/vmsg.wasm",
  });

  const handleRecording = async () => {
    await recorder.initAudio();
    await recorder.initWorker();
    recorder.startRecording();
  };
  const handleRecordingStop = async () => {
    const blob = await recorder.stopRecording();
    setRecordings(URL.createObjectURL(blob));
    setBanghi(blob);
  };

  const mystyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  };
  useEffect(() => {
    setRecordings(null);
  }, [youID]);
  return (
    <>
      <div className="recordMess mt-2" style={mystyle}>
        <>
          <button className="btn btn-success" onClick={handleRecording}>
            Ghi
          </button>
          {/* <l-mirage size="60" speed="4" color="black"></l-mirage> */}
        </>
        {/* )} */}
        <button
          //   disabled={recordings}
          className="btn btn-primary m-2"
          onClick={handleRecordingStop}
        >
          Dừng
        </button>
        {recordings && recordings !== null ? (
          <audio src={recordings} controls></audio>
        ) : null}
      </div>
    </>
  );
}

export default Recorder;
