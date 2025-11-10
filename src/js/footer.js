const footerHtml = `
<footer class="footer-container">
  <div class="benefits-container">
    <section class="benefits">
      <h4>
        Our Benefits
      </h4>
      <ul class="list">
        <li>
          <img src="/assets/images/footer/benefits-plane.webp" alt="plane icon" width="60" height="60">
          <span>Velit nisl sodales eget donec quis. volutpat orci.</span>
        </li>
        <li>
          <img src="/assets/images/footer/benefits-truck.webp" alt="truck icon" width="60" height="60">
          <span>Dolor eu varius. Morbi fermentum velit nisl.</span>
        </li>
        <li>
          <img src="/assets/images/footer/benefits-coins.webp" alt="coins icon" width="60" height="60">
          <span>Malesuada fames ac ante ipsum primis in faucibus.</span>
        </li>
        <li>
          <img src="/assets/images/footer/benefits-hat.webp" alt="hat icon" width="60" height="60">
          <span>Nisl sodales eget donec quis. volutpat orci.</span>
        </li>
      </ul>
    </section>

  </div>
  <div class="info-container">
    <section class="footer-main-links">
      <section class="footer-group">
        <h4><a href="html/about.html">About Us</a></h4>
        <nav aria-label="Links about company">
          <ul>
            <li>Organisation</li>
            <li>Partners</li>
            <li>Clients</li>
          </ul>
        </nav>
      </section>
      <section class="footer-group">
        <h4>Interesting Links</h4>
        <nav aria-label="Interwsting social links">
          <li>Photo Galery</li>
          <li>Our Team</li>
          <li>Socials</li>
        </nav>
      </section>
      <section class="footer-group">
        <h4>Achievements</h4>
        <nav aria-label="Interwsting social links">
          <li>Winning Awards</li>
          <li>Press</li>
          <li>Our Amazing Clients</li>
        </nav>
      </section>
    </section>
    <section class="footer-shipping">
      <h4>Shipping Information</h4>
      <p>Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac. Ut sit amet erat nec nibh rhoncus varius
        in non lorem. Donec interdum, lectus in convallis pulvinar, enim elit porta sapien, vel finibus erat felis sed
        neque. Etiam aliquet neque sagittis erat tincidunt aliquam.</p>
    </section>
    <section class="footer-contact">
      <h4><a href="html/contact.html">Contact Us</a></h4>
      <p>Bendum dolor eu varius. Morbi fermentum velitsodales egetonec. volutpat orci. Sed ipsum felis, tristique
        egestas et, convallis ac velitn consequat nec luctus.</p>
      <address>
        <ul class="address-list">
          <li>
            <a href="tel:+632366322" class="contact-item-wrapper" aria-label="Make phone call to (+63) 236 6322">
              <img src="/assets/images/footer/phone-icon.webp" class="contact-icon" alt="phone icon" width="24"
                height="24">
              <span>Phone: (+63) 236 6322</span></a>
          </li>
          <li>
            <a href="mailto:public@news.com" class="contact-item-wrapper">
              <img src="/assets/images/footer/envelope-icon.webp" class="contact-icon" alt="envelop icon" width="24"
                height="18">
              <span>public@news.com</span>
            </a>
          </li>
          <li>
            <div class="contact-item-wrapper">
              <img src="/assets/images/footer/watch-icon.webp" class="contact-icon" alt="watch icon" width="27"
                height="27">
              <div class="text-container">
                <span class="line-part">Mon - Fri: 10am - 6pm</span>
                <span class="line-part">Sat - Sun: 10am - 6pm</span>
              </div>
            </div>
          </li>
          <li>
            <div class="contact-item-wrapper">
              <img src="/assets/images/footer/pin-icon.webp" class="contact-icon" alt="hat icon" width="20" height="24">
              <span>639 Jade Valley, Washington Dc</span>
            </div>
          </li>
        </ul>
      </address>
    </section>
    <div class="footer-bottom">
      <p class="copyright">&copy; Copyright 2025</p>
    </div>
  </div>
</footer>
`;

document.addEventListener("DOMContentLoaded", () =>
	document.body.insertAdjacentHTML("beforeend", footerHtml)
);
