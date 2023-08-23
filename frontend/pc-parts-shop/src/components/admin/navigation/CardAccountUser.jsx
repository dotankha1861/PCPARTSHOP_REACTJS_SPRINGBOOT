import { useSelector } from 'react-redux';
import { VscChevronDown} from 'react-icons/vsc'
import { forwardRef } from 'react';

const CardAccountUser = (props, ref) => {
  const { currentUser } = useSelector(state => state.auth);
  return (
    <div className='flex gap-3 items-center'>
      <div>{currentUser?.lastName + " " + currentUser?.firstName + " - " + currentUser?.employeeId}</div>
      <div className='flex flex-col items-center' ref = {ref}>
        <img src={currentUser?.avatar} className='w-10 h-10 rounded-full hover:shadow-2xl' alt=""></img>
        <VscChevronDown size={12} className='hover:opacity-80 text-neutrail-200 w-full' />
      </div>
    </div>
  );
}

export default forwardRef(CardAccountUser);
