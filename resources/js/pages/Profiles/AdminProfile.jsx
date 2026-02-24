import react from 'react';
import Header from '../../components/Header';
import UpperProfileSection from '../../components/Admin/UpperProfileSection';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import ErrorMessage from  '../../components/ErrorMessage';
import { useDispatch } from 'react-redux';
import { setUser} from '../../store/slices/userDetailsSlice';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';

export default function AdminProfile() {

     const {id} = useParams();
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
             type: 'admin', 
             is_owner: true,
           }));
         }
       };

     useEffect(() => {
         let mounted = true;
         (async () => {
           try {
             const res = await api.get(`/admin/profile/${id}`);
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
    
       if (loading) return <LoadingScreen message="Loading profile..." />;
       if (!profile) return <LoadingScreen message="Profile not found." />;

    
    return <>
           <Header id={id} name={profile?.name} profileImage={profile?.image} profileType="admin" />
           <UpperProfileSection profile={profile} isOwner={isOwner} onUpdate={handleProfileUpdate} />

            <ErrorMessage 
               error={error} 
               clearError={() => setError(null)} 
             />
    </>;
}
