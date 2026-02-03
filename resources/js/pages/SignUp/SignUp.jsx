import { useForm,  } from 'react-hook-form';
import {useState} from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper, 
  CssBaseline,
  MenuItem,
  Grid
} from '@mui/material';
import {Link} from 'react-router'
import api from '../../components/axios.js';
import ErrorMessage from  '../../components/ErrorMessage.jsx';
import { useNavigate, } from "react-router-dom";

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


const PROGRAMS = [
  { value: 'BSDEGREES' , label: 'Undergraduate (BS/BBA)' },
  { value: 'MSDEGREES' , label: 'Master (MS/MBA)' },
  { value: 'PHDDEGREES', label: 'PhD' },
];

const SEMESTERS = [
  { value: '1', label: '1st Semester' },
  { value: '2', label: '2nd Semester' },
  { value: '3', label: '3rd Semester' },
  { value: '4', label: '4th Semester' },
  { value: '5', label: '5th Semester' },
  { value: '6', label: '6th Semester' },
  { value: '7', label: '7th Semester' },
  { value: '8', label: '8th Semester' },
];

const BSDEGREES = [
  // Computing & Data
  { value: 'bs_se', label: 'BS Software Engineering' },
  { value: 'bs_cs', label: 'BS Computer Science' },
  { value: 'bs_ds', label: 'BS Data Science' },
  { value: 'bs_ai', label: 'BS Artificial Intelligence' },
  { value: 'bs_it', label: 'BS Information Technology' },
  // Business & Management
  { value: 'bba', label: 'Bachelor of Business Administration (BBA)' },
  { value: 'bs_af', label: 'BS Accounting & Finance' },
  { value: 'bs_eco', label: 'BS Economics' },
  { value: 'bs_scm', label: 'BS Supply Chain Management' },
  // Social Sciences & Humanities
  { value: 'bs_eng', label: 'BS English' },
  { value: 'bs_psy', label: 'BS Psychology' },
  { value: 'bs_soc', label: 'BS Sociology' },
  { value: 'bs_pol', label: 'BS Political Science' },
  { value: 'bs_ir', label: 'BS International Relations' },
  { value: 'bs_dev', label: 'BS Development Studies' },
];

const MSDEGREES = [
  // Computing & Data
  { value: 'ms_se', label: 'MS Software Engineering' },
  { value: 'ms_cs', label: 'MS Computer Science' },
  { value: 'ms_ds', label: 'MS Data Science' },
];
const PHDDEGREES = [
    // Computing & Data
  { value: 'ps_se', label: 'Phd Software Engineering' },
  { value: 'ps_cs', label: 'Phd Artificial Intelligence' },
  { value: 'ps_ds', label: 'Phd Information Security' },
];

const DEGREES = {
  BSDEGREES: BSDEGREES,
  MSDEGREES: MSDEGREES,
  PHDDEGREES: PHDDEGREES,
};


export default function SignUp() {
 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  const { 
    register, 
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      university: "Institute of Management Sciences" 
    }
  });

const selectedProgram = watch("program");
const degreeOptions = selectedProgram ? DEGREES[selectedProgram] : [];

const password = watch("password");
  

  const onSubmit = async(data) => {
  try {
    const payload = {
      full_name: data.fullName,
      university_name: 'Institute of Management Sciences',
      student_id: data.studentId,
      batch: data.batch,
      program: data.program,
      degree: data.degree,
      semester: data.semester,
      email: data.email,
      whatsapp: data.whatsapp,
      interest: data.interest,
      password: data.password,
      password_confirmation: data.confirm_password,
    };

    const response = await api.post("/register", payload);
    alert(response.data.message);
    navigate('/');
    reset();

  } catch (error) {
    setError(error.response?.data?.message || "An error occurred during registration.");
  }
};


  return (
    <>
    <ErrorMessage 
        error={error} 
        clearError={() => setError(null)} 
      />
   
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.lightest,
        py: 4 
      }}
    >
      <CssBaseline />
      
      <Container maxWidth="sm"> 
        <Paper 
          elevation={6} 
          sx={{ 
            p: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: '#ffffff'
          }}
        >
         
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
            Create your account
          </Typography>

          {/* Form Start */}
          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)} 
            noValidate 
            sx={{ mt: 1, width: '100%' }}
          >
            <Grid container spacing={2}>
              
              {/* 1. Full Name */}
              
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  {...register("fullName", { required: "Full Name is required" })}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                />
              
              {/* 2. University */}
              
                <TextField
                  select
                  required
                  fullWidth
                  id="university"
                  label="University"
                  defaultValue="Institute of Management Sciences"
                  inputProps={register("university", { required: "University is required" })}
                  error={!!errors.university}
                  helperText={errors.university?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                >
                    <MenuItem value="Institute of Management Sciences">
                      Institute of Management Sciences
                    </MenuItem>
                </TextField>
              

              {/* 3. Student ID  */}       
                <TextField
                  required
                  fullWidth
                  id="studentId"
                  label="Student ID"
                  placeholder="e.g. 194400795"
                  type="number" 
                  {...register("studentId", { 
                    required: "Student ID is required",
                    pattern: {
                      value: /^[0-9]{9}$/,
                      message: "Student ID must be exactly 9 digits"
                    }
                  })}
                  error={!!errors.studentId}
                  helperText={errors.studentId?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                />
            

              {/* 4. Batch */}
              
                <TextField
                  required
                  fullWidth
                  id="batch"
                  label="Batch"
                  placeholder="20XX-XX"
                  {...register("batch", { 
                    required: "Batch is required",
                    pattern: {
                        value: /^20\d{2}-\d{2}$/,
                        message: "Format must be 20XX-XX"
                    }
                  })}
                  error={!!errors.batch}
                  helperText={errors.batch?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                />
             

              {/* 5. Program */}
             
                <TextField
                  select
                  required
                  fullWidth
                  id="program"
                  label="Program"
                  defaultValue=""
                  inputProps={register("program", { required: "Program is required" })}
                  error={!!errors.program}
                  helperText={errors.program?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                >
                  {PROGRAMS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
             

              {/* 6. Degree */}
          
                <TextField
                  select
                  required
                  fullWidth
                  id="degree"
                  label="Degree"
                  defaultValue=""
                  inputProps={register("degree", { required: "Degree is required" })}
                  error={!!errors.degree}
                  helperText={errors.degree?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                >
                   
                  {degreeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              

              {/* 7. Semester */}
             
                <TextField
                  select
                  required
                  fullWidth
                  id="semester"
                  label="Semester"
                  defaultValue=""
                  inputProps={register("semester", { required: "Semester is required" })}
                  error={!!errors.semester}
                  helperText={errors.semester?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                >
                   {SEMESTERS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
             

              {/* 8a. Email */}
              
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                   })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                />
             

               {/* 8b. Whatsapp Number */}
               
                <TextField
                  fullWidth
                  id="whatsapp"
                  label="Whatsapp Number"
                  placeholder="+92-3001234567"
                  {...register("whatsapp", { 
                    pattern: {
                        value: /^\+92-\d{10}$/,
                        message: "Format must be +92-xxxxxxxxxx"
                    }
                  })}
                  error={!!errors.whatsapp}
                  helperText={errors.whatsapp?.message}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                />


                {/* 10. Password */}
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

                 {/* 10 Confirm Password  */}
              <TextField
                 margin="normal"
                 required
                 fullWidth
                 name="confirm_password"
                 label="Confirm Password"
                 type="password"
                 id="confirm_password"
                 autoComplete="current_password"
                {...register("confirm_password", { 
                    required: {
                      value: true,
                      message: "Please confirm your password",
                    },
                  
                    validate: (value) =>
                      value === password || "Password do not match",
                  })}

                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}

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

              {/* 9. Area of Interest (Optional) */}
              
                <TextField
                  fullWidth
                  id="interest"
                  label="Area of Interest (Optional)"
                  multiline
                  rows={2}
                  placeholder="e.g. Web Development, AI, Content Writing..."
                  {...register("interest")}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: Colors.primary }}}
                />
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 4,
                mb: 2,
                bgcolor: Colors.darker,
                '&:hover': {
                  bgcolor: Colors.darkest,
                },
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>

            {/* Sign In Link */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: Colors.mediumDark , marginRight: 0.5, }}>
                    Already have an account?
                 </Typography>  
                <Link 
                    to="/" 
                    className='text-[#023E8A] no-underline text-sm hover:text-[#03045E] hover:underline'         
                >
                    Sign In
                </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  </>
  );
}