import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';

const ErrorToast = ({ errorMessage, setError, severity, setSeverity }) => {
  const toast = useRef(null);
  useEffect(() => {
    if (errorMessage) {
      toast.current.show({
        severity : severity,
        summary: severity.toUpperCase(),
        detail: errorMessage,
        life: 3000,
      });
    }
    return () => {
      console.log("entered return")
      setError("")
      setSeverity("") 
    }
  }, [errorMessage]);

  return (
    <Toast
      ref={toast}
      position="top-right"
      onClose={() => console.log('Toast closed')}
    />
  );
};

export default ErrorToast;