// Components
import { Container } from '../../components/container';
import { db, storage } from '../../services/index';
// Layout
import { DashboardHeader } from '../../layout/painelDashboard';
// Icons
import { FiTrash2 } from 'react-icons/fi';
// Import from development
import { useEffect, useState, useContext } from 'react';
import { getDocs, collection, query, where, doc, deleteDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
// Context
import { AuthContext } from '../../context/authContext';
import { deleteObject } from 'firebase/storage';

interface carsProps{
  id: string;
  name: string;
  year: string | number;
  city: string;
  price: string | number;
  km: string;
  uid: string;
  carImages: imageProps[]; 
}

interface imageProps{
  uid: string;
  name: string;
  url: string;
}

export function Dashboard() {

    const [cars, setCars] = useState<carsProps[]>([]);
    const { user } = useContext(AuthContext)

  useEffect(()=> {
    // Para recuperar dados do firebase
    function loadCars(){
      if(!user?.uid){
        return;
      }
      // é preciso iniciar a collection com o nome da sua coleção
      const carsRef = collection(db, "cars")
      // Cria-se uma query, ou seja, uma referência de onde buscar os dados, usamos o where para filtrar dados de busca com o uid parecido com o uid do user logado.
      const queryRef = query(carsRef, where("uid", "==", user.uid))

      // Use a função getDocs() do firebase para pegar todos os documentos da referência que você passou para a função.
      getDocs(queryRef)
      // para cada requisição existe a propriedade snapshot onde seria o array com os objetos sendo passados individualmente
      .then((snapshot)=>{
        // Cria-se uma variável para seguir as regras da tipagem do objeto que virá do banco.
        const listCars = [] as carsProps[];
        snapshot.forEach(doc => {
          // Insere todas as propriedades dos objetos requeridos para o array vazio listCars[]
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            city: doc.data().city,
            km: doc.data().km,
            price: doc.data().price,
            carImages: doc.data().carImages,
            uid: doc.data().uid
          })
        })
        // Passando para o state cars para ser acessado para nossa página.
        setCars(listCars);
        console.log(listCars)
      })
      
    }
    loadCars()
  },[user])

    async function handleDeleteImage(car: carsProps){
      const docRef = doc(db, "cars", car.id)
      await deleteDoc(docRef)

      car.carImages.map( async (image) => {
        const imagePath = `images/${image.uid}/${image.name}`
        const imageRef = ref(storage, imagePath)

        try{
          await deleteObject(imageRef)
        }
        catch(err){
          console.log('EXCLUSÃO DO VEÍCULO COM ERRO', err)
        }
      })
      
      setCars(cars.filter(car => car.id !== car.id));
    }

    return (
      <>
        <Container>
          <DashboardHeader />

          <main className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap-6">
              {cars.map(car => (
                <section key={car.id} className="w-full bg-white rounded-md relative">
                <button
                onClick={()=> handleDeleteImage(car)} 
                className='absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow'>
                  <FiTrash2 size={26} color='#000' />
                </button>
                <img 
                className='w-full rounded-lg mb-2 max-h-70'
                src={car.carImages[0].url} 
                alt={car.name} />
                <p className='font-bold mt-1 px-2 mb-2'>{car.name}</p>
                <div className='flex flex-col px-2'>
                  <span className="text-zinc-700">
                    {car.year} | {car.km} km
                  </span>
                  <strong className='text-black font-bold mt-4'>
                    R$ {car.price}
                  </strong>
                </div>
                <div className='w-full h-px bg-slate-200 my-2'></div>
                <div className='px-2 pb-2'>
                  <span className='text-black'>
                    {car.city}
                  </span>
                </div>
              </section>
              ))}
          </main>
        </Container>
      </>
    )
}
  
  