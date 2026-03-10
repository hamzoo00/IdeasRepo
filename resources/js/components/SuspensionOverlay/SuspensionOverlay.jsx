import React from 'react';
import { Box, Typography, Paper, Button, Stack, Backdrop } from '@mui/material';
import { Block as BlockIcon, Logout as LogoutIcon, SupportAgent as SupportIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../store/slices/userDetailsSlice';

const Colors = {
  darkest: "#03045E",
  primary: "#00B4D8",
  lightest: "#CAF0F8",
};

export default function SuspensionOverlay() {

  const dispatch = useDispatch();
  const isSuspended = useSelector((state) => state.auth.user.is_suspended);
  const reason = useSelector((state) => state.auth.user.suspension_reason);

  const isAdminViewing = useSelector((state) => state.auth.user?.type === 'admin') || false;


  if (!isSuspended) return null;
  if (isAdminViewing) return null;

  const handleLogout = () => {
    dispatch(clearUser());
    window.location.href = '/'; 
  };

  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        backgroundColor: 'rgba(3, 4, 94, 0.4)', 
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 500,
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          border: `2px solid ${Colors.primary}`,
          bgcolor: 'white'
        }}
      >
        <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h4" fontWeight="bold" color={Colors.darkest} gutterBottom>
          Account Suspended
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          Your access to <strong>IdeasRepo</strong> has been restricted due to a violation of our community guidelines.
        </Typography>

        <Box sx={{ 
          p: 2, 
          bgcolor: Colors.lightest, 
          borderRadius: 2, 
          mb: 4, 
          borderLeft: `5px solid ${Colors.primary}` 
        }}>
          <Typography variant="subtitle2" color={Colors.darkest} fontWeight="bold">
            Reason for Suspension:
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 1, fontStyle: 'italic' }}>
            "{reason || "No specific reason provided. Please check your email."}"
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button 
            variant="outlined" 
            startIcon={<SupportIcon />}
            sx={{ color: Colors.darkest, borderColor: Colors.darkest, width: {xs: '6rem', sm: '8rem'}, fontSize: {xs: '0.65rem', sm: '0.9rem'} }}
            onClick={() => window.location.href = '/contactUs'}
          >
            Appeal
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<LogoutIcon />}
            sx={{ bgcolor: Colors.darkest, '&:hover': { bgcolor: '#000' }, width: {xs: '6rem', sm: '8rem'}, fontSize: {xs: '0.65rem', sm: '0.9rem'} }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Backdrop>
  );
}