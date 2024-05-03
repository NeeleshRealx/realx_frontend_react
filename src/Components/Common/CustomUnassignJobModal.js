import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody } from "reactstrap";

const CustomUnassignJobModal = ({ show, onDeleteClick, onCloseClick }) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
        <lord-icon
          src="https://cdn.lordicon.com/wdqztrtx.json"
          trigger="loop"
          colors="primary:#912a4e,secondary:#f06548"
          style={{ width: "100px", height: "100px" }}
        ></lord-icon>
        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
          <h4>Are you sure ?</h4>
          <p className="text-muted mx-4 mb-0">
            Are you sure you want to unassign this job ?
          </p>
         </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            Close
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger "
            id="delete-record"
            onClick={onDeleteClick}
          >
            Yes
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

CustomUnassignJobModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
};

export default CustomUnassignJobModal;