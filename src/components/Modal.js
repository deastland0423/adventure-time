import { useModalContext, hideModal } from "../contexts/ModalContext";

const Modal = () => {
  const { modal, dispatch } = useModalContext();

  return (
    modal.hidden ? null :
    <div id='modal-backdrop'>
      <div id='modal-contents'>
        <div id="close">
          <button onClick={() => dispatch(hideModal())}>
            Close
          </button>
        </div>
        {modal.content}
      </div>
    </div>
  );
};

export default Modal;
