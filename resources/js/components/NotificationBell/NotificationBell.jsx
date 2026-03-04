import React, { useState, useEffect } from 'react';
import { 
  Badge, IconButton, Menu, MenuItem, Typography, 
  Box, Divider, CircularProgress, Tooltip, Stack, Link 
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Circle as UnreadIcon,
  DoneAll as MarkAllIcon 
} from '@mui/icons-material';
import api from '../axios'; 
import { formatDistanceToNow } from 'date-fns';

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

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    const unreadCount = notifications.length;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            const unReadNotifications = res.data.filter(n => !n.is_read);
            setNotifications(unReadNotifications);
        } catch (err) { 
            console.error("Failed to load notifications", err); 
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const markAsRead = async (id) => {
        try {
            // updating notification is read status in the UI immediately for better UX
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            await api.put(`/notifications/${id}/read`);
        } catch (err) { 
            console.error(err); 
            fetchNotifications(); 
        }
    };

    const markAllAsRead = async (e) => {
        e.preventDefault();
        try {
         
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            await api.put('/notifications/read-all');
        } catch (err) {
            console.error(err);
            fetchNotifications();
        }
    };

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton onClick={handleOpen} sx={{ color: Colors.lightest }}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ 
                    sx: { 
                        width: 350, 
                        maxHeight: 480, 
                        borderRadius: 3, 
                        mt: 1.5,
                        boxShadow: '0px 8px 24px rgba(3, 4, 94, 0.15)',
                    } 
                }}
            >
                <Box sx={{ p: 2, bgcolor: Colors.lightest }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold" color={Colors.darkest}>
                            Notifications
                        </Typography>
                        {unreadCount > 0 && (
                            <Link 
                                href="#" 
                                onClick={markAllAsRead}
                                sx={{ 
                                    fontSize: '0.75rem', 
                                    color: Colors.dark, 
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    '&:hover': { color: Colors.darkest, textDecoration: 'underline' }
                                }}
                            >
                                Mark all as read
                            </Link>
                        )}
                    </Stack>
                </Box>
                
                <Divider />

                <Box sx={{ overflowY: 'auto', maxHeight: 400 }}>
                    {loading && notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} /></Box>
                    ) : notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No notifications</Typography>
                        </Box>
                    ) : (
                        notifications.map((n) => (
                            <MenuItem 
                                key={n.id} 
                                onClick={() => markAsRead(n.id)}
                                sx={{ 
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                    whiteSpace: 'normal',
                                    bgcolor: n.is_read ? 'transparent' : `${Colors.primary}08`,
                                    borderLeft: n.is_read ? '4px solid transparent' : `4px solid ${Colors.primary}`,
                                    borderBottom: `1px solid ${Colors.lightest}`,
                                    py: 1.5
                                }}
                            >
                                <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1, color: Colors.darkest, fontWeight: n.is_read ? 500 : 700 }}>
                                        {n.title}
                                    </Typography>
                                    {!n.is_read && <UnreadIcon sx={{ fontSize: 10, color: Colors.primary, mt: 0.5 }} />}
                                </Stack>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 0.5 }}>
                                    {n.message}
                                </Typography>
                                <Typography variant="caption" sx={{ mt: 1, color: Colors.mediumDark }}>
                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                </Typography>
                            </MenuItem>
                        ))
                    )}
                </Box>
            </Menu>
        </>
    );
}