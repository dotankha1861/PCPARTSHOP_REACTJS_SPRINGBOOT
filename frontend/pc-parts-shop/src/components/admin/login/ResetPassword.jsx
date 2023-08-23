import React, { forwardRef, useState } from 'react'
import { TfiEmail } from 'react-icons/tfi'
import * as yup from "yup";
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { forgetPassword } from '../../../redux/apis/resetPasswordApi';
import Toast from '../../../utils/toast_helper';

export const ResetPassword = () => {
	const [isFetching, setFetching] = useState(false);
	const schema = yup.object().shape({
		email: yup.string().email("Email không đúng định dạng").required("Vui lòng nhập email"),
	});

	const { register, handleSubmit, formState: { errors } } = useForm({
		resolver: yupResolver(schema)
	});

	const onClickSendMailToken = async (data) => {
		try {
			setFetching(() => true);
			await forgetPassword(data.email);
			setFetching(() => false);
			Toast.success("Vui lòng kiểm tra email để cập nhật mật khẩu")
		}
		catch (error) {
			const { data: resBody } = error.response;
			Toast.error(resBody.message);
		}
	}
	return (
		<div>
			<div className="font-semibold my-2 text-center mt-2">QUÊN MẬT KHẨU</div>
			<form onSubmit={handleSubmit(onClickSendMailToken)} className='flex flex-col gap-2 items-center mt-2 px-6 py-2'>
				<div className='text-neutral-600'>Vui lòng nhập email để nhận link đặt lại mật khẩu</div>
				<div className='input flex items-center gap-2 w-full p-2'>
					<TfiEmail color='gray'
						size={'20px'} className='opacity-80'>
					</TfiEmail>
					<input className="focus:outline-none w-[250px]"
						type="text"
						placeholder='Email ...'
						{...register("email")} />
				</div>
				<div className="text-red-500 text-sm mt-1"><pre className='font-serif h-5'>    {errors.email?.message}
					{isFetching && <div
						class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-800 motion-reduce:animate-[spin_1.5s_linear_infinite]"
						role="status">
						<span
							class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
							Loading...</span>
					</div>}
				</pre></div>

				<button className='button mt-4 bg-green-600 hover:bg-green-500 border-none text-white p-2 w-[300px]'>Gửi</button>
			</form>
		</div>
	)
}
