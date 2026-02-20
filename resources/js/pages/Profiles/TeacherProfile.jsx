import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import UpperProfileSection from '../../components/Teacher/Profile/UpperProfileSection';
import PostIdea from '../../components/PostIdea';
import ErrorMessage from  '../../components/ErrorMessage';
// import { set } from 'react-hook-form';
import LowerProfileSection from '../../components/LowerProfileSection';
import { useDispatch } from 'react-redux';
import { setUser} from '../../store/slices/userDetailsSlice';


export default function TeacherProfile() {
    
    const {id, name} = useParams();
    const dispatch = useDispatch();

     const [profile, setProfile] = useState(null);
     const [isOwner, setIsOwner] = useState(false);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     
    const syncUserToRedux = (latestProfileData, ownerCheck) => {
    if (ownerCheck) {
      dispatch(setUser({
        id: latestProfileData.id,
        full_name: latestProfileData.full_name,
        image: latestProfileData.image,
        type: 'teacher', 
        is_owner: true,
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

           } catch (err) {
             setError("Failed to load profile. Please try again later.\n" + err.message);
           } finally {
             if (mounted) setLoading(false);
           }
         })();
         return () => { mounted = false; };
       }, [id]);

     const handleProfileUpdate = (updatedProfile) => {
         const latestProfile = { ...profile, ...updatedProfile };

         setProfile(latestProfile); 
         syncUserToRedux(latestProfile, isOwner);
       };   
    
       if (loading) return <div>Loading...</div>;
       if (!profile) return <div>Profile not found</div>;
    
    return <>
        <Header id={id} name={name} profileImage={profile?.image} profileType="teacher" />
        <UpperProfileSection profile={profile} isOwner={isOwner} onUpdate={handleProfileUpdate} />
        {isOwner && <PostIdea author={'teacher'}/>}
        <LowerProfileSection isOwner={isOwner} viewedUserId={id} viewedUserType="Teacher" />

        <ErrorMessage 
               error={error} 
               clearError={() => setError(null)} 
             />
    </>;
}