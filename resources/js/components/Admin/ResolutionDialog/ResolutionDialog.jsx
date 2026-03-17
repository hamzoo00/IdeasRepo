import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Box, Alert, Stack 
} from '@mui/material';
import { Warning as WarnIcon, Block as SuspendIcon, DeleteForever as DeleteIcon } from '@mui/icons-material';

const Colors = {
  darkest: "#03045E",
  primary: "#00B4D8",
  lightest: "#CAF0F8",
};

export default function ResolutionDialog({ open, onClose, onConfirm, actionType, targetName, isSuspended }) {
  const [reason, setReason] = useState("");

  const getActionDetails = () => {
    switch (actionType) {
      case 'warn': 
        return { label: 'Warn User', color: 'warning', icon: <WarnIcon />, default: 'Violation of community guidelines.' };
      case 'suspend': 
        return { label: isSuspended ? 'Unsuspend User' : 'Suspend User', color: isSuspended ? 'success' : 'error', icon: <SuspendIcon />, default: 'Account suspended due to repeated violations.' };
      case 'delete': 
        return { label: 'Delete Idea', color: 'error', icon: <DeleteIcon />, default: 'Content removed for rule violation.' };
      case 'deleteUser': 
        return { label: 'Delete User', color: 'error', icon: <DeleteIcon />, default: 'User account removed for rule violation.' };
      default: 
        return { label: 'Confirm Action', color: 'primary', icon: null, default: 'Action taken by administrator.' };
    }
  };

  const { label, color, icon, default: defaultReason } = getActionDetails();

  const handleConfirm = () => {
    // Send the custom reason or the fallback default
    onConfirm(reason.trim() || defaultReason);
    setReason(""); // Reset for next time
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: Colors.lightest, color: Colors.darkest }}>
        {icon} {label}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          You are performing this action on: <strong>{targetName}</strong>
        </Typography>

        <Alert severity="info" sx={{ my: 2, fontSize: '0.75rem' }}>
          Reporters will be notified and all pending reports for this item will be resolved.
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Reason (Optional)"
          placeholder={`e.g. ${defaultReason}`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          variant="outlined"
          sx={{ mt: 1 }}
          helperText="If left blank, the default reason will be used."
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color={color}
          sx={{ px: 3, fontWeight: 'bold' }}
        >
          Confirm 
        </Button>
      </DialogActions>
    </Dialog>
  );
}