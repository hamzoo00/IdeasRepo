import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, 
  Stack, Alert, Divider, InputAdornment 
} from '@mui/material';
import { 
  Send as SendIcon, 
  EventBusy as ExpiryIcon, 
  Campaign as CampaignIcon,
  Title as TitleIcon 
} from '@mui/icons-material';
import api from '../../components/axios';
import { useSelector } from 'react-redux';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/Header';
import AnnouncementBanner from '@/components/Admin/AnnouncementBanner/AnnouncementBanner';

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

export default function CreateAnnouncement() {

    const [form, setForm] = useState({ title: '', content: '', expires_at: '' });
    const [status, setStatus] = useState(null);
    const { type, id, full_name, image, isOwner } = useSelector((state) => state.auth.user);
    const isAdminLoggedIn = type === 'admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/announcements', form);
            setStatus({ type: 'success', msg: 'Announcement broadcasted successfully!' });
            setForm({ title: '', content: '', expires_at: '' });
            setTimeout(() => setStatus(null), 5000); // Clear alert after 5s
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to post announcement. Please check your connection.' });
        }
    };

  if(!isAdminLoggedIn) {
    return <LoadingScreen message='Unauthorized Access' />;
  }

    return (
        <>
            <Header id = {id} name={full_name} profileImage={image} profileType={type} isOwner={isOwner} />
            <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, mb: 6, p: 2, height: '70%' }}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 4, 
                        border: `1px solid ${Colors.lighter}`,
                        boxShadow: `0px 10px 30px ${Colors.primary}20` // 20% opacity shadow
                    }}
                >
                    {/* Header */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Box sx={{ p: 1, bgcolor: Colors.lightest, borderRadius: 2 }}>
                            <CampaignIcon sx={{ color: Colors.darkest, fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" fontWeight="800" color={Colors.darkest} sx={{ fontSize: { xs: '1rem', sm: '1.75rem' } }}>
                                Broadcast Center
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '1.25rem' } }}>
                                Publish updates and alerts to the entire IdeasRepo community.
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 4, bgcolor: Colors.lightest }} />
                    
                    {status && (
                        <Alert 
                            severity={status.type} 
                            sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
                        >
                            {status.msg}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <TextField 
                                fullWidth 
                                label="Announcement Title" 
                                placeholder="e.g. Scheduled Maintenance or New Feature Update"
                                value={form.title}
                                onChange={(e) => setForm({...form, title: e.target.value})}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TitleIcon sx={{ color: Colors.mediumDark }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField 
                                fullWidth 
                                multiline 
                                rows={5} 
                                label="Details" 
                                placeholder="Type the full message here..."
                                value={form.content}
                                onChange={(e) => setForm({...form, content: e.target.value})}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Expiry Date (Optional)"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={form.expires_at}
                                onChange={(e) => setForm({...form, expires_at: e.target.value})}
                                helperText="If set, the announcement will auto-hide after this time."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ExpiryIcon sx={{ color: Colors.mediumDark }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button 
                                type="submit" 
                                variant="contained" 
                                disabled={!form.title || !form.content}
                                startIcon={<SendIcon />}
                                sx={{ 
                                    bgcolor: Colors.darker, 
                                    py: 1.8, 
                                    fontWeight: '800',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&:hover': { bgcolor: Colors.darkest },
                                    '&.Mui-disabled': { bgcolor: Colors.lighter }
                                }}
                            >
                                Publish Announcement
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Box>
            <AnnouncementBanner />   
            <Box sx={{ height: 100 }} /> {/* Spacer to ensure banner doesn't overlap content */}
         </>
    );
}
