import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser} from '../store/slices/userDetailsSlice';


const Colors = {
  darkest:     "#03045E", // Brand authority: logos, main headings, navbar/footer
  darker:      "#023E8A", // Primary UI actions: nav links, main buttons, active states
  dark:        "#0077B6", // Interactive elements: hover states, secondary buttons, links
  mediumDark:  "#0096C7", // Supporting UI: helper text, secondary links, icons
  primary:     "#00B4D8", // Core action highlight: CTAs, input focus, active indicators
  mediumLight: "#48CAE4", // Soft feedback: hover backgrounds, selected cards/rows
  light:       "#90E0EF", // Section backgrounds: forms, tables, grouped content
  lighter:     "#ADE8F4", // Layout support: sidebars, panels, app sections
  lightest:    "#CAF0F8", // Global background: pages, auth screens
};


export default function Header({id, name, profileImage, profileType}) {

    const dispatch = useDispatch();  
    const [imagePreview, setImagePreview] = useState(null);

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

    let path = `/${name}/${id}/profile`;

    if(profileType === "admin") { path = `/${id}/admin/profile`;}
    else if(profileType === "teacher"){ path = `/${name}/${id}/teacher/profile`;}
      
    
    const pages = [
       { label: "Contact Us", path: "/contactUs" },
       { label: "Home", path: `/${name}/${id}/home` },
    ];
    
    const settings = [
       { label: "Profile", path: path},
       { label: "Home", path: `/${name}/${id}/home` },
       { label: "Contact Us", path: "/contactUs" },
       { label: "Logout", path: "/" },
    ];
  
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

    return (
        <AppBar position="static">
      <Container maxWidth="xl" sx ={{ backgroundColor: Colors.darkest }}>
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to = {`/${name}/${id}/home`}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IdeasRepo
          </Typography>

            {/* Mobile View */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/* Navbar navigation */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => ( 
               <MenuItem
                  key={page.path}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: 'center' }}>
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
            
          </Box>

          {/* Desktop View */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/home"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IdeasRepo
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, flexFlow: 'row-reverse', marginRight:1 ,display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
                <Button
                   key={page.path}              
                   component={Link}            
                   to={page.path}
                   onClick={handleCloseNavMenu}
                   sx={{ my: 2, color: 'white', display: 'block' }}
                 >
                   {page.label}                
                 </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>

           {/* Profile image */}
                <Avatar alt="UserImage" src={imagePreview} />
              </IconButton>
            </Tooltip>

           {/* Profile Menu    */}
            <Menu
              sx={{ mt: '45px',  }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}

            >
              {settings.map((setting) => (
                <MenuItem 
                component={Link}
                to ={setting.path }
                key={setting.path} onClick={() => {
                  handleCloseUserMenu();
                  if (setting.label === "Logout") {
                    dispatch(clearUser());
                  }
                }}
                 sx={{ textAlign: 'center' ,
                    '&:hover': {
                     transform: 'scale(1.1)',}}}
               >
                  <Typography sx={{ textAlign: 'center' ,
                    '&:hover': {
                     color: Colors.darker,
                   }, }}>
                    {setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  
    );
}