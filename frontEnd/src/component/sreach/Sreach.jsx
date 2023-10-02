import { useEffect, useRef, useState } from "react";
import SreachSuccess from "./SreachSuccess";
import "./search.css";
function Sreach() {
  const refSearch = useRef();
  const [search, setSreach] = useState("");
  useEffect(() => {
    refSearch.current.focus();
  }, []);
  return (
    <div className="sreach">
      <input
        ref={refSearch}
        type="text"
        className="form-control"
        placeholder="Nhập tên cần tìm..."
        name="search"
        onChange={(e) => setSreach(e.target.value)}
      ></input>
      <hr />
      <div className="search-group-user">
        <SreachSuccess search={search} />
      </div>
    </div>
  );
}

export default Sreach;
