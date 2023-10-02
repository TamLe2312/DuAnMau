import "./modal.css";
import React from "react";
import Modal from "react-bootstrap/Modal";

function MyModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Tạo bài viết
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={!props.row ? "modal-body" : "modal-body-row"}>
        {props.childrens.map((child, index) => (
          <React.Fragment key={index}>{child}</React.Fragment>
        ))}
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Hủy</Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
