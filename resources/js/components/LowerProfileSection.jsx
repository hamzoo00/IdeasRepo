import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent, 
  Divider 
} from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import api from './axios'; 
import IdeaCard from './IdeaCard';


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

  const fetchIdeas = async () => {
    if (!viewedUserId || !viewedUserType) return;

    try {
      setLoading(true);
      const endpoint = `/ideas/${viewedUserType.toLowerCase()}/${viewedUserId}`;
      const response = await api.get(endpoint);
      setIdeas(response.data);
    } catch (error) {
      console.error("Failed to load ideas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [viewedUserId, viewedUserType]); 

  // --- RENDER ---
  return (
    <Box sx={{ width: "100%", mb: 4, display: "flex", justifyContent: "center" }}>
      
      {/* 2. The Main Wrapper Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,         // Match Upper Profile Width
          borderRadius: 4,       // Match Upper Profile Radius
          boxShadow: "0px 4px 20px rgba(0, 180, 216, 0.15)", // Match Upper Profile Shadow
          background: "white",
          mt: 2,                 // Small margin from top as requested
          minHeight: 200         // Minimum height for aesthetics
        }}
      >
        <CardContent sx={{ p: 4 }}>
          
          {/* Header */}
          <Typography variant="h6" sx={{ color: Colors.darkest, mb: 3, fontWeight: 600 }}>
             Posts
          </Typography>
          
          <Divider sx={{ mb: 4, borderColor: Colors.lighter }} />

          {/* Content Area */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: Colors.primary }} />
            </Box>
          ) : (
            <Box>
              {ideas.length === 0 ? (
                // EMPTY STATE
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
                        {isOwner ? "No posts yet!" : "No posts found."}
                    </Typography>
                    <Typography variant="body2">
                        {isOwner 
                            ? "Share your brilliant ideas with the world." 
                            : "This user hasn't posted anything yet."}
                    </Typography>
                </Box>
              ) : (
                // LIST OF IDEAS
                // IdeaCard has its own margins/shadows, so they stack nicely inside this container
                <Box>
                  {ideas.map((idea) => (
                    <IdeaCard 
                      key={idea.id} 
                      idea={idea} 
                      isOwner={isOwner}
                      refreshIdeas={fetchIdeas}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}