import react from 'react';
import Header from '../../components/Header';
import UpperProfileSection from '../../components/Admin/UpperProfileSection';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import ErrorMessage from  '../../components/ErrorMessage';

export default function AdminProfile() {

     const {id} = useParams();

     const [profile, setProfile] = useState(null);
     const [isOwner, setIsOwner] = useState(false);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
         let mounted = true;
         (async () => {
           try {
             const res = await api.get(`/admin/profile/${id}`);
             if (!mounted) return;
             setProfile(res.data.profile);
             setIsOwner(res.data.is_owner);
             console.log(res.data.is_owner);

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
           <Header />
           <UpperProfileSection profile={profile} isOwner={isOwner} />

            <ErrorMessage 
               error={error} 
               clearError={() => setError(null)} 
             />
    </>;
}
