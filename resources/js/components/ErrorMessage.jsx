import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

/**
 * Reusable Error Message Component
 * @param {string|null} error - The error message to display.
 * @param {function} clearError - (Optional) Function to clear the error in parent state.
 */
const ErrorMessage = ({ error, clearError }) => {
  const [open, setOpen] = useState(false);

  // Automatically open when the 'error' prop changes to a truthy value
  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const handleClose = (event, reason) => {
    // Prevent closing if user clicks outside the alert
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    
    // If a clear function is provided, reset the parent state
    if (clearError) {
      clearError();
    }
  };

  // Slide transition from the top
  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000} // Closes automatically after 6 seconds
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Top-Center position
      TransitionComponent={TransitionDown}
      // Responsive Width: 90% on mobile, limited max-width on desktop
      sx={{ 
        width: { xs: '90%', sm: 'auto' }, 
        maxWidth: { sm: '600px' },
        top: { xs: 20, sm: 24 } // slight top margin
      }}
    >
      <Alert 
        onClose={handleClose} 
        severity="error" 
        variant="filled" // "Filled" style makes it solid red and very visible
        sx={{ 
          width: '100%', 
          fontSize: '1rem', 
          fontWeight: 500,
          boxShadow: 6 
        }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorMessage;