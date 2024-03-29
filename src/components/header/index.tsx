// Logo
import  logoImg  from '../../assets/logo.svg';
// Import from development
import { Link } from 'react-router-dom';
import { useContext } from 'react';
// Icons
import { FiUser, FiLogIn } from 'react-icons/fi';
// Context
import { AuthContext }  from '../../context/authContext';

export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext)
    return (
      <>
        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
          <header className='flex w-full max-w-7xl justify-between items-center px-4 mx-auto'>
            <Link to={'/'}>
              <img src={ logoImg } alt="Logo do site" />
            </Link>

            {!loadingAuth && signed && (
              <Link to={'/dashboard'}>
                <div className='border-2 rounded-full border-black p-1'>
                  <FiUser color='#000' size={24} />
                </div>
              </Link>
            )}

            {!loadingAuth && !signed && (
              <Link to={'/login'}>
                <div className='border-2 rounded-full border-black p-1'>
                  <FiLogIn color='#000' size={24} />
                </div>
              </Link>
            )}
          </header>
        </div>
      </> 
    )
}
  
  