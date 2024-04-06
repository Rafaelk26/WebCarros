// Components
import { Container } from '../../components/container';
// Import from development
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../../services/index';
// Icons
import { FaLocationDot } from "react-icons/fa6";

interface carsProps{
  id: string;
  name: string;
  km: string;
  city: string;
  year: string;
  price: string | number;
  uid: string;
  carImages: carImageProps[];
}

interface carImageProps{
  name: string;
  uid: string;
  url: string;
}


export function Home() {

  const [cars, setCars] = useState<carsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  const [input, setInput] = useState<string>("")

  useEffect(()=> {
    loadCars()
  },[])

  // Para recuperar dados do firebase
  function loadCars(){
    // é preciso iniciar a collection com o nome da sua coleção
    const carsRef = collection(db, "cars")
    // Cria-se uma query, ou seja, uma referência de onde buscar, nesse caso colocamos o OrderBy para organizar os dados de acordo com a propriedade created que é quando foi inserido no banco e de maneira decrescente.
    const queryRef = query(carsRef, orderBy("created", "desc"))

    // Use a função getDocs() do firebase para pegar todos os documentos da referência que você passou para a função.
    getDocs(queryRef)
    // para cada requisição existe a propriedade snapshotm onde seria o array com os objetos sendo passados individualmente
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

  function handleImageLoad(id: string){
    setLoadImages((prevedImagesLoaded)=> [...prevedImagesLoaded, id])
  }

  async function handleSearchCar(){
    if(input == ''){
      loadCars();
      return;
    }

    setCars([])
    setLoadImages([])

    const q = query(collection(db, "cars"), 
    where("name", ">=", input.toUpperCase()),
    where("name", "<=", input.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q);
    
    const listCars = [] as carsProps[];
    querySnapshot.forEach((doc)=> {
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

      setCars(listCars)

    })

  }

    return (
      <>
        <Container>
          <section className='bg-white p-4 rounded-lg max-w-3xl mx-auto flex justify-between px-4 gap-2'>
            <input
            onChange={ (e)=> setInput(e.target.value) }
            value = {input} 
            type="text" 
            placeholder='Nome do veiculo'
            className='w-full border-2 rounded-lg h-9 px-3 outline-none focus:border-red-400 transition-all' 
            />
            <button
            className='bg-red-500 h-9 px-8 rounded-lg text-white font-medium drop-shadow hover:bg-red-700 transition-all'
            onClick={handleSearchCar}
            >Buscar</button>
          </section>

          <h1 className='mt-6 font-bold text-center text-2xl mb-4 '>
            Carros novos e usados em todo o Brasil
          </h1>

          <main className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {cars.map((car) => (
              <Link key={car.id} to={`/car/${car.id}`}>
                <section className='w-full bg-white rounded-lg shadow-lg'>
                    <div 
                    className='w-full h-72 rounded-lg bg-slate-300'
                    style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
                    ></div>
                    {car.carImages && car.carImages.length > 0 && (
                      <img
                        className='w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all cursor-pointer'
                        src={car.carImages[0]?.url}
                        alt="Carro"
                        style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
                        onLoad={()=> handleImageLoad(car.id)}
                      />
                    )}
                  <p className='font-bold mt-1 mb-2 px-2 text-2xl'>{car.name}</p>
                  <div className='flex flex-col px-2 pb-2'>
                    <span className='text-zinc-700 mb-6'>Ano: {car.year} | {car.km} km</span>
                    <strong className='text-black text-xl font-bold'>R$ {car.price}</strong>
                  </div>

                  <div className='border border-solid border-b-black h-px '></div>

                  <div className='p-2 flex items-center gap-1'>
                    <FaLocationDot color='#000' size={15}/>
                    <span className='font-medium'>{car.city}</span>
                  </div>
                </section>
              </Link>
            ))}
          </main>

        </Container>
      </>
    )
}
  
  