import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Fade, Stack } from '@mui/material';
import { 
    Close as CloseIcon, 
    Campaign as AnnouncementIcon, 
    NavigateNext as NextIcon,
    NavigateBefore as PrevIcon 
} from '@mui/icons-material';
import api from '../../axios';
import echo from '../../echo';
import { useSelector } from 'react-redux';

const Colors = {
    darkest: "#03045E",
    primary: "#00B4D8",
    lightest: "#CAF0F8",
};

export default function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const { type } = useSelector((state) => state.auth.user);
    const isAdminLoggedIn = type === 'admin';

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get('/active-announcements');
                setAnnouncements(res.data);
            } catch (err) { console.error(err); }
        };
        fetchAnnouncements();

        const channel = echo.channel('community-announcements');
        
        channel.listen('.NewAnnouncement', (e) => {
            setAnnouncements(prev => [e.announcement, ...prev]);
            setCurrentIndex(0); // Jump to the newest one immediately
        });

        channel.listen('.AnnouncementDeleted', (e) => {
            setAnnouncements(prev => prev.filter(ann => ann.id !== e.announcement.id));
        });

        return () => echo.leaveChannel('public-announcements');
    }, []);

    // Timer Logic for Rotation
    useEffect(() => {
        if (announcements.length <= 1) return;

        const timer = setInterval(() => {
            handleNext();
        }, 10000); // 10 Seconds

        return () => clearInterval(timer);
    }, [announcements, currentIndex]);

    const handleNext = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
            setIsVisible(true);
        }, 500); // Wait for fade out
    };

    const handlePrev = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
            setIsVisible(true);
        }, 500);
    };

    const handleDismissForAdmin = async (id) => {
        try {
           const res= await api.delete(`/announcements/${id}`);
           console.log(res.data.message);
             setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        } catch (err) {
            console.error('Failed to delete announcement:', err);
        }       
    };

    if (announcements.length === 0) return null;

    const currentAnn = announcements[currentIndex];

    return (
        <Box sx={{ width: '100%', mt: 1, px: 2 }}>
            <Fade in={isVisible} timeout={500}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 1.5,
                        bgcolor: Colors.lightest,
                        border: `1px solid ${Colors.lighter}`,
                        borderLeft: `6px solid ${Colors.primary}`,
                        display: 'flex',
                        alignItems: 'center',
                        mx: 'auto',
                        maxWidth: 'md',
                        borderRadius: 2,
                        position: 'relative'
                    }}
                >
                    <AnnouncementIcon sx={{ color: Colors.darkest, mr: 2, fontSize: 28 }} />
                    
                   <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                     <Stack direction="row" alignItems="center" spacing={1}>
                         <Typography 
                             variant="caption" 
                             fontWeight="bold" 
                             sx={{ 
                                 color: Colors.primary, 
                                 textTransform: 'uppercase',
                                 fontSize: { xs: '0.6rem', sm: '0.75rem' } // Smaller on mobile
                             }}
                         >
                             Announcement {currentIndex + 1}/{announcements.length}
                         </Typography>
                     </Stack>
                            
                      <Typography 
                          variant="subtitle2" 
                          fontWeight="bold" 
                          color={Colors.darkest} 
                          sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 1, // Keeping title to 1 line
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                      >
                          {currentAnn.title}
                      </Typography>
                      
                      <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: { xs: 3, sm: 2 },
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              lineHeight: 1.2
                          }}
                      >
                          {currentAnn.content}
                      </Typography>
                    </Box>
                   <Stack 
                        direction="row" 
                        spacing={0.5} 
                        sx={{ display: { xs: 'none', sm: 'flex' } }} // Hiding navigation on small screens
                    >
                        <IconButton size="small" onClick={handlePrev}><PrevIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={handleNext}><NextIcon fontSize="small" /></IconButton>
                    </Stack>
                        <IconButton size="small" onClick={() => isAdminLoggedIn ? handleDismissForAdmin(currentAnn.id) : setAnnouncements([])} title={isAdminLoggedIn? "Delete Announcement" : "Dismiss all"}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    
                </Paper>
            </Fade>
        </Box>
    );
}