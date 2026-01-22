import react from 'react';
import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../components/axios'
import UpperProfileSection from '../../components/UpperProfileSection';

export default function StudentProfile() {

    const {id, name} = useParams();

    console.log(id, " ", name);

    const [profile, setProfile] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
         let mounted = true;
         (async () => {
           try {
             const res = await api.get(`/profile/${id}`);
             if (!mounted) return;
             setProfile(res.data.profile);
             setIsOwner(res.data.is_owner);
             console.log(res.data.profile);

           } catch (err) {
             console.error(err);
           } finally {
             if (mounted) setLoading(false);
           }
         })();
         return () => { mounted = false; };
       }, [id]);
    
       if (loading) return <div>Loading...</div>;
       if (!profile) return <div>Profile not found</div>;

    return ( <>
            <Header id={id} name={name} />
            <UpperProfileSection profile={profile} isOwner={isOwner} />
        </>

    ) ;
}
