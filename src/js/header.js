const headerHtml = `
  <header class="header-container">
    <div class="site-header">
    <div class="header-top">
      <ul class="list socialmedia">
        <li>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/header/facebook_icon.svg" alt="facebook logo">
          </a>
        </li>
        <li>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/header/twitter_icon.svg" alt="twitter logo">
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/header/instagram_icon.svg" alt="instagram logo">
          </a>
        </li>
      </ul>
      <div class="header-branding">
        <a href="/" class="logo">
          <img src="assets/images/header/suitcase_logo.svg" width="32" height="32" alt="logo">
          <span class="site-name">BEST SHOP</span>
        </a>
      </div>
      <ul class="list account-controls">
        <li>
          <a href=""><img src="assets/images/header/user.svg" alt="user-icon" width="30" height="33"></a>
        </li>
        <li>
          <a href="html/cart.html">
            <img src="assets/images/header/shopping-cart.svg" alt="cart-icon" width="30" height="33">
            <div id="cartCounter" class="counter">3</div>
          </a>
        </li>
        <li id="burger-menu" class="header-menu">
          <img src="assets/images/header/burger-menu-icon.svg" alt="menu-icon" width="30" height="33">
        </li>
      </ul>
    </div>
    <hr class="regular">
    <nav class="main-navigation">
      <ul class="list nav-list">
        <li><a href="/">Home</a></li>
        <li><a href="html/catalog.html">Catalog
            <img class="arrow-icon" src="assets/images/header/arrow-icon.svg" alt="arrow">
          </a></li>
        <li><a href="html/about.html">About Us</a></li>
        <li><a href="html/contact.html">Contact Us</a></li>
      </ul>
    </nav>
    <div class="dropdown-menu">
      <ul class="list vert">
        <li><a href="">User Profile</a></li>
      </ul>
      <hr class="special">
      <nav class="navigation">
        <ul class="list nav-list vert">
          <li><a href="/">Home</a></li>
          <li><a href="html/catalog.html">Catalog</a></li>
          <li><a href="html/about.html">About Us</a></li>
          <li><a href="html/contact.html">Contact Us</a></li>
        </ul>
        <hr class="special">
      </nav>
      <ul class="list socialmedia">
        <li>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/header/facebook_icon.svg" alt="facebook logo">
          </a>
        </li>
        <li>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/header/twitter_icon.svg" alt="twitter logo">
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/header/instagram_icon.svg" alt="instagram logo">
          </a>
        </li>
      </ul>
    </div>
    </div>
  </header>`;

document.body.insertAdjacentHTML("afterbegin", headerHtml);
const burgerMenu = document.getElementById("burger-menu");
const cartIconCounter = document.getElementById("");
burgerMenu.addEventListener("click", toggleMenu);
document.body.addEventListener("click", (event) => closeMenu(event));
const dropdownMenu = document.querySelector(".site-header .dropdown-menu");

function toggleMenu() {
	dropdownMenu.classList.toggle("show");
}
function closeMenu(event) {
	if (
		event.target.closest(".dropdown-menu") ||
		event.target.parentElement === document.body
	) {
		dropdownMenu.classList.remove("show");
	}
}
