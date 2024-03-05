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
    whatsapp: z.string().min(12, 'O Telefone é obrigatório!'),
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
        {/* Alinhamento */}
        <Container>
          {/* Layout Header Dashboard */}
          <DashboardHeader />
          <div className='w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row item-center gap-2 mt-2'>
            {/* Enviar arquivo */}
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
            {/* Formulário */}
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
              {/* Input nome do carro */}
              <div className="mb-3">
                <p className='mb-2 font-medium'>Nome do Carro</p>
                <Input 
                type='text'
                placeholder='Ex: Chevrolet Onix'
                register={register}
                name='name'
                error={errors.name?.message}
                />  
              </div>
              {/* Input modelo do carro */}
              <div className="mb-3">
                <p className='mb-2 font-medium'>Modelo</p>
                <Input 
                type='text'
                placeholder='Ex: 1.0 Flex Plus Manual'
                register={register}
                name='model'
                error={errors.model?.message}
                />  
              </div>
              {/* Div ano/km do veículo */}
              <div className='flex flex-row w-full mb-3 items-center gap-4'>
                {/* Input ano do veículo */}
                <div className='w-full'>
                  <p className='mb-2 font-medium'>Ano</p>
                  <Input 
                  type='text'
                  placeholder='Ex: 2018/2019'
                  register={register}
                  name='year'
                  error={errors.year?.message}
                  />  
                </div>
                {/* Input km do veículo */}
                <div className='w-full'>
                  <p className='mb-2 font-medium'>Km's</p>
                  <Input 
                  type='text'
                  placeholder='Ex: 52.000'
                  register={register}
                  name='km'
                  error={errors.km?.message}
                  />  
                </div>
              </div>
              
              {/* Div whatsapp/cidade do veículo */}
              <div className='flex flex-row w-full mb-3 items-center gap-4'>
                {/* Input whatsapp do proprietário */}
                <div className='w-full'>
                  <p className='mb-2 font-medium'>Whatsapp</p>
                  <Input 
                  type='text'
                  placeholder='Ex: 012900001111'
                  register={register}
                  name='whatsapp'
                  error={errors.whatsapp?.message}
                  />  
                </div>
                {/* Input cidade do veículo */}
                <div className='w-full'>
                  <p className='mb-2 font-medium'>Cidade</p>
                  <Input 
                  type='text'
                  placeholder='Ex: São José dos Campos - SP'
                  register={register}
                  name='city'
                  error={errors.city?.message}
                  />  
                </div>
              </div>
              {/* Input de preço */}
              <div className="mb-3">
                <p className='mb-2 font-medium'>Preço</p>
                <Input 
                type='text'
                placeholder='Ex: 45.000'
                register={register}
                name='price'
                error={errors.price?.message}
                />  
              </div>

              {/* Campo de descrição */}
              <div className="mb-3">
                <p className='mb-2 font-medium'>Descrição</p>
                <textarea
                className='border-2 w-full rounded-md h-24 px-2 hover:border-red-600 transition-all'
                {...register("description")}
                name='description'
                id='description'
                placeholder='Ex: Visite a descrição completa do meu veículo'
                /> 
                {errors.description && <p className='mb-1 text-red-500'>{errors.description?.message}</p>}
              </div>

              <button
              type='submit'
              className='w-full rounded-md bg-zinc-900 text-white font-medium h-10'
              >
                Cadastrar
              </button>
            </form>
          </div>
        </Container>
      </>
    )
}
  
  