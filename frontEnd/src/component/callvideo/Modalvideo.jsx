import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Modalvideo(props) {
  const { call, setCall } = props;
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(call);
  }, [call]);
  const handleClose = () => {
    setShow(false);
    setCall(false);
  };
  const myStyle = {
    width: "50%",
    border: "1px solid black",
  };
  return (
    <>
      <Modal show={show} fullscreen={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Call </Modal.Title>
        </Modal.Header>
        <Modal.Body>12</Modal.Body>
      </Modal>
    </>
  );
}

export default Modalvideo;
