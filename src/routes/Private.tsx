// Import from development;
import { Navigate } from 'react-router-dom';
import { ReactNode, useContext } from 'react';
import { AuthContext }  from '../context/authContext';

interface PrivateProps{
    children: ReactNode;
}

export function Private({ children }: PrivateProps){
    const { signed, loadingAuth } = useContext(AuthContext)

    if(loadingAuth){
        return <div></div>
    }

    if(!signed){
        return <Navigate to="/login" />
    }

    return children;
}