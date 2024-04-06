// Logo
import  logoImg  from '../../assets/logo.svg';
// Components
import { Container } from '../../components/container';
import { Input } from '../../components/input';
// Import from development
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
// Import data from database firebase
import { auth } from '../../services/index';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const schema = z.object({
  email: z.string().email('Insira um email válido!').nonempty('O campo email é obrigatório!'),
  password: z.string().nonempty('O campo senha é obrigatório!'),
})

type FormData = z.infer<typeof schema>

export function Login() {

  useEffect(()=>{
    async function handleLogout(){
      await signOut(auth)
    }

    handleLogout()
  },[])

  const nav = useNavigate()

  const { register, handleSubmit, formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  }) 

  function onSubmit(data: FormData){
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then(()=>{
      console.log('Logado com sucesso!')
      toast.success('Logado com sucesso!');
      nav('/dashboard', { replace: true })
    })
    .catch((e)=>{
      console.log(`Erro ao logar: ${e}`)
      toast.error('Error ao tentar se logar!');
    })
  }

    return (
      <>
        <Container>
          <div className='w-full min-h-screen flex flex-col justify-center items-center gap-4'>
            <Link to={'/'} className='mb-6 max-w-sm w-full'>
              <img 
              className='w-full'
              src={logoImg} 
              alt="Logo do site" />
            </Link>

            <form onSubmit={handleSubmit(onSubmit)} className='bg-white max-w-xl rounded-lg w-full gap-5 flex flex-col p-5'>
              <div>
                <Input
                type="text" 
                placeholder="Email"
                name="email"
                error={errors.email?.message}
                register={register}
                />
              </div>  

              <div>
                <Input
                type="password" 
                placeholder="Password"
                name="password"
                error={errors.password?.message}
                register={register}
                />
              </div>

              <button type='submit' className='p-2 font-bold bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-800 transition-all'>Acessar</button>

            </form>

            <Link to={'/register'} className='font-medium'>Não possui uma conta? Faça o seu Cadastro!</Link>

          </div>
        </Container>
      </>
    )
}
  
  