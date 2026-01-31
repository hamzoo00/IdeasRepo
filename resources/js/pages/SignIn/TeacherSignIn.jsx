import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper, 
  CssBaseline 
} from '@mui/material';
import {Link} from 'react-router'
import api from '../../components/axios'
import { useNavigate } from "react-router-dom";



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

export default function SignIn() {

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async(data) => {

    try {
        if (data.identifier === "000000000"){
             const payload = { 
                identifier: data.identifier,
                password: data.password          
          }; 
          
     const response = await api.post('/admin/login', payload );
     console.log(response.data.message);

     const adminId = response.data.admin.id;
     localStorage.setItem("admin", JSON.stringify(response.data.teacher));
     navigate(`/${adminId}/admin`)
         
     } else {
        
     const payload = { 
                identifier: data.identifier,
                password: data.password          
          }; 
          
     const response = await api.post('/teacher/login', payload );
     console.log(response.data.message);

     const teacherId = response.data.teacher.id;
      const teacherName = response.data.teacher.full_name;
     localStorage.setItem("Teacher", JSON.stringify(response.data.teacher));
     localStorage.setItem("auth_token", response.data.auth_token);
     navigate(`/${teacherName}/${teacherId}/teacher/profile`);
         
     } } catch (error) {
      console.error("Login failed:", error);
    }
  };
    
  

  return (
    
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.lightest, 
      }}
    >
      <CssBaseline />
      
      <Container maxWidth="xs">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: '#ffffff'
          }}
        >
          {/* LOGOs */}
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              color: Colors.darkest, 
              fontWeight: 'bold', 
              mb: 1 
            }}
          >
            IdeasRepo
          </Typography>

          <Typography component="h2" variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
            Sign in to your account
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)} 
            noValidate 
            sx={{ mt: 1, width: '100%' }}
          >
            
            {/* Identifier */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="identifier"
              label="Email Address or ID"
              autoComplete="email"
              autoFocus
              {...register("identifier", { 
                required: "Email or ID is required",
                minLength: {
                    value: 9,
                    message: "Invalid Email or ID"
                },
              })}
              error={!!errors.identifier}
              helperText={errors.identifier ? errors.identifier.message : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: Colors.primary,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: Colors.darker,
                },
              }}
            />

           {/* Password*/}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                    value: 9,
                    message: "Password must be at least 9 characters long"
                },
                pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/,
                    message: "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character"
                }
              })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: Colors.primary,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: Colors.darker,
                },
              }}
            />
            

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: Colors.darker,
                '&:hover': {
                  bgcolor: Colors.darkest,
                },
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: Colors.mediumDark , marginRight: 0.5, }}>
                    Sign In as Student?
                 </Typography>  
                <Link 
                    to="/" 
                    className='text-[#023E8A] no-underline text-sm hover:text-[#03045E] hover:underline'         
                >
                    Sign In
                </Link>
            </Box>
           
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: Colors.mediumDark , marginRight: 0.5, }}>
                    Don't have an account?
                 </Typography>  
                <Link 
                    to="/signup" 
                    className='text-[#023E8A] no-underline text-sm hover:text-[#03045E] hover:underline'         
                >
                    Sign Up
                </Link>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
}