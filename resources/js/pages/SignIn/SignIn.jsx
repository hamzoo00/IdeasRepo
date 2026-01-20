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
  darkest:     "#03045E", 
  darker:      "#023E8A",
  dark:        "#0077B6",
  mediumDark:  "#0096C7",
  primary:     "#00B4D8", 
  mediumLight: "#48CAE4",
  light:       "#90E0EF",
  lighter:     "#ADE8F4",
  lightest:    "#CAF0F8", 
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
        
     const payload = { 
                identifier: data.identifier,
                password: data.password          
          }; 
     const response = await api.post('/login', payload );
     console.log(response.data.message);

     const studentId = response.data.student.id;
     const studentName = response.data.student.full_name;
     localStorage.setItem("student", JSON.stringify(response.data.student));
     navigate(`/student/${studentName}/${studentId}`)
         
     } catch (error) {
      console.error("Login failed:", error);
    }
    return new Promise((resolve) => setTimeout(resolve, 500));
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
              label="Email Address or Student ID"
              autoComplete="email"
              autoFocus
              {...register("identifier", { 
                required: "Email or Student ID is required",
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
            
          {/* Sign in */}
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
            
          {/* Sign in as teacher */}
           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: Colors.mediumDark , marginRight: 0.5, }}>
                    Sign In as Teacher?
                 </Typography>  
                <Link 
                    to="/teacherSignIn" 
                    className='text-[#023E8A] no-underline text-sm hover:text-[#03045E] hover:underline'         
                >
                    Sign In
                </Link>
            </Box>

           {/* Sign Up */}
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