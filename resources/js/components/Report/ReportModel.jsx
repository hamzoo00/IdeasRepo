import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Typography, Alert, FormControl, InputLabel, Select, CircularProgress, Box 
} from '@mui/material';
import api from '../axios'; 

const Colors = {
  darkest: "#03045E",
  darker: "#023E8A",
  dark: "#0077B6",
  mediumDark: "#0096C7",
  primary: "#00B4D8",
  mediumLight: "#48CAE4",
  light: "#90E0EF",
  lighter: "#ADE8F4",
  lightest: "#CAF0F8",
};

const REPORT_REASONS = [
    'Spam or Misleading',
    'Harassment or Hate Speech',
    'Plagiarism / Stolen Idea',
    'Inappropriate Content',
    'Fake Profile',
    'Other'
];

export default function ReportModal({ open, onClose, ideaId }) {

    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (open) {
            setReason('');
            setComment('');
            setError(null);
            setSuccess(false);
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!reason) {
            setError("Please select a reason.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('/reports', {
                idea_id: ideaId,
                reason: reason,
                comment: comment
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setReason('');
                setComment('');
            }, 2000); // Close after 2 seconds
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit report.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseFunc = () => {
        if (!loading && !success) {
            onClose();
        }
    }

    return (
       <Dialog 
            open={open} 
            onClose={handleCloseFunc} 
            PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }} 
            onClick={(e) => e.stopPropagation()} // Prevent card click event firing
        >
            <DialogTitle sx={{ bgcolor: Colors.lightest, color: Colors.darkest, fontWeight: 600 }}>
                Report Idea
            </DialogTitle>

            <DialogContent sx={{ minWidth: { xs: 'auto', sm: 400 }, mt: 2 }}>
                {success ? (
                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            Report submitted successfully. Thank you!
                        </Alert>
                        <Typography variant="body2" color="text.secondary">
                            Closing window...
                        </Typography>
                     </Box>
                ) : (
                    <>
                         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        
                        <Typography variant="body2" sx={{ mb: 2, color: Colors.darker }}>
                            Help us keep the community safe. Why are you reporting this?
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel sx={{ color: Colors.mediumDark }}>Reason</InputLabel>
                            <Select
                                value={reason}
                                label="Reason"
                                onChange={(e) => setReason(e.target.value)}
                                sx={{
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: Colors.primary,
                                    },
                                }}
                            >
                                {REPORT_REASONS.map(r => (
                                    <MenuItem key={r} value={r}>{r}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Additional Details (Optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Provide more context if necessary..."
                            sx={{
                                '& label.Mui-focused': { color: Colors.primary },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: Colors.primary,
                                },
                            }}
                        />
                    </>
                )}
            </DialogContent>

            {!success && (
                <DialogActions sx={{ p: 2, bgcolor: '#fafafa', borderTop: '1px solid #eee' }}>
                    <Button 
                        onClick={onClose} 
                        sx={{ color: Colors.dark, fontWeight: 500 }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{ px: 3, fontWeight: 600 }}
                    >
                        {loading ? "Submitting..." : "Report"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}