import * as React from 'react';
import { 
  AppBar, Box, Toolbar, IconButton, Typography, 
  Menu, Container, Avatar, Tooltip, MenuItem, 
  InputBase, Stack 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Lightbulb as LogoIcon 
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/slices/userDetailsSlice';
import NotificationBell from './NotificationBell/NotificationBell';
import { useSelector } from 'react-redux';

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

// Styled Search Component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: alpha(Colors.lightest, 0.15),
  '&:hover': {
    backgroundColor: alpha(Colors.lightest, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    minWidth: '300px'
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: Colors.light,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    fontSize: '0.9rem',
  },
}));


export default function Header({ id, name, profileImage, profileType, isOwner }) {

  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const isAdminLoggedIn = useSelector(state => state.auth.user.type === 'admin');


  useEffect(() => {
    if (profileImage) {
      const url = profileImage.startsWith('http')
        ? profileImage
        : `http://ideasrepo.test/storage/${profileImage}`;
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }, [profileImage]);

  let profilePath = `/${name}/${id}/profile`;
  if (profileType === "admin") profilePath = `/${id}/admin/profile`;
  else if (profileType === "teacher") profilePath = `/${name}/${id}/teacher/profile`;

  const settings = [
    { label: "Profile", path: profilePath },
     isAdminLoggedIn ? { label: "Moderation", path: "/admin/moderation" } : false,
    { label: "Home", path: `/${name}/${id}/home` },
    { label: "Contact Us", path: "/contactUs" },
    { label: "Logout", path: "/" },
   
  ].filter(Boolean);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: Colors.darkest, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          {/* 1. LOGO */}
          <Stack 
            direction="row" 
            alignItems="center" 
            component={Link} 
            to={`/${name}/${id}/home`} 
            sx={{ textDecoration: 'none', gap: 1 }}
          >
            <LogoIcon sx={{ color: Colors.primary, fontSize: 30, mr: { xs: 1, sm: 0 } }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                letterSpacing: '.1rem',
                background: `linear-gradient(45deg, ${Colors.lightest} 40%, ${Colors.primary} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: 'none', sm: 'block' }
              }}
            >
              IdeasRepo
            </Typography>
          </Stack>

          {/* 3.  SEARCH BAR  */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search ideas, tags, or creators..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* RIGHT SECTION: NOTIFICATION & PROFILE */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            
            {/* 4. CONDITIONAL NOTIFICATION BELL */}
            {isOwner && (
              <Box sx={{ mr: 1 }}>
                <NotificationBell />
              </Box>
            )}

            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: `2px solid ${Colors.mediumDark}` }}>
                <Avatar 
                  alt={name} 
                  src={imagePreview} 
                  sx={{ width: 40, height: 40, bgcolor: Colors.primary }}
                >
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: { 
                  borderRadius: 2, 
                  minWidth: 180,
                  boxShadow: '0px 5px 15px rgba(0,0,0,0.1)' 
                }
              }}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting.label} 
                  component={Link}
                  to={setting.path}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting.label === "Logout") dispatch(clearUser());
                  }}
                  sx={{ 
                    py: 1.5,
                    transition: '0.2s',
                    '&:hover': { 
                      backgroundColor: Colors.lightest,
                      color: Colors.darker,
                      pl: 3
                    } 
                  }}
                >
                  <Typography textAlign="center" sx={{ fontWeight: 500 }}>
                    {setting.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}