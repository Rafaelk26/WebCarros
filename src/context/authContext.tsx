// Import from development
import { ReactNode, createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../services';

interface AuthProviderProps{
    children: ReactNode;
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: ({name, email, uid}: UserProps)=> void;
    user: UserProps | null
}

interface UserProps{
    uid: string;
    name?: string | null;
    email?: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser]= useState<UserProps | null>(null)
    const [loadingAuth, SetLoadingAuth] = useState(true);

    function handleInfoUser({ name, email, uid }: UserProps){
        setUser({
            name,
            email,
            uid
        })
    }

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=> {
            if(user){
                // Se tem usuário logado...
                setUser({
                    uid: user.uid,
                    name: user?.displayName,
                    email: user?.email
                })

                SetLoadingAuth(false)
            }
            else{
                // Se não tem usuário logado...
                setUser(null)
                SetLoadingAuth(false)
            }
        })

        return () => {
            unsub();
        }
    },[])


    return(
        <AuthContext.Provider value={
            { signed: !!user, 
                loadingAuth, 
                handleInfoUser,
                user
            }
            }>
            { children }
        </AuthContext.Provider>
    )
}