import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import UpperProfileSection from '../../components/Student/UpperProfileSection';
import PostIdea from '../../components/PostIdea';
import LowerProfileSection from '../../components/ProfileSharedComponents/LowerProfileSection';
import ErrorMessage from  '../../components/ErrorMessage';
import { useDispatch } from 'react-redux';
import { setUser} from '../../store/slices/userDetailsSlice';
import { useNavigate } from 'react-router-dom';

export default function StudentProfile() {

    const {id, name} = useParams();         // thoughout entire app the id and name represent url ID and Name
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        type: 'student', 
        is_owner: true,
      }));
    }
  };
   

     useEffect(() => {
         let mounted = true;

         (async () => {
           try {
             const res = await api.get(`/profile/${id}`);
             if (!mounted) return;
             const profileData = res.data.profile;
             const isProfileOwner = res.data.is_owner;
             setProfile(profileData);
             setIsOwner(isProfileOwner);
             syncUserToRedux(profileData, isProfileOwner);
    
             if (profileData?.full_name?.trim().toLocaleLowerCase() !== name.trim().toLocaleLowerCase()) {
              navigate(`/${profileData.full_name}/${id}/profile`, { replace: true });
             }
         
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

    return ( 
    <>
            <Header id={id} name={name} profileImage={profile?.image} profileType="student" />
            <UpperProfileSection profile={profile} isOwner={isOwner} onUpdate={handleProfileUpdate} />
            {isOwner && <PostIdea />}
            <LowerProfileSection isOwner={isOwner} viewedUserId={id} viewedUserType="Student" />


            
            <ErrorMessage 
               error={error} 
               clearError={() => setError(null)} 
             />
    </>

    ) ;
}
