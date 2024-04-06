// Components
import { Container } from '../../../components/container';
import { Input } from '../../../components/input';
import { AuthContext } from '../../../context/authContext';
import { storage, db } from '../../../services/index';
// Layout
import { DashboardHeader } from '../../../layout/painelDashboard';
// Icons 
import { FiUpload, FiTrash } from 'react-icons/fi';
// Import from development;
import { ChangeEvent, useState,useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidV4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'; 
import { toast } from 'react-hot-toast';

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

  interface imageProps{
    uid: string;
    name: string;
    previewURL: string;
    url: string;
  }
export function New() {

    const { user } = useContext(AuthContext);
    const [image, setImage] = useState<imageProps[]>([]);

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

      if(image.length === 0){
        toast.error('Insira uma imagem deste veículo!');
        return;
      }

      const carListenImages = image.map(car => {
        return{
          uid: car.uid,
          name: car.name,
          url: car.url
        }
      })

      addDoc(collection(db, "cars"), {
        name: data.name.toUpperCase(),
        model: data.model,
        year: data.year,
        city: data.city,
        price: data.price,
        km: data.km,
        whatsapp: data.whatsapp,
        description: data.description,
        created: new Date(),
        uidUser: user?.uid,
        owner: user?.name,
        email: user?.email,
        carImages: carListenImages,
      })
      .then(() => {
        reset();
        setImage([]);
        toast.success('Veículo cadastrado com sucesso!');
      })
      .catch((e) => {
        console.log(`Erro ao enviar os dados para o banco: ${e}`);
        toast.error('Erro ao cadastrar esse veículo!');
      })
    }

    // Função para carregar as imagens na página
    async function handleFile(e: ChangeEvent<HTMLInputElement>){
      if(e.target.files && e.target.files[0]){
        const image = e.target.files[0];
        
        if(image.type === 'image/jpeg' || image.type === 'image/png'){
          await handleUpload(image);
        }
        else{
          toast.error('Envie uma imagem jpeg ou png');
        }
      }
    } 

    // Função que vai enviar a imagem ao banco e cadastrá-la
    async function handleUpload(image: File){
      if(!user?.uid){
        return;
      }
      
      const currentUId = user?.uid;
      const uidImage = uuidV4();

      const uploadRef = ref(storage, `images/${currentUId}/${uidImage}`)

      uploadBytes(uploadRef, image)
      .then((snapshot)=>{
        getDownloadURL(snapshot.ref).then((downloadURL)=>{
          const imageItem = {
            name: uidImage, 
            uid: currentUId,
            previewURL: URL.createObjectURL(image),
            url: downloadURL
          }

          setImage((images)=> [...images, imageItem])
        })
      })
    }

    // Função para deletar imagem da página e banco de dados
    async function handleDeleteImage(item: imageProps){
      const imagePath = `images/${item.uid}/${item.name}`
      const imageRef = ref(storage, imagePath);

      try{
        await deleteObject(imageRef)
        setImage(image.filter((img) => img.url !== item.url))
      }
      catch(e){
        toast.error(`Erro ao deletar imagem: ${e}`);
      }
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
                <input 
                className='opacity-0 cursor-pointer' 
                type="file" 
                accept='image/*'
                onChange={handleFile}  />
              </div>
            </button>

            {image.map( item => (
              <div 
              className='w-full h-32 flex items-center justify-center relative'
              key={item.name} >
                <button className='absolute' onClick={()=> handleDeleteImage(item)}>
                  <FiTrash size={28} color='#fff' />
                </button>
                <img 
                className='rounded-lg w-full h-32 object-cover' 
                src={item.previewURL} 
                alt='Foto do veículo' />
              </div>
            ))}
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
  
  