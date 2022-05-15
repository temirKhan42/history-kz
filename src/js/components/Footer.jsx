import React from 'react';

function Footer() {
  return (
    <>
      <footer className='footer'>
        <div className="footerBox flex jc-sb">
          <address className='sites'>
            <a href="https://library.sdu.edu.kz/">www.sdu.edu.kz</a>
            <a href="https://sdu.edu.kz/contact-us/">info@sdu.edu.kz</a>
          </address>
          <address className='address'>
            <i>Абылайхан 1/1</i>
            <i>Алматы, Қаскелең</i>
          </address>
          <address className='tel'>
            <a href="tel:+77273079565">+7 727 307 95 65</a>
            <a href="tel:+77020001133">+7 702 000 11 33</a>
          </address>
        </div>
      </footer>
      <div className="copyRight">
        <p>Copyright © 2022.</p>
      </div>
    </>
  );
}

export default Footer;
