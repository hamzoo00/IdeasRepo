import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Chip,
  Box,
  Collapse,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Divider,
  Stack,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as PreviewIcon,
  CloudUpload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Flag as FlagIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import api from './axios';


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

export default function IdeaCard({ idea, isOwner, refreshIdeas }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Preview Flow State: 'idle' | 'searching' | 'ready'
  const [previewState, setPreviewState] = useState('idle');

  // Report Dialog State
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Edit Data State
  const [editData, setEditData] = useState({
    title: idea.title,
    summary: idea.summary,
    description: idea.description,
    tech_stack: idea.tech_stack,
    status: idea.status,
    tags: idea.tags ? idea.tags.map(t => t.name) : []
  });

  // --- Logic: Get User Image & Name ---
  const authorName = idea.author?.full_name || idea.author?.name || "Unknown User";
  
  // specific logic to handle profile image path
  const getProfileImage = () => {
      const imgPath = idea.author?.image;
      if (!imgPath) return null;
      return imgPath.startsWith('http') 
          ? imgPath 
          : `http://ideasrepo.test/storage/${imgPath}`;
  };

  // --- Logic: Normalize Tags ---
  const normalizeTag = (input) => {
    let clean = input.replaceAll(/\s+/g, '').trim();
    if (!clean) return "";

    if (!clean.startsWith('#')) {
      clean = '#' + clean;
    }

    let text = clean.substring(1);

    if (text.length === 1) return '#' + text.toUpperCase();

    if (text.length > 1) {
       const first = text[0];
       const second = text[1];
       const isUpper = (char) => char.toUpperCase() !== char.toLowerCase() && char === char.toUpperCase();
       const isLower = (char) => char.toUpperCase() !== char.toLowerCase() && char === char.toLowerCase();

       if (isUpper(first) && isUpper(second)) {
           text = first + text.slice(1).toLowerCase();
       } else if (isLower(first) && isLower(second)) {
           text = first.toUpperCase() + text.slice(1);
       }
    }
    return '#' + text;
  };

  // --- Handlers ---
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
        try {
            await api.delete(`/ideas/${idea.id}`);
            if (refreshIdeas) refreshIdeas();
        } catch (error) {
            console.error("Delete failed", error);
        }
    }
    handleMenuClose();
  };

  // 1. Preview Handler (Simulate Check)
  const handlePreviewClick = () => {
      setPreviewState('searching');
      
      // Simulate API delay for similarity check
      setTimeout(() => {
          // If check passes:
          setPreviewState('ready');
          // alert("No match found! You can now update.");
      }, 1500);
  };

  // 2. Final Update Handler
  const handleUpdate = async () => {
    try {
        await api.put(`/ideas/${idea.id}`, editData);
        setEditing(false);
        setPreviewState('idle'); // Reset state
        if (refreshIdeas) refreshIdeas();
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update idea.");
    }
  };

  const handleCancelEdit = () => {
      setEditing(false);
      setPreviewState('idle'); // Reset on cancel
  };

  // --- RENDER: Edit Mode ---
  if (editing) {
    return (
      <Card sx={{ mb: 3, borderRadius: 4, boxShadow: "0px 4px 20px rgba(0,0,0,0.1)", overflow: 'visible' }}>
        <Box sx={{ p: 3, bgcolor: Colors.primary, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <Typography variant="h6" color="white" fontWeight="bold">Edit Idea</Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
                <TextField 
                    fullWidth label="Title" variant="outlined" 
                    value={editData.title} 
                    onChange={(e) => setEditData({...editData, title: e.target.value})} 
                />
                
                <Autocomplete
                    multiple freeSolo
                    options={[]}
                    value={editData.tags}
                    onChange={(event, newValue) => {
                        const cleanTags = newValue.map(tag => normalizeTag(tag));
                        setEditData({ ...editData, tags: [...new Set(cleanTags)] });
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            return <Chip key={key} label={option} {...tagProps} size="small" sx={{ bgcolor: Colors.lightest, color: Colors.darker }} />;
                        })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Tags" placeholder="Add tag..." />
                    )}
                />

                <TextField 
                    fullWidth multiline rows={2} label="Summary" 
                    value={editData.summary} 
                    onChange={(e) => setEditData({...editData, summary: e.target.value})} 
                />
                
                <TextField 
                    fullWidth multiline rows={4} label="Detailed Description" 
                    value={editData.description} 
                    onChange={(e) => setEditData({...editData, description: e.target.value})} 
                />
                
                <TextField 
                    fullWidth label="Tech Stack" 
                    value={editData.tech_stack} 
                    onChange={(e) => setEditData({...editData, tech_stack: e.target.value})} 
                />
            </Stack>
        </CardContent>

        {/* Action Bar (Matches your specific request) */}
        <Box sx={{ p: 3, borderTop: `1px solid ${Colors.lighter}`, bgcolor: Colors.lightest, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
             <Button onClick={handleCancelEdit} sx={{ color: Colors.dark, fontWeight: 600 }}>
                 Cancel
             </Button>

             {previewState === "idle" && (
                 <Button
                     variant="contained"
                     onClick={handlePreviewClick}
                     startIcon={<PreviewIcon />}
                     sx={{ bgcolor: Colors.primary, "&:hover": { bgcolor: Colors.darker }, px: 3 }}
                 >
                     Preview Changes
                 </Button>
             )}

             {previewState === "searching" && (
                 <Button
                     variant="contained"
                     disabled
                     startIcon={<CircularProgress size={20} color="inherit" />}
                     sx={{ bgcolor: Colors.mediumDark, px: 3 }}
                 >
                     Checking...
                 </Button>
             )}

             {previewState === "ready" && (
                 <Button
                     variant="contained"
                     onClick={handleUpdate}
                     startIcon={<UploadIcon />}
                     sx={{ bgcolor: Colors.darker, "&:hover": { bgcolor: Colors.darkest }, px: 3 }}
                 >
                     Update Idea
                 </Button>
             )}
        </Box>
      </Card>
    );
  }

  // --- RENDER: Normal View ---
  return (
    <>
      <Card 
        sx={{ 
            mb: 3, 
            borderRadius: 4, 
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", 
            transition: "0.3s",
            border: `1px solid ${Colors.lightest}`,
            "&:hover": { boxShadow: "0px 8px 25px rgba(0, 180, 216, 0.2)" } 
        }}
      >
        {/* TOP: Header */}
        <CardHeader
          sx={{ pb: 1 }}
          avatar={
            <Avatar 
                src={getProfileImage()} 
                alt={authorName}
                sx={{ bgcolor: Colors.primary, width: 48, height: 48, border: `2px solid ${Colors.lighter}` }}
            >
              {/* Fallback to first letter if no image */}
              {!getProfileImage() && authorName.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon color="action" />
            </IconButton>
          }
          title={
            <Typography variant="subtitle1" fontWeight="bold" color={Colors.darkest}>
                {authorName}
            </Typography>
          }
          subheader={
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
              {idea.is_edited && <span style={{ fontStyle: 'italic', marginLeft: 6 }}>(edited)</span>}
            </Typography>
          }
        />

        {/* MIDDLE: Content */}
        <CardContent sx={{ pt: 1, pb: 1 }}>
          <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: 'pointer' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: Colors.darker, mb: 1 }}>
                {idea.title}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {idea.tags && idea.tags.map((tag) => (
                   <Chip 
                        key={tag.id} 
                        label={tag.name} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5, bgcolor: Colors.lightest, color: Colors.darker, fontWeight: 500 }} 
                   />
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {idea.summary}
              </Typography>
          </Box>
        </CardContent>

        {/* EXPANDED SECTION */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ px: 2, pb: 2 }}>
             <Box sx={{ p: 2, bgcolor: "#FAFAFA", borderRadius: 2, border: `1px dashed ${Colors.lighter}` }}>
                 <Typography variant="subtitle2" color={Colors.dark} gutterBottom>Description:</Typography>
                 <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {idea.description || "No detailed description provided."}
                 </Typography>
             </Box>
          </Box>
        </Collapse>

        {/* DIVIDER */}
        <Divider sx={{ mx: 2, borderColor: Colors.lighter }} />

        {/* BOTTOM: Footer */}
        <CardActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
           <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip title="Tech Stack">
                    <CodeIcon fontSize="small" sx={{ color: Colors.mediumDark }} />
                </Tooltip>
                <Typography variant="caption" fontWeight="600" color={Colors.dark}>
                    {idea.tech_stack || "N/A"}
                </Typography>
           </Stack>
           
           <Chip 
             label={idea.status} 
             variant={idea.status === 'Completed' ? "filled" : "outlined"}
             sx={{ 
                 height: 24, 
                 fontSize: '0.75rem',
                 bgcolor: idea.status === 'Completed' ? Colors.mediumLight : 'transparent',
                 color: idea.status === 'Completed' ? 'white' : Colors.mediumDark,
                 borderColor: Colors.mediumDark
             }} 
           />
        </CardActions>
      </Card>

      {/* --- MENU (Styled) --- */}
      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleMenuClose}
        PaperProps={{
            elevation: 3,
            sx: { borderRadius: 2, minWidth: 150 }
        }}
      >
        {isOwner ? (
          [
            <MenuItem key="edit" onClick={() => { setEditing(true); handleMenuClose(); }} sx={{ gap: 1 }}>
                 <EditIcon fontSize="small" /> Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={handleDelete} sx={{ color: 'error.main', gap: 1 }}>
                 <DeleteIcon fontSize="small" /> Delete
            </MenuItem>
          ]
        ) : (
          <MenuItem onClick={() => { setReportOpen(true); handleMenuClose(); }} sx={{ gap: 1 }}>
              <FlagIcon fontSize="small" /> Report
          </MenuItem>
        )}
      </Menu>

      {/* --- REPORT DIALOG --- */}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
         <DialogTitle sx={{ bgcolor: Colors.lightest, color: Colors.darkest }}>Report Idea</DialogTitle>
         <DialogContent sx={{ minWidth: 350, mt: 2 }}>
             <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
                <InputLabel>Reason</InputLabel>
                <Select value={reportReason} label="Reason" onChange={(e) => setReportReason(e.target.value)}>
                    <MenuItem value="Spam">Spam or Misleading</MenuItem>
                    <MenuItem value="Inappropriate">Inappropriate Content</MenuItem>
                    <MenuItem value="Plagiarism">Plagiarism</MenuItem>
                </Select>
             </FormControl>
             <TextField fullWidth multiline rows={3} label="Details (Optional)" />
         </DialogContent>
         <DialogActions sx={{ p: 2 }}>
             <Button onClick={() => setReportOpen(false)} sx={{ color: Colors.dark }}>Cancel</Button>
             <Button variant="contained" color="error" onClick={() => { alert("Reported!"); setReportOpen(false); }}>Report</Button>
         </DialogActions>
      </Dialog>
    </>
  );
}