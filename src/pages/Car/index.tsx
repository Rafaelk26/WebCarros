import { useEffect, useState } from 'react'
import { Container } from '../../components/container/index';
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom';

import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/index';

import {Swiper, SwiperSlide } from 'swiper/react';


interface carProps{
  id: string;
  name: string;
  model: string;
  city: string;
  price: string | number;
  description: string;
  km: string;
  year: string;
  created: string;
  owner: string;
  uid: string;
  whatsapp: string;
  images: imageCarProps[];
}

interface imageCarProps{
  uid: string;
  name: string;
  url: string;
}

export function CarDetail() {
  
  const { id } = useParams()
  const [car, setCar] = useState<carProps>()
  const nav = useNavigate()
  
  const [sliderPerView, setSliderPerView] = useState<number>(2)

  useEffect(()=> {
    loadCar()
  }, [id])

  async function loadCar(){
    if(!id){return}
    const docRef = doc(db, "cars", id)
    getDoc(docRef)
    .then((snapshot)=>{

      if(!snapshot.data()){
        nav("/")
      }

      setCar({
        id: snapshot.id,
        name: snapshot.data()?.name,
        year: snapshot.data()?.year,
        city: snapshot.data()?.city,
        model: snapshot.data()?.model,
        description: snapshot.data()?.description,
        price: snapshot.data()?.price,
        created: snapshot.data()?.created,
        km: snapshot.data()?.km,
        owner: snapshot.data()?.owner,
        uid: snapshot.data()?.uid,
        whatsapp: snapshot.data()?.whatsapp,
        images: snapshot.data()?.carImages
      })
    })
  }

  useEffect(()=>{
    function handleResize(){
      window.innerWidth < 720 ? setSliderPerView(1) : setSliderPerView(2);
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return()=> {
      window.removeEventListener('resize', handleResize)
    }
  },[])

    return (
      <>
        <Container>
          {/* <h1>SLIDER</h1> */}
          <Swiper
          slidesPerView={sliderPerView}
          pagination={{clickable: true}}
          navigation
          >
            {car && car.images && car.images.map( image => (
              <SwiperSlide key={image.name}>
                <img 
                src={image.url} 
                alt={image.name}
                className='w-full h-96 object-cover' 
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {car && (
            <main className='w-full bg-white rounded-lg p-6 my-4'>
              <div className='flex flex-col sm:flex-row mb-4 items-center justify-between'>
                <h1 className='font-bold text-3xl text-black'>{car?.name}</h1>
                <h1 className='font-bold text-3xl text-black'>R$ {car?.price}</h1>
              </div>
              <p>{car?.model}</p>
              <div className="flex w-full gap-6 my-4">
                <div className='flex flex-col gap-4'>
                  <div>
                    <p>Cidade</p>
                    <strong>{car?.city}</strong>
                  </div>

                  <div>
                    <p>Ano</p>
                    <strong>{car?.year}</strong>
                  </div>
                </div>

                <div className='flex flex-col gap-4'>
                  <div>
                    <p>Km</p>
                    <strong>{car?.km}</strong>
                  </div>
                </div>
              </div>

              <strong>Descrição:</strong>
              <p className='mb-4'>{car?.description}</p>

              <strong>Telefone:</strong>
              <p>{car?.whatsapp}</p>              

              <a 
              href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&&text='Olá ${car.owner}, vi esse ${car.name} e fiquei interessado!`} 
              className='bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer'
              target='_blank'
              >
                Conversar com o vendedor
                <FaWhatsapp size={26} color='#fff'/>
              </a>
            </main>
          )}


        </Container>
      </>
    )
}
  
  