import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Paper, Divider, Stack, Chip, Tooltip } from '@mui/material';
import { Warning as PriorityIcon, ListAlt as TriageIcon } from '@mui/icons-material';
import { Close as CloseIcon, Close as IconButton
 } from '@mui/icons-material';
import IdeaCard from '../../components/IdeaCard';
import api from '../../components/axios';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../components/LoadingScreen';


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


export default function ModerationCommandCenter() {

  const [tab, setTab] = useState(0); // 0 = Priority, 1 = General
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const AdminAccountInfo = useSelector(state => state.auth.user);

  const fetchQueue = async () => {
    setLoading(true);
    const endpoint = tab === 0 ? '/admin/moderation/priority' : '/admin/moderation/general';
    try {
      const res = await api.get(endpoint);
      setIdeas(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQueue(); }, [tab]);


  const handleDismiss = async (ideaId) => {

    try {
      const response = await api.post(`/admin/moderation/dismiss/${ideaId}`, {
        reason: "Content does not violate community guidelines.",
      });
      
      alert(response.data.message);

      fetchQueue();
    } catch (err) {
      console.error("Dismissal failed", err);
      alert("Failed to dismiss reports. Please try again.");
    }
  };

  if(AdminAccountInfo.type !== 'admin') {
    return <LoadingScreen message="Unauthorized Access - Admins Only" />;
  }

  return (
  <>
    <Header name={AdminAccountInfo.full_name} id={AdminAccountInfo.id} profileImage={AdminAccountInfo.image} profileType={AdminAccountInfo.type} isOwner={AdminAccountInfo.isOwner} />
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="#03045E" gutterBottom>
        Moderation Command Center
      </Typography>

      <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mb: 3 }}>
        <Tab icon={<PriorityIcon />} label="Priority Review" />
        <Tab icon={<TriageIcon />} sx={{ml: {xs: 1 , sm: 6}}}  label="General Reports" />
      </Tabs>

      {ideas.map((idea) => (
        <Paper key={idea.id} sx={{ mb: 4, borderRadius: 3, border: '1px solid #ADE8F4', overflow: 'hidden' }}>
          {/* Header showing Report Summary */}
          <Box sx={{ p: 2, bgcolor: '#CAF0F8', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" fontWeight="bold" color="#023E8A">
              TOTAL REPORTS: {idea.report_count}
            </Typography>
           
            <Tooltip title="Dismiss report (No violation found)">
             <CloseIcon
              size="small" 
              onClick={() => handleDismiss(idea.id)}
              sx={{ 
                color: Colors.dark, 
                '&:hover': { 
                  bgcolor: Colors.lightest, 
                  color: '#d32f2f' 
                } 
              }}
             >
             </CloseIcon>
            </Tooltip>
           
            {/* <Chip 
              label={tab === 0 ? "Priority" : "General"} 
              size="small" 
              sx={{ 
                bgcolor: tab === 0 ? '#ffeded' : '#e3f2fd', 
                color: tab === 0 ? '#d32f2f' : Colors.darker,
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }} 
            /> */}
            {/* <Chip label="Manual Review Required" size="small" color="warning" /> */}
          </Box>

          <IdeaCard 
            idea={idea} 
            isAdminViewing={true} 
            refreshIdeas={fetchQueue} 
          />

          {/* EVIDENCE SECTION: The Reason Stack */}
          <Box sx={{ p: 3, bgcolor: '#FAFAFA' }}>
            <Typography variant="overline" fontWeight="bold">Report Evidence:</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {idea.reports.map(report => (
                <Paper key={report.id} variant="outlined" sx={{ p: 1.5, display: 'flex',  flexDirection: {xs:'column',  sm:'row'} , justifyContent: {xs:'center',  sm:'space-between'} }}>
                  <Typography variant="body2" 
                  sx={{ 
                        maxWidth: '80%',
                        wordBreak: 'break-word', 
                        whiteSpace: 'pre-line',  
                        lineHeight: 1.6,
                        color: 'text.primary'
                      }}>
                    <strong>{report.reason}:</strong> {report.comment || "No details provided."}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    By {report.reporter?.name} ({report.reporter_type.split('\\').pop()})
                    ID: {report.reporter?.id}
                  </Typography>

                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
      ))}
    </Container>

  </>
  );
}