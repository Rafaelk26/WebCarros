// Logo
import  logoImg  from '../../assets/logo.svg';
// Components
import { Container } from '../../components/container';
import { Input } from '../../components/input';
// Import from development
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Insira um email válido!').nonempty('O campo email é obrigatório!'),
  password: z.string().nonempty('o campo senha é obrigatório!'),
})

type FormData = z.infer<typeof schema>

export function Login() {

  const { register, handleSubmit, formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  }) 

  function onSubmit(data: FormData){
    console.log(data) // {email: 'teste@gmail.com', password: '123456'}
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

            <form onSubmit={handleSubmit(onSubmit)} className='bg-white max-w-xl rounded-lg w-full gap-5 flex flex-col'>
              <div className='mb-2'>
                  <Input
                  type="text" 
                  placeholder="Email"
                  name="email"
                  error={errors.email?.message}
                  register={register}
                  />
              </div>  

              <div className='mb-2'>
                <Input
                type="password" 
                placeholder="Password"
                name="password"
                error={errors.password?.message}
                register={register}
                />
              </div>

              <button className='p-2 font-bold bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-800 transition-all'>Acessar</button>

            </form>
          </div>
        </Container>
      </>
    )
}
  
  