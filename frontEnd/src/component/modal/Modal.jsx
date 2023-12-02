import "./modal.css";
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
          {props.text}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={props.display === "block" ? "modal-display" : "modal-body"}
      >
        {props.childrens}
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Hủy</Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
