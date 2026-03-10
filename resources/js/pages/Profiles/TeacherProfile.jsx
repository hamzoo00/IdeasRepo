import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import UpperProfileSection from '../../components/Teacher/Profile/UpperProfileSection';
import PostIdea from '../../components/PostIdea';
import ErrorMessage from  '../../components/ErrorMessage';
// import { set } from 'react-hook-form';
import LowerProfileSection from '../../components/ProfileSharedComponents/LowerProfileSection';
import { useDispatch } from 'react-redux';
import { setUser} from '../../store/slices/userDetailsSlice';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';
import { useSelector } from 'react-redux';
import { Warning } from '@mui/icons-material';
import SuspensionOverlay from '../../components/SuspensionOverlay/SuspensionOverlay';


export default function TeacherProfile() {
    
    const {id, name} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
     const [profile, setProfile] = useState(null);
     const [isOwner, setIsOwner] = useState(false);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [feedRefreshTrigger, setFeedRefreshTrigger] = useState(0);
     const adminActionTrigger = useSelector((state) => state.adminAction.adminActiontrigger);

     
    const syncUserToRedux = (latestProfileData, ownerCheck) => {
    if (ownerCheck) {
      dispatch(setUser({
        id: latestProfileData.id,
        full_name: latestProfileData.full_name,
        image: latestProfileData.image,
        type: 'teacher', 
        is_owner: true,
        is_suspended: latestProfileData.is_suspended,
        suspension_reason: latestProfileData.suspension_reason,
        Warning_count: latestProfileData.warning_count
      }));
    }
  };
   
     useEffect(() => {
         let mounted = true;
         (async () => {
           try {
             const res = await api.get(`/teacher/profile/${id}`);
             if (!mounted) return;
             const profileData = res.data.profile;
             const isProfileOwner = res.data.is_owner;
             setProfile(profileData);
             setIsOwner(isProfileOwner);
             syncUserToRedux(profileData, isProfileOwner);
             

            if (profileData?.full_name?.trim().toLocaleLowerCase() !== name.trim().toLocaleLowerCase()) {
              navigate(`/${profileData.full_name}/${id}/teacher/profile`, { replace: true });
             }

           } catch (err) {
             setError("Failed to load profile. Please try again later.\n" + err.message);
           } finally {
             if (mounted) setLoading(false);
           }
         })();
        return () => { mounted = false; };
       }, [id, feedRefreshTrigger,adminActionTrigger]);

      
      const isAdminViewing = useSelector((state) => state.auth.user?.type === 'admin') || false;
    

     const handleProfileUpdate = (updatedProfile) => {
         const latestProfile = { ...profile, ...updatedProfile };

         setProfile(latestProfile); 
         syncUserToRedux(latestProfile, isOwner);
       };   

     const handleFeedRefresh = () => {
        setFeedRefreshTrigger(prev => prev + 1);
       };

    
       if (loading) return <LoadingScreen message="Loading profile..." />;
       if (!profile) return <LoadingScreen message="Profile not found." />;
    
    return <>
        <SuspensionOverlay isSuspended={profile.is_suspended} reason={profile.suspension_reason} />
        <Header id={id} name={name} profileImage={profile?.image} profileType="teacher" isOwner={isOwner} />
        <UpperProfileSection profile={profile} isOwner={isOwner} onUpdate={handleProfileUpdate} onUpdateSuccess={handleFeedRefresh} isAdminViewing={isAdminViewing}/>
        {isOwner && <PostIdea onPostSuccess={handleFeedRefresh}/>}
        <LowerProfileSection isOwner={isOwner} viewedUserId={id} viewedUserType="Teacher" refreshTrigger={feedRefreshTrigger} isAdminViewing={isAdminViewing}/>

        <ErrorMessage 
               error={error} 
               clearError={() => setError(null)} 
             />
    </>;
}