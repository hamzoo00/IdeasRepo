import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
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
  Stack,
  Autocomplete,
  CircularProgress,
  FormHelperText,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
  Typography
} from "@mui/material";
import { Add as AddIcon, CloudUpload as UploadIcon, Visibility as PreviewIcon } from "@mui/icons-material";
import api from "./axios";
import ErrorMessage from "./ErrorMessage"; 

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
  errorBg: "#FFEBEE", // Added for invalid tags
  errorBorder: "#FFCDD2"
};

export default function PostIdea() { 

  const [open, setOpen] = useState(false);
  const [previewState, setPreviewState] = useState("idle"); 
  const [apiError, setApiError] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      tags: [],
      description: "",
      summary: "",
      tech_stack: "",
      status: "Ongoing",
      is_embargo: false,
    },
    shouldUnregister: true, 
  });

  const isEmbargo = watch("is_embargo");

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    reset();
    setPreviewState("idle");
    setApiError(null);
  };

  const handlePreviewClick = async () => {
    setPreviewState("searching");
    setTimeout(() => {
      setPreviewState("ready");
    }, 2000);
  };

  const normalizeTag = (input) => {

    let clean = input.replaceAll(/\s+/g, '').trim();
    
    if (!clean.startsWith('#')) {
      clean = '#' + clean;
    }

    let text = clean.substring(1); 

    if (text.length === 1) {
        return '#' + text.toUpperCase();
    }

    if (text.length > 1) {
       const first = text[0];
       const second = text[1];

       // Helper: Check if character is a letter/number and uppercase/lowercase
       const isUpper = (char) => char.toUpperCase() !== char.toLowerCase() && char === char.toUpperCase();
       const isLower = (char) => char.toUpperCase() !== char.toLowerCase() && char === char.toLowerCase();
 
    if (isUpper(first) && isUpper(second)) {
           text = first + text.slice(1).toLowerCase();
       }
       
    else if (isLower(first) && isLower(second)) {
           text = first.toUpperCase() + text.slice(1); 
       }
    }

    return '#' + text;
  };

// Helper to check validity for styling
  const isValidTag = (tag) => /^#[a-zA-Z0-9]+$/.test(tag);

  const onSubmit = async (data) => {
    try {
      const endpoint = `/post-idea`;
      const payload = { ...data, is_embargo: isEmbargo };
      await api.post(endpoint, payload);
      alert("Idea posted successfully!"); 
      handleClose();
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to post idea", error);
      setApiError(error.response?.data?.message || "Failed to post idea.");
    }
  };

  const countWords = (str) => {
    return str.trim().split(/\s+/).length;
  };

  

  return (
    <>
      <ErrorMessage error={apiError} clearError={() => setApiError(null)} />

      <Fab
        color="primary"
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

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: fullScreen ? 0 : 4 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: Colors.lightest,
            color: Colors.darkest,
            fontWeight: "bold",
            borderBottom: `1px solid ${Colors.lighter}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Post New Idea

          {/* Embargo Checkbox */}
          <Controller
            name="is_embargo"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox 
                    {...field} 
                    checked={field.value} 
                    onChange={(e) => {
                        field.onChange(e);
                        setPreviewState("idle"); 
                    }}
                    sx={{ color: Colors.darker, '&.Mui-checked': { color: Colors.darkest } }} 
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: Colors.darker }}>
                    Enable Embargo
                  </Typography>
                }
              />
            )}
          />
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ p: 4, bgcolor: "white" }}>
            <Stack spacing={3}>

              {isEmbargo && (
                <Typography variant="caption" sx={{ color: "#d32f2f", bgcolor: "#ffebee", p: 1, borderRadius: 1, fontWeight: 500 }}>
                  Embargo Enabled: Description and Tech Stack are hidden. Similarity check will run on Title & Summary only.
                </Typography>
              )}
              
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
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

              {/* 2. Tags with Error Styling */}
              <Controller
                name="tags"
                control={control}
                rules={{
                  validate: (tags) => {
                    if (!tags || tags.length < 3) return "Min 3 tags required.";
                    if (tags.length > 5) return "Max 5 tags allowed.";
                    const invalidTags = tags.filter(tag => !isValidTag(tag));
                    if (invalidTags.length > 0) return "Only letters/numbers allowed (e.g. #AI)";
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={value || []}
                    onChange={(e, newValue) => {
                      const cleanTags = newValue.map(tag => normalizeTag(tag));
                      onChange([...new Set(cleanTags)]);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const valid = isValidTag(option);
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            sx={{ 
                              // CONDITIONAL STYLING RESTORED HERE
                              borderColor: valid ? Colors.primary : "red", 
                              bgcolor: valid ? "transparent" : Colors.errorBg,
                              color: valid ? Colors.darker : "#d32f2f",
                              fontWeight: valid ? 400 : 600
                            }}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags (Min 3, Max 5)"
                        placeholder="Type and enter..."
                        error={!!errors.tags}
                        helperText={errors.tags?.message || "Valid format: #React, #AI"}
                      />
                    )}
                  />
                )}
              />

              {!isEmbargo && (
                <Controller
                  name="tech_stack"
                  control={control}
                  rules={{ required: "Tech stack is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tech Stack"
                      fullWidth
                      error={!!errors.tech_stack}
                      helperText={errors.tech_stack?.message}
                    />
                  )}
                />
              )}
             {/* 3. Status*/}
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
              </FormControl>

             {/* 4. Summary */}
              <Controller
                name="summary"
                control={control}
                rules={{ 
                    required: "Summary is required",
                    validate: (value) => countWords(value) <= 100 || `Summary cannot exceed 100 words. (Current: ${countWords(value)})`
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Summary (Max 100 Words)"
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.summary}
                    helperText={errors.summary?.message}
                  />
                )}
              />

             {/* 5. Description */}
              {!isEmbargo && (
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
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              )}

            </Stack>
          </DialogContent>

         {/* Action Buttons */}
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${Colors.lighter}`, bgcolor: Colors.lightest }}>
            <Button onClick={handleClose} sx={{ color: Colors.dark, fontWeight: 600 }}>
              Cancel
            </Button>

            {previewState === "idle" && (
                <Button
                    variant="contained"
                    onClick={handleSubmit(handlePreviewClick)} 
                    startIcon={<PreviewIcon />}
                    sx={{ bgcolor: Colors.primary, "&:hover": { bgcolor: Colors.darker }, px: 4 }}
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
                    Checking...
                </Button>
            )}

            {previewState === "ready" && (
                <Button
                    type="submit" 
                    variant="contained"
                    startIcon={<UploadIcon />}
                    sx={{ bgcolor: Colors.darker, "&:hover": { bgcolor: Colors.darkest }, px: 4 }}
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