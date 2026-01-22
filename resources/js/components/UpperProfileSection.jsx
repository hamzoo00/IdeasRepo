import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Stack,
  Divider,
  Grid,
  CircularProgress,
  Badge,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera,
  School as SchoolIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import api from '../components/axios'

// --- Color Palette ---
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

// --- Helper: Parse interest string to array ---
const parseInterests = (interestString) => {
  if (!interestString) return [];
  return interestString.split(",").map((item) => item.trim());
};

export default function UpperProfileSection({ profile, isOwner }) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    full_name: "",
    university_name: "",
    student_id: "",
    batch: "",
    program: "",
    degree: "",
    semester: "",
    email: "",
    whatsapp: "",
    interest: "",
    image: null,  // File object for upload
  });

  // --- 1. Fetch Data on Mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Adjust API endpoint as needed
        const response = await api.get("/api/getStudentProfile"); 
        const data = response.data.student; // Assuming response structure { student: { ... } }

        setFormData({
          full_name: data.full_name || "",
          university_name: data.university_name || "",
          student_id: data.student_id || "",
          batch: data.batch || "",
          program: data.program || "",
          degree: data.degree || "",
          semester: data.semester || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          interest: data.interest || "",
          image: null, // Reset file input
        });
        
        // If API returns an image URL, set it here
        if (data.image) {
          setImagePreview(`http://ideasrepo.test/storage/${data.image}`);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- 2. Handle Input Changes ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. Handle Image Selection ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Create local preview
    }
  };

  // --- 4. Submit Update ---
  const handleSave = async () => {
    const dataToSend = new FormData();
    // Append all text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "image" && formData[key] !== null) {
        dataToSend.append(key, formData[key]);
      }
    });
    // Append image only if changed
    if (formData.image) {
      dataToSend.append("image", formData.image);
    }

    // Spoof PUT method if your Laravel route expects PUT but FormData requires POST header logic
    dataToSend.append("_method", "PUT"); 

    try {
      await api.post("/updateStudentProfile", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress sx={{ color: Colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mb: 4, display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0, 180, 216, 0.15)", // Soft shadow using brand colors
          background: "white",
          overflow: "visible", // For avatar overlap if needed
          mt: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          
          {/* --- Top Row: Avatar & Main Info --- */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            {/* 1. Profile Image */}
            <Box position="relative">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  isEditing ? (
                    <IconButton
                      component="label"
                      sx={{
                        bgcolor: Colors.primary,
                        color: "white",
                        "&:hover": { bgcolor: Colors.darker },
                        width: 40,
                        height: 40,
                      }}
                    >
                      <PhotoCamera fontSize="small" />
                      <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    </IconButton>
                  ) : null
                }
              >
                <Avatar
                  src={imagePreview}
                  alt={formData.full_name}
                  sx={{
                    width: 150,
                    height: 150,
                    border: `4px solid ${Colors.lightest}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </Badge>
            </Box>

            {/* 2. Basic Info (Name/University) */}
            <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
              {isEditing ? (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                  {/* Note: ID usually isn't editable by student, but added logic if needed */}
                  <TextField
                     disabled
                     label="Student ID"
                     value={formData.student_id}
                     size="small"
                     sx={{ bgcolor: Colors.lightest }}
                  />
                </Stack>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: Colors.darkest, mb: 0.5 }}
                  >
                    {formData.full_name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: Colors.mediumDark, fontWeight: 500 }}
                  >
                    @{formData.student_id}
                  </Typography>
                  
                  {/* University Badge */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent={{ xs: "center", md: "flex-start" }}
                    spacing={1}
                    sx={{ mt: 1, color: Colors.dark }}
                  >
                    <SchoolIcon fontSize="small" />
                    <Typography variant="body1">{formData.university_name}</Typography>
                  </Stack>
                </>
              )}
            </Box>

            {/* 3. Action Buttons */}
            <Box>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    bgcolor: Colors.darker,
                    "&:hover": { bgcolor: Colors.darkest },
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setIsEditing(false)}
                    sx={{ color: Colors.dark, borderColor: Colors.dark }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ bgcolor: Colors.primary, "&:hover": { bgcolor: Colors.darker } }}
                  >
                    Save
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>

          <Divider sx={{ my: 4, borderColor: Colors.lighter }} />

          {/* --- Bottom Section: Details Grid --- */}
          <Grid container spacing={4}>
            
            {/* Left Col: Academic & Contact */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: Colors.darkest, mb: 2, fontWeight: 600 }}>
                Academic & Contact Info
              </Typography>
              
              <Stack spacing={2}>
                {/* Academic Row (Read Only usually) */}
                <Box sx={{ p: 2, bgcolor: Colors.lightest, borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Current Status
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color={Colors.darker}>
                    {formData.degree} ({formData.program})
                  </Typography>
                  <Typography variant="body2">
                    Batch: {formData.batch} • Semester: {formData.semester}
                  </Typography>
                </Box>

                {/* Contact Fields */}
                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      size="small"
                      InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: Colors.mediumDark }} /> }}
                    />
                    <TextField
                      fullWidth
                      label="WhatsApp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      size="small"
                      InputProps={{ startAdornment: <WhatsAppIcon sx={{ mr: 1, color: Colors.mediumDark }} /> }}
                    />
                  </>
                ) : (
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <EmailIcon sx={{ color: Colors.primary }} />
                      <Typography>{formData.email}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <WhatsAppIcon sx={{ color: Colors.primary }} />
                      <Typography>{formData.whatsapp || "No number added"}</Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Grid>

            {/* Right Col: Interests & Bio */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: Colors.darkest, mb: 2, fontWeight: 600 }}>
                Interests & Bio
              </Typography>

              {isEditing ? (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Areas of Interest (comma separated)"
                    placeholder="e.g. Web Dev, AI, Data Science"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                  {/* If you had a bio column, it would go here. For now we use Interest as the main descriptor */}
                </Stack>
              ) : (
                <Box>
                  {/* Chips for Interests */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {parseInterests(formData.interest).length > 0 ? (
                      parseInterests(formData.interest).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          sx={{
                            bgcolor: Colors.light,
                            color: Colors.darkest,
                            fontWeight: 500,
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No interests added yet.
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Static text if you want a bio placeholder */}
                  <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
                    "Student at {formData.university_name} pursuing {formData.degree}."
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

        </CardContent>
      </Card>
    </Box>
  );
};

