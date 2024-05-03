import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody } from "reactstrap";

const CustomBookingModal = ({ show, onDeleteClick, onCloseClick }) => {
    return (
        <Modal isOpen={show} toggle={onCloseClick} centered={true}>
            <ModalBody className="py-3 px-5">
                <div className="mt-2 text-center">
                    <lord-icon
                        src="https://cdn.lordicon.com/wdqztrtx.json"
                        trigger="loop"
                        colors="primary:#F8BB86,secondary:#43c18d"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                    <div className="mt-3 pt-2 fs-15 mx-4 mx-sm-5">
                        <h4>Are you sure ?</h4>
                        <p className="text-muted mx-4 mt-3 mb-0">
                            You want to confirm this opportunity as a booking?
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
                        No, Cancel!
                    </button>
                    <button
                        type="button"
                        className="btn w-sm btn-success "
                        id="delete-record"
                        onClick={onDeleteClick}
                    >
                        Yes, Confirm!
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
};

CustomBookingModal.propTypes = {
    onCloseClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    show: PropTypes.any,
};

export default CustomBookingModal;