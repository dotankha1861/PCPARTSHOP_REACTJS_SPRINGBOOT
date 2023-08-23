import { toast } from "react-toastify";

const style =  {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    style: {
        color: "black"
    }
}

const Toast = {
    success: (message) => toast.success(message, style),
    error: (message) => toast.error(message, style),
    info: (message) => toast.info(message, style) ,
    warn: (message) => toast.warn(message, style) 
};

export default Toast;