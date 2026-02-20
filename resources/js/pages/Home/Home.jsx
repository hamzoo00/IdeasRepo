import react from 'react';
import {useParams} from 'react-router-dom';
import Header from '../../components/Header';

export default function Home() {

    const {id , name} = useParams();


     
    return (
          <Header id={id} name={name}/>
        
    ) ;
}