import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import UpperProfileSection from '../../components/Teacher/Profile/UpperProfileSection';
import PostIdea from '../../components/PostIdea';
import ErrorMessage from  '../../components/ErrorMessage';
// import { set } from 'react-hook-form';
import LowerProfileSection from '../../components/LowerProfileSection';


export default function TeacherProfile() {
    
    const {id, name} = useParams();

     const [profile, setProfile] = useState(null);
     const [isOwner, setIsOwner] = useState(false);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
         let mounted = true;
         (async () => {
           try {
             const res = await api.get(`/teacher/profile/${id}`);
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
    
       if (loading) return <div>Loading...</div>;
       if (!profile) return <div>Profile not found</div>;
    
    return <>
        <Header id={id} name={name} />
        <UpperProfileSection profile={profile} isOwner={isOwner} />
        {isOwner && <PostIdea author={'teacher'}/>}
        <LowerProfileSection isOwner={isOwner} viewedUserId={id} viewedUserType="Teacher" />

        <ErrorMessage 
               error={error} 
               clearError={() => setError(null)} 
             />
    </>;
}