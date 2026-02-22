import {useParams} from 'react-router-dom';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import PostIdea from  '../../components/PostIdea';
import AdvanceIdeaCard from '../../components/HomeSharedComponents/AdvanceIdeaCard';
import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    CircularProgress, 
    Dialog, 
    IconButton 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import api from '../../components/axios'; 
import { useNavigate } from 'react-router-dom';



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


export default function Home() {

    const {id , name} = useParams();
    const navigate = useNavigate();

    const profileImage = useSelector((state) => state.auth.user.image); 
    const profileType = useSelector((state) => state.auth.user.type);
    const isOwner = useSelector((state) => state.auth.user.is_owner);
    const logInUserId = useSelector((state) => state.auth.user.id);
    const logInUserName = useSelector((state) => state.auth.user.full_name);

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedIdeaId = searchParams.get('idea');

    const fetchFeed = async () => {
        try {
            setLoading(true);
            const response = await api.get('/feed');
            setIdeas(response.data);
            setApiError("");
        } catch (error) {
            console.error("Failed to fetch feed", error);
            setApiError("Failed to load the feed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
// Restrict log in user to access only their own feed page also if someone else tries
// to access there feed page the will be directed to login one

     if (logInUserId && logInUserId.toString() !== id) {
            navigate(`/${logInUserName}/${logInUserId}/home`, { replace: true });
            return; 
     }
       
        fetchFeed();
    }, [id, logInUserId]);

    const handleOpenIdeaModal = (idea) => {
        setSearchParams({ idea: idea.id }); 
    };

    const handleCloseModal = () => {
        setSearchParams({}); 
    };

    // Find the specific idea object if a URL parameter exists
    const activeIdea = selectedIdeaId ? ideas.find(i => i.id.toString() === selectedIdeaId) : null;

     
    return (
        <>
          <Header id={id} name={name} profileImage={profileImage} profileType={profileType}/>
          {isOwner && <PostIdea />}
          
          <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            
            {/* SECTION 2: FILTERS */}
            <Typography variant="h4" fontWeight="bold" color={Colors.darkest} mb={2}>
                Browse Ideas
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', mb: 4, borderRadius: 2, border: `1px dashed #ccc` }}>
                <Typography color="textSecondary" textAlign="center">
                    [Sorting and Filters Section - Coming Soon]
                </Typography>
            </Box>

            {/* --- SECTION 3: BROWSE FEED --- */}
            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress sx={{ color: Colors.darkest }} />
                </Box>
            ) : apiError ? (
                <Typography color="error" textAlign="center">{apiError}</Typography>
            ) : ideas.length === 0 ? (
                <Typography textAlign="center" color="textSecondary" mt={5}>
                    No ideas have been posted yet. Be the first!
                </Typography>
            ) : (
                <Box>
                    {ideas.map((idea) => {
                        // SMART PERMISSION CHECK:
                        // 1. Check if IDs match
                        // 2. Check if the backend author_type (e.g. "App\Models\Auth\Student") 
                        //    contains the Redux user type (e.g. "student")
                        const ideaIsOwner = logInUserId === idea.author_id && 
                                      idea.author_type?.toLowerCase().includes(profileType.toLowerCase());
                                      

                        return (
                            <AdvanceIdeaCard
                                key={idea.id} 
                                idea={idea} 
                                isOwner={ideaIsOwner} 
                                refreshIdeas={fetchFeed} 
                                isTrashMode={false} 
                                onCardClick={handleOpenIdeaModal} 
                            />
                        );
                    })}
                </Box>
            )}

            {/* --- THE MODAL --- */}
            <Dialog 
                open={!!selectedIdeaId} 
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, bgcolor: '#f8f9fa', overflow: 'visible' }
                }}
            >
                {activeIdea && (
                    <Box sx={{ position: 'relative' }}>
                        {/* Floating Close Button */}
                        <IconButton 
                            onClick={handleCloseModal} 
                            sx={{ 
                                position: 'absolute', 
                                right: -12, 
                                top: -12, 
                                zIndex: 10,
                                bgcolor: 'white',
                                boxShadow: 2,
                                "&:hover": { bgcolor: '#f0f0f0' }
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>

                        <Box sx={{ p: { xs: 1, sm: 3 } }}>
                            {/* We reuse the IdeaCard! 
                                Notice I OMIT 'onCardClick' here so it defaults 
                                to the expand/collapse behavior instead of trying to open the modal again.
                            */}
                            <AdvanceIdeaCard 
                                idea={activeIdea} 
                                isOwner={logInUserId?.id === activeIdea.author_id && activeIdea.author_type?.toLowerCase().includes(profileType.toLowerCase())}
                                refreshIdeas={fetchFeed}
                                isTrashMode={false}
                            />
                        </Box>
                    </Box>
                )}
            </Dialog>
            
        </Container>

        </>
    ) ;
}