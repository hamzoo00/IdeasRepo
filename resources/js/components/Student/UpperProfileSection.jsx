import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  CircularProgress,
  Badge,
  FormHelperText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera,
  School as SchoolIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Interests as InterestsIcon,
  Description as BioIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import api from "../axios"; 
import ErrorMessage from "../ErrorMessage";
import { set } from "date-fns";

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

const parseInterests = (interestString) => {
  if (!interestString) return [];
  return interestString.split(",").map((item) => item.trim()).filter(i => i);
};

export default function UpperProfileSection({ profile, isOwner }) {

  const [studentProfile, setStudentProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [serverError, setServerError] = useState("");
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      whatsapp: "",
      interest: "",
      bio: "",
      image: null,
    },
  });

  const bioValue = watch("bio") || "";
  const wordCount = bioValue.trim().split(/\s+/).filter(Boolean).length;
  

  useEffect(() => {
    if (studentProfile) {
      reset({
        full_name: studentProfile.full_name || "",
        email: studentProfile.email || "",
        whatsapp: studentProfile.whatsapp || "",
        interest: studentProfile.interest ? studentProfile.interest.toUpperCase() : "",
        bio: studentProfile.bio || "",
        image: null, 
      });

      if (studentProfile.image) {
         const url = studentProfile.image.startsWith('http') 
            ? studentProfile.image 
            : `http://ideasrepo.test/storage/${studentProfile.image}`;
         setImagePreview(url);
      } else {
         setImagePreview(null);
      }
    }
  }, [studentProfile, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("image", { type: "manual", message: "Image size must be less than 5MB", });
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setError("image", { type: "manual", message: "Only JPG, JPEG, and PNG formats are allowed", });
        return;
      }
      clearErrors("image");
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setServerError("");
    const dataToSend = new FormData();

    dataToSend.append("full_name", data.full_name);
    dataToSend.append("email", data.email);
    dataToSend.append("whatsapp", data.whatsapp || "");
    dataToSend.append("bio", data.bio || "");
    dataToSend.append("interest", data.interest.toUpperCase());

    if (data.image instanceof File) {
      dataToSend.append("image", data.image);
    }

    dataToSend.append("_method", "PUT");

    try {
      const response = await api.post("/updateStudentProfile", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const freshUser = response.data.student;
  
       setStudentProfile(prev => ({
        ...prev,
        ...freshUser,
        image: freshUser.image
      }));  

      setIsEditing(false);
      alert("Profile updated successfully!");
     
    } catch (err) {
      console.error("Update failed", err);
      if (err.response && err.response.status === 422) {
        const serverErrors = err.response.data.errors;
        if (serverErrors.email) setError("email", { type: "server", message: serverErrors.email[0] });
        if (serverErrors.full_name) setError("full_name", { type: "server", message: serverErrors.full_name[0] });
        if (serverErrors.image) setError("image", { type: "server", message: serverErrors.image[0] });
        if (serverErrors.whatsapp) setError("whatsapp", { type: "server", message: serverErrors.whatsapp[0] });
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(); 
    clearErrors();
    if (studentProfile.image) {
        setImagePreview(`http://ideasrepo.test/storage/${studentProfile.image}`);
    } else {
        setImagePreview(null);
    }
  };

  const getDisplayedBio = () => {
    const text = studentProfile.bio || "";
    if (!text) return null;
    
    const words = text.split(/\s+/);
    const limit = 30; 

    if (words.length <= limit || isBioExpanded) {
        return text;
    }
    return words.slice(0, limit).join(" ") + "...";
  };

  const showMoreButton = studentProfile?.bio && studentProfile.bio.split(/\s+/).length > 30;

  if (!studentProfile) {
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
          boxShadow: "0px 4px 20px rgba(0, 180, 216, 0.15)",
          background: "white",
          overflow: "visible",
          mt: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
            {serverError && (
                <Typography color="error" textAlign="center" mb={2}>{serverError}</Typography>
            )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* SECTION 1: HEADER (Avatar & Name) */}         
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              alignItems="center"
              justifyContent="center"
            >
              {/* Avatar Box */}
              <Box position="relative" display="flex" flexDirection="column" alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    isEditing ? (
                      <IconButton
                        component="label"
                        sx={{ bgcolor: Colors.primary, color: "white", "&:hover": { bgcolor: Colors.darker }, width: 40, height: 40 }}
                      >
                        <PhotoCamera fontSize="small" />
                        <input hidden accept="image/png, image/jpeg, image/jpg" type="file" onChange={handleImageChange} />
                      </IconButton>
                    ) : null
                  }
                >
                  <Avatar
                    src={imagePreview}
                    alt={profile.full_name}
                    sx={{ width: 150, height: 150, border: `4px solid ${Colors.lightest}`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                </Badge>
                {errors.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.image.message}</Typography>
                )}
              </Box>

              {/* Name & Uni Info */}
              <Box flex={1} textAlign={{ xs: "center", md: "left" }} width="100%">
                {isEditing ? (
                  <Stack spacing={2}>
                    <Controller
                      name="full_name"
                      control={control}
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Full Name" variant="outlined" size="small" error={!!errors.full_name} helperText={errors.full_name?.message} />
                      )}
                    />
                    <TextField disabled label="University" value={studentProfile.university_name || ""} size="small" sx={{ bgcolor: Colors.lightest }} />
                  </Stack>
                ) : (
                  <>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: Colors.darkest, mb: 0.5 }}>{studentProfile.full_name}</Typography>
                    <Stack direction="row" alignItems="center" justifyContent={{ xs: "center", md: "flex-start" }} spacing={1} sx={{ mt: 1, color: Colors.dark }}>
                      <SchoolIcon fontSize="small" />
                      <Typography variant="body1">{studentProfile.university_name}</Typography>
                    </Stack>
                  </>
                )}
              </Box>

              {/* Action Buttons */}
              <Box>
                {isOwner && (
                    !isEditing ? (
                    <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditing(true)} sx={{ bgcolor: Colors.darker, "&:hover": { bgcolor: Colors.darkest }, borderRadius: 2, textTransform: "none", px: 3 }}>Edit Profile</Button>
                    ) : (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} disabled={isSubmitting} sx={{ color: Colors.dark, borderColor: Colors.dark }}>Cancel</Button>
                        <Button variant="contained" startIcon={isSubmitting ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />} type="submit" disabled={isSubmitting} sx={{ bgcolor: Colors.primary, "&:hover": { bgcolor: Colors.darker } }}>Save</Button>
                    </Stack>
                    )
                )}
              </Box>
            </Stack>

            {/* DIVIDER 1 */}
            <Divider sx={{ my: 4, borderColor: Colors.lighter }} />

            
            {/* SECTION 2: Academic & Contact Info */}
            
            <Box>
                <Typography variant="h6" sx={{ color: Colors.darkest, mb: 2, fontWeight: 600 }}>
                  Academic & Contact Info
                </Typography>

                {/* Using Stack with flex-wrap instead of Grid to prevent row gaps affecting content */}
                <Stack direction="row" flexWrap="wrap" spacing={4} useFlexGap>
                    
                    {/* Status Block */}
                    <Box sx={{ flex: "1 1 300px", p: 2, bgcolor: Colors.lightest, borderRadius: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>Current Status</Typography>
                        <Typography variant="body1" fontWeight={600} color={Colors.darker}>{studentProfile.degree} </Typography>
                        <Typography variant="body2">Batch: {studentProfile.batch} • Semester: {studentProfile.semester}</Typography>
                    </Box>

                    {/* Contact Block */}
                    <Box sx={{ flex: "1 1 300px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         {isEditing ? (
                            <Stack spacing={2}>
                              <Controller
                                name="email"
                                control={control}
                                rules={{ required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }}}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth label="Email" size="small" error={!!errors.email} helperText={errors.email?.message} InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: Colors.mediumDark }} /> }} />
                                )}
                              />
                              <Controller
                                name="whatsapp"
                                control={control}
                                rules={{ pattern: { value: /^\+92-\d{10}$/, message: "Format must be +92-xxxxxxxxxx" } }}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth label="WhatsApp" size="small" error={!!errors.whatsapp} helperText={errors.whatsapp?.message} InputProps={{ startAdornment: <WhatsAppIcon sx={{ mr: 1, color: Colors.mediumDark }} /> }} />
                                )}
                              />
                            </Stack>
                          ) : (
                            <Stack spacing={1}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <EmailIcon sx={{ color: Colors.primary }} />
                                <Typography sx={{ wordBreak: "break-all" }}>{studentProfile.email}</Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <WhatsAppIcon sx={{ color: Colors.primary }} />
                                <Typography>{studentProfile.whatsapp || "No number added"}</Typography>
                              </Stack>
                            </Stack>
                          )}
                    </Box>
                </Stack>
            </Box>

            {/* DIVIDER 2 (New Separation Line) */}
            <Divider sx={{ my: 4, borderColor: Colors.lighter }} />

            {/* SECTION 3: Details (Bio & Interests) */}
            <Box>
                <Typography variant="h6" sx={{ color: Colors.darkest, mb: 2, fontWeight: 600 }}>
                   Details
                </Typography>

                {isEditing ? (
                  <Stack spacing={3} sx={{ width: "100%" }}>
                    <Controller
                        name="interest"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                            <TextField 
                                {...rest}
                                value={value}
                                onChange={(e) => onChange(e.target.value.toUpperCase())} 
                                fullWidth
                                label="Areas of Interest (Comma Separated)"
                                placeholder="CLOUD COMPUTING, AI, WEB DEV"
                                multiline
                                rows={2}
                                InputProps={{ startAdornment: <InterestsIcon sx={{ mr: 1, mt: 1, color: Colors.mediumDark }} /> }}
                                helperText="Tags will be capitalized automatically."
                            />
                        )}
                    />

                    <Box sx={{ width: "100%" }}>
                        <Controller
                            name="bio"
                            control={control}
                            rules={{
                                validate: (val) => {
                                    const count = val ? val.trim().split(/\s+/).filter(Boolean).length : 0;
                                    return count <= 400 || "Bio cannot exceed 400 words.";
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Bio (About Yourself)"
                                    placeholder="Tell us about yourself..."
                                    multiline
                                    rows={5}
                                    error={!!errors.bio}
                                    InputProps={{ startAdornment: <BioIcon sx={{ mr: 1, mt: 1, color: Colors.mediumDark }} /> }}
                                />
                            )}
                        />
                        <Stack direction="row" justifyContent="space-between" mt={0.5}>
                             <FormHelperText error={!!errors.bio}>{errors.bio?.message}</FormHelperText>
                             <Typography variant="caption" color={wordCount > 400 ? "error" : "textSecondary"}>
                                {wordCount} / 400 words
                             </Typography>
                        </Stack>
                    </Box>
                  </Stack>
                ) : (
                  <Box sx={{ width: "100%" }}> 
                    
                    {/* Interests Display */}
                    <Typography variant="subtitle2" gutterBottom color="textSecondary">Interests</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3, width: "100%" }}>
                      {parseInterests(studentProfile.interest).length > 0 ? (
                        parseInterests(studentProfile.interest).map((tag, index) => (
                          <Chip key={index} label={tag} sx={{ bgcolor: Colors.light, color: Colors.darkest, fontWeight: 500 }} />
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">No interests added yet.</Typography>
                      )}
                    </Box>
                    
                    {/* Bio Display */}
                    <Typography variant="subtitle2" gutterBottom color="textSecondary">Bio</Typography>
                    <Box sx={{ p: 2, border: `1px dashed ${Colors.primary}`, borderRadius: 2, bgcolor: "#FAFAFA", width: "100%" }}>
                        {studentProfile.bio ? (
                            <>
                                <Typography variant="body2" color="textSecondary" sx={{whiteSpace: 'pre-line'}}>
                                    {getDisplayedBio()}
                                </Typography>
                                
                                {showMoreButton && (
                                    <Button
                                        size="small"
                                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                                        endIcon={isBioExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        sx={{ mt: 1, textTransform: 'none', color: Colors.mediumDark, padding: 0, "&:hover": { background: "transparent", color: Colors.dark } }}
                                        disableRipple
                                    >
                                        {isBioExpanded ? "Show Less" : "Show More"}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
                                "Student at {studentProfile.university_name} pursuing {profile.degree}."
                            </Typography>
                        )}
                    </Box>
                  </Box>
                )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}