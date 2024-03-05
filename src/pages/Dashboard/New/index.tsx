// Components
import { Container } from '../../../components/container';
import { Input } from '../../../components/input';
// Layout
import { DashboardHeader } from '../../../layout/painelDashboard';
// Icons 
import { FiUpload } from 'react-icons/fi';
// Import from development;
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


  // O schema é um modelo de formulário a ser seguido, nele, será requisitado todas as propriedades do objeto!
  const schema = z.object({
    name: z.string().nonempty('Nome do veículo é requirido!'),
    model: z.string().nonempty('Modelo do veículo é requirido!'),
    year: z.string().nonempty('Ano do veículo é requirido!'),
    km: z.string().nonempty('Km do veículo é obrigatório!'),
    price: z.string().nonempty('Preço do veículo é obrigatório!'),
    city: z.string().nonempty('Cidade do veículo é obrigatório!'),
    whatsapp: z.string().min(1, 'O Telefone é obrigatório!').refine((value)=> /^(\d{10, 11})$/.test(value), {
      message: 'Número de telefone inválido!'
    }),
    description: z.string().nonempty('Descrição do veículo é obrigatório!')
  })

  // Tipamos para ele seguir o nosso schema de acordo com as necessidades de nossos form
  type FormData = z.infer<typeof schema>

export function New() {
    // register para registrar um item
    // handleSubmit para enviar os dados do formulário
    // formState para resetar, e pegar o erro caso ocorra.
    const {register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: "onChange" 
    })

    // Essa função será executada pelo nosso handleSubmit como parâmetro
    // Pode-se receber todas as propriedades do nosso 'schema'
    function onSubmit(data: FormData){
      console.log(data)
    }

    return (
      <>
        <Container>
          <DashboardHeader />
          <div className='w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row item-center gap-2 mt-2'>
            <button className='border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48'>
              <div className='absolute cursor-pointer'>
               <FiUpload size={30} color='#000' />
              </div>
              <div className='cursor-pointer'>
                <input className='opacity-0 cursor-pointer' type="file" accept='image/*' />
              </div>
            </button>
          </div>

          <div className='w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row item-center gap-2 mt-4'>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
              
            </form>
          </div>
        </Container>
      </>
    )
}
  
  