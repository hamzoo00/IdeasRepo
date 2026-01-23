import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  Chip,
  Typography,
  Stack,
  Autocomplete,
  CircularProgress,
  FormHelperText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add as AddIcon, CloudUpload as UploadIcon, Search as SearchIcon, Visibility as PreviewIcon } from "@mui/icons-material";
import api from "../axios"; 


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

export default function PostIdea() {
  const [open, setOpen] = useState(false);
  const [previewState, setPreviewState] = useState("idle"); 
  
  // Responsive fullscreen for mobile
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      tags: [],
      description: "",
      summary: "",
      tech_stack: "",
      status: "Ongoing",
    },
  });

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    reset();
    setPreviewState("idle");
  };

 
  const handlePreviewClick = async () => {
    setPreviewState("searching");
    
    setTimeout(() => {
      setPreviewState("ready");
    }, 2000);
  };

  const normalizeTag = (input) => {
    let clean = input.replace(/\s+/g, '');
    if (clean && !clean.startsWith('#')) {
      clean = '#' + clean;
    }
    return clean;
  };

  const onSubmit = async (data) => {
    try {
      await api.post("/post-idea", data);
      alert("Idea posted successfully!");
      handleClose();
      // will add trigger to refresh the ideas list here
    } catch (error) {
      console.error("Failed to post idea", error);
      alert("Failed to post idea. Please try again.");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: Colors.darker,
          "&:hover": { bgcolor: Colors.darkest },
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Post Idea Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 4,
            boxShadow: "0px 10px 40px rgba(3, 4, 94, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: Colors.lightest,
            color: Colors.darkest,
            fontWeight: "bold",
            borderBottom: `1px solid ${Colors.lighter}`,
          }}
        >
          Post New Idea
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ p: 4, bgcolor: "white" }}>
            <Stack spacing={3}>
              
              {/* 1. Title */}
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Title"
                    fullWidth
                    variant="outlined"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    placeholder="e.g. AI Powered Student Portal"
                  />
                )}
              />

           {/* 2. Tags with Autocomplete and Validation */}
             <Controller
                name="tags"
                control={control}
                rules={{
                  validate: (tags) => {
                    if (!tags || tags.length < 3) return "Please add at least 3 tags.";
                    if (tags.length > 5) return "Maximum 5 tags allowed.";

                    // Regex Check: Must start with # and contain ONLY letters and numbers
                    const invalidTags = tags.filter(tag => !/^#[a-zA-Z0-9]+$/.test(tag));
                    if (invalidTags.length > 0) {
                      return `Invalid tag(s): ${invalidTags.join(", ")}. Only letters and numbers allowed (e.g. #React123).`;
                    }
                    
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={value}
                    // INTERCEPT CHANGE HERE
                    onChange={(e, newValue) => {
                      // Normalize the last entered tag (or all of them)
                      const cleanTags = newValue.map(tag => normalizeTag(tag));
                      
                      // Remove duplicates automatically
                      const uniqueTags = [...new Set(cleanTags)];
                      
                      onChange(uniqueTags);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          sx={{ 
                            borderColor: Colors.primary, 
                            color: Colors.darker,
                            bgcolor: /^#[a-zA-Z0-9]+$/.test(option) ? 'transparent' : '#ffebee'
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags (Min 3, Max 5)"
                        placeholder="Type (e.g. #AI) and press Enter"
                        error={!!errors.tags}
                        helperText={
                           errors.tags?.message || 
                           "Auto-formats 'web dev' to '#webdev'."
                        }
                      />
                    )}
                  />
                )}
              />

              {/* 3. Tech Stack */}
              <Controller
                name="tech_stack"
                control={control}
                rules={{ required: "Tech stack is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tech Stack"
                    fullWidth
                    placeholder="e.g. React, Laravel, PostgreSQL, MUI"
                    error={!!errors.tech_stack}
                    helperText={errors.tech_stack?.message}
                  />
                )}
              />

              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                
                {/* 4. Status Dropdown */}
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Project Status</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} label="Project Status">
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.status && <FormHelperText>Status is required</FormHelperText>}
                </FormControl>
              </Stack>

              {/* 5. Summary (Max 5 lines) */}
              <Controller
                name="summary"
                control={control}
                rules={{ 
                    required: "Summary is required",
                    maxLength: { value: 300, message: "Summary is too long (keep it brief)" } 
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Summary (Short Brief)"
                    multiline
                    rows={3} // Approx 3-5 lines
                    fullWidth
                    placeholder="A quick overview of what this project does..."
                    error={!!errors.summary}
                    helperText={errors.summary?.message}
                  />
                )}
              />

              {/* 6. Description  */}
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Detailed Description"
                    multiline
                    rows={6}
                    fullWidth
                    placeholder="Explain the features, goals, and details of your idea..."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />

            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, borderTop: `1px solid ${Colors.lighter}`, bgcolor: Colors.lightest }}>
            <Button 
                onClick={handleClose} 
                sx={{ color: Colors.dark, fontWeight: 600 }}
            >
              Cancel
            </Button>

            {/* Logic for Preview -> Searching -> Submit Button */}
            {previewState === "idle" && (
                <Button
                    variant="contained"
                    onClick={handleSubmit(handlePreviewClick)} // Trigger validation first
                    startIcon={<PreviewIcon />}
                    sx={{
                        bgcolor: Colors.primary,
                        "&:hover": { bgcolor: Colors.darker },
                        px: 4
                    }}
                >
                    Preview
                </Button>
            )}

            {previewState === "searching" && (
                <Button
                    variant="contained"
                    disabled
                    startIcon={<CircularProgress size={20} color="inherit" />}
                    sx={{ bgcolor: Colors.mediumDark, px: 4 }}
                >
                    Searching...
                </Button>
            )}

            {previewState === "ready" && (
                <Button
                    type="submit" // Now it actually submits the form
                    variant="contained"
                    startIcon={<UploadIcon />}
                    sx={{
                        bgcolor: Colors.darker,
                        "&:hover": { bgcolor: Colors.darkest },
                        px: 4
                    }}
                >
                    Submit Idea
                </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}