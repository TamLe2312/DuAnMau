import React, { useEffect, useState } from "react";
import * as request from "../../../utils/request";

function TestLink() {
  const url = "https://youtu.be/ECZVU4x6Xq0?si=RwyEDaE3IIohLd0H";
  useEffect(() => {
    const Test = async () => {
      const res = await request.post("preview/getLinkPreview", { url: url });

      console.log(res);
    };
    Test();
  }, []);
  return (
    <>
      <h2>Hello</h2>
    </>
  );
}

export default TestLink;
