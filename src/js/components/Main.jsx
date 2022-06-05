import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import img from '../../../images/sdu-back.js';


export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  return (
    <>
      <main className='loginMain'>
        <div className='box mt-5 container mx-auto row vw-60'>  
          <img className='hero img-fluid' src={img} alt='hero' />
          <div className='boxCo container d-flex align-items-end'>            
            <div className='w-20 loginBox mb-3 ms-3'>
              <h2 className="titleHero mb-0 text-uppercase">Книга для подготовки к <span className="badge bg-secondary">ЕНТ</span></h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
