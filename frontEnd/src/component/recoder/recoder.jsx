import { useEffect, useState } from "react";
import vmsg from "vmsg";

function Recorder(props) {
  const { youID, myID, setBanghi } = props;

  const [recordings, setRecordings] = useState(null);
  const recorder = new vmsg.Recorder({
    wasmURL: "https://unpkg.com/vmsg@0.4.0/vmsg.wasm",
  });
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setloading(true);
  }, []);
  useEffect(() => {
    if (loading) {
      const chay = async () => {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
      };
      chay();
    }
  }, [loading]);
  const handleRecordingStop = async () => {
    setloading(false);
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
      <div className="recordMess m-2" style={mystyle}>
        {loading ? (
          <button
            style={{ borderRadius: 50 }}
            className="btn btn-primary "
            onClick={handleRecordingStop}
          >
            Dừng <l-mirage size="60" speed="4" color="black"></l-mirage>
          </button>
        ) : (
          <audio src={recordings} controls></audio>
        )}
      </div>
    </>
  );
}

export default Recorder;
