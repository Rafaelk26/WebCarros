// Import from development
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
// Service
import { auth } from '../../services/index';



export function DashboardHeader(){

    async function handleLogout() {
        await signOut(auth)
    }


    return(
        <>
            <div className='w-full bg-red-500 text-white rounded-lg px-4 h-10 flex items-center gap-4 font-medium'>
                <Link to={'/dashboard'}>
                    Dashboard
                </Link>
                <Link to={'/dashboard/new'}>
                    Novo Carro
                </Link>
                <button className='ml-auto' onClick={handleLogout}>Sair da Conta</button>
            </div>
        </>
    )
}