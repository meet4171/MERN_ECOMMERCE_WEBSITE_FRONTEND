import { useEffect } from 'react';
import toast from 'react-hot-toast';

function LoadingToast({ message, duration }) {
    useEffect(() => {
        const toastId = toast.loading(message, {
            id: 'loading-toast',
            duration: duration,
        });

        // Clean up the toast when the component unmounts
        return () => toast.dismiss(toastId);
    }, [message, duration]);

    // Return null because the component doesn't render any visible content
    return null;
}

export default LoadingToast;
