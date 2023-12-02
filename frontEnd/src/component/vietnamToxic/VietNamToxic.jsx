import React, { useState } from "react";

export const VietNamToxic = () => {
  const [text, settext] = useState("");
  const [toxic, settoxic] = useState(["hello", "hi", "no", "vip"]);
  const [result, setresult] = useState(false);
  const check = () => {
    const checks = text
      .split(" ")
      .filter((t) => toxic.includes(t.toLowerCase().trim()));
    if (checks.length > 0) {
      setresult(true);
    } else {
      setresult(false);
    }
  };
  return (
    <div>
      <div className="mb-3">
        <label className="form-label">
          Check Vietnamtoxic hello, hi, no, vip
        </label>
        <textarea
          style={{ width: 600 }}
          className="form-control"
          rows="3"
          value={text}
          onChange={(e) => settext(e.target.value)}
        ></textarea>
      </div>
      <button className="btn btn-success" onClick={check}>
        Kiểm tra
      </button>
      <br />
      <br />
      {result && <span>Không hợp lệ</span>}
    </div>
  );
};
