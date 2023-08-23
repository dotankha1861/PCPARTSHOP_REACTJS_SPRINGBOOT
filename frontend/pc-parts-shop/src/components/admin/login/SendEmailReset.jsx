import React, { forwardRef } from 'react'
import Modal from '../../Modal';
import { ResetPassword } from './ResetPassword';

const SendEmailReset = (props, ref) => {
  return (
    <Modal ref={ref}>
        <ResetPassword/>
    </Modal>
  )
}

export default forwardRef(SendEmailReset);