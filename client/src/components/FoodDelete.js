import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


export default function FoodDelete(props) {
  let open = props.open;
  let handleCloseOk = props.handleCloseOk;
  let handleCloseCancel = props.handleCloseCancel;
  let food = props.food ? {...props.food} : {};
  
  return (
    <div>
      <Modal show={open} onHide={handleCloseCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p> Are you sure you want to delete food 
            <span style={{fontWeight: "bold", fontStyle: "italic"}}> {food.description}
            </span>?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleCloseOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
