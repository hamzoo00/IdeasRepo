import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent, 
  Divider,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Inactive Trash Icon
import AutoDeleteIcon from '@mui/icons-material/AutoDelete'; // Restore Icon for empty state
import api from '../axios'; 
import IdeaCard from './IdeaCard';
import ErrorMessage from '../ErrorMessage';


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

export default function LowerProfileSection({ isOwner, viewedUserId, viewedUserType }) {

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  
  // STATE: 'active' or 'trash' also count of trashed ideas
  const [viewMode, setViewMode] = useState('active'); 
  const [trashCount, setTrashCount] = useState(0);
  const fetchIdeas = async () => {
    if (!viewedUserId || !viewedUserType) return;

    try {
      setLoading(true);
      
      let endpoint = `/ideas/${viewedUserType.toLowerCase()}/${viewedUserId}`;
      // Only Owner can see their own trash
      if (isOwner && viewMode === 'trash') {
          endpoint = `/my-trash-ideas?view=trash`;
      }

      const response = await api.get(endpoint);
      setIdeas(response.data);

      if (isOwner) {
          const countRes = await api.get('/my-ideas/trash-count');
          setTrashCount(countRes.data.count);
      }

    } catch (error) {
      setError("Failed to load ideas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [viewedUserId, viewedUserType, viewMode]); // Refetch when mode changes

  return (
    <>
     <ErrorMessage 
               error={error} 
               clearError={() => setError(null)} 
             />

    <Box sx={{ width: "100%", mb: 4, display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,         
          borderRadius: 4,       
          boxShadow: "0px 4px 20px rgba(0, 180, 216, 0.15)", 
          background: "white",
          mt: 2,                 
          minHeight: 200         
        }}
      >
        <CardContent sx={{ p: 4 }}>
          
          {/* HEADER ROW */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              
              <Typography variant="h6" sx={{ color: Colors.darkest, fontWeight: 600 }}>
                 {viewMode === 'active' ? "Posts" : "Recycle Bin"}
              </Typography>

              {/* TOGGLE BUTTON (Only visible to Owner) */}
              {isOwner && (
                  <Tooltip title={viewMode === 'active' ? `View Deleted Items (${trashCount})` : "Back to Active Posts"}>
                      
                      {/* WRAP ICON BUTTON IN BADGE */}
                      <Badge 
                        badgeContent={trashCount} 
                        color="error"
                        invisible={viewMode === 'trash' || trashCount === 0} // Hide badge if empty or already inside trash
                      >
                          <IconButton 
                            onClick={() => setViewMode(viewMode === 'active' ? 'trash' : 'active')}
                            sx={{ 
                                color: viewMode === 'active' ? Colors.mediumDark : 'error.main',
                                bgcolor: viewMode === 'active' ? Colors.lightest : '#ffebee'
                            }}
                          >
                              {viewMode === 'active' ? <DeleteOutlineIcon /> : <AutoDeleteIcon />}
                          </IconButton>
                      </Badge>

                  </Tooltip>
              )}
          </Box>
          
          <Divider sx={{ mb: 4, borderColor: Colors.lighter }} />

          {/* CONTENT */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: Colors.primary }} />
            </Box>
          ) : (
            <Box>
              {ideas.length === 0 ? (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        py: 6,
                        bgcolor: Colors.lightest, 
                        borderRadius: 2,
                        color: Colors.darker
                    }}
                >
                    <SentimentDissatisfiedIcon sx={{ fontSize: 40, mb: 1, color: Colors.mediumDark }} />
                    <Typography variant="h6" fontWeight="bold">
                        {viewMode === 'active' 
                            ? (isOwner ? "No posts yet!" : "No posts found.") 
                            : "Trash is empty."}
                    </Typography>
                </Box>
              ) : (
                <Box>
                  {ideas.map((idea) => (
                    <IdeaCard 
                      key={idea.id} 
                      idea={idea} 
                      isOwner={isOwner}
                      refreshIdeas={fetchIdeas}
                      // Pass the mode to the card so it knows which buttons to show
                      isTrashMode={viewMode === 'trash'} 
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

        </CardContent>
      </Card>
    </Box>
    </>
  );
}