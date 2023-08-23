import React, { forwardRef } from 'react'
import { ResetPassword } from '../../admin/login/ResetPassword';

const SendEmailReset = ({setPageLogIn}) => {
	return (
		<div className='flex flex-col items-center gap-2'>
			<ResetPassword/>
			<div className='mb-3 cursor-pointer text-blue-800 self-end mr-5'
				onClick={() => setPageLogIn()}>Đăng nhập</div>
		</div>
	)
}

export default SendEmailReset;