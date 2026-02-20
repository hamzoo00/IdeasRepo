import react from 'react';
import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import UpperProfileSection from '../../components/Student/UpperProfileSection';
import PostIdea from '../../components/PostIdea';
import LowerProfileSection from '../../components/LowerProfileSection';
import ErrorMessage from  '../../components/ErrorMessage';

export default function StudentProfile() {

    const {id, name} = useParams();

    const [profile, setProfile] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

     useEffect(() => {
         let mounted = true;
         (async () => {
           try {
             const res = await api.get(`/profile/${id}`);
             if (!mounted) return;
             setProfile(res.data.profile);
             setIsOwner(res.data.is_owner);

           } catch (err) {
             setError("Failed to load profile. Please try again later.\n" + err.message);
           } finally {
             if (mounted) setLoading(false);
           }
         })();
         return () => { mounted = false; };
       }, [id]);
    
    const handleProfileUpdate = (updatedProfile) => {
         setProfile(prev => ({ ...prev, ...updatedProfile })); 
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
