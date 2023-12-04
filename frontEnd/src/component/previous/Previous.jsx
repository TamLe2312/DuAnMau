// sử dụng ở file khác (so là số bản ghi COUNT(*))
// const [pagechay, setpagechay] = useState(1);
{
  /* <Previous so={9} setpagechay={setpagechay} />; */
}

import { useEffect, useState } from "react";
const Previous = (props) => {
  // số page
  const so = props.so;
  const [number, setnumber] = useState([1]);
  useEffect(() => {
    const rounded = Math.ceil(so / 8);
    const numbers = Array.from({ length: rounded }, (_, index) => index);
    setnumber(numbers);
  }, [props.so]);
  //   xét left right
  const setpagechay = props.setpagechay;
  const [soso, setsoso] = useState(1);
  const pages = (so) => {
    const page = so + 1;
    setsoso(page);
  };

  useEffect(() => {
    setpagechay(soso);
  }, [soso]);

  const right = () => {
    setsoso((pre) => pre + 1);
  };
  const left = () => {
    setsoso((pre) => pre - 1);
  };
  return (
    <>
      {number.length > 1 ? (
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {soso > 1 && (
              <li className="page-item">
                <button
                  className="page-link"
                  href="#"
                  aria-label="Previous"
                  onClick={left}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
            )}
            {/* ------- */}
            {number.map((item, index) => (
              <li className="page-item" key={index}>
                <button
                  className={
                    soso == index + 1
                      ? "page-link page_link_active"
                      : "page-link"
                  }
                  onClick={() => pages(index)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            {/* ------ */}
            {soso === number.length ? null : (
              <li className="page-item">
                <button
                  className="page-link"
                  href="#"
                  aria-label="Next"
                  onClick={right}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      ) : null}
    </>
  );
};

export default Previous;
