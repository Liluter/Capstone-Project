const headerHtml = `
  <header class="header-container">
    <div class="site-header">
    <div class="header-top">
      <ul class="list socialmedia">
        <li>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/header/facebook_icon.svg" alt="facebook logo">
          </a>
        </li>
        <li>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/header/twitter_icon.svg" alt="twitter logo">
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/header/instagram_icon.svg" alt="instagram logo">
          </a>
        </li>
      </ul>
      <div class="header-branding">
        <a href="/" class="logo">
          <img src="/assets/images/header/suitcase_logo.svg" width="32" height="32" alt="logo">
          <span class="site-name">BEST SHOP</span>
        </a>
      </div>
      <ul class="list account-controls">
        <li>
          <button id="account-btn" class="icon-btn">
            <img src="/assets/images/header/user.svg" alt="user-icon" width="30" height="33">
          </button>
        </li>
        <li>
          <a href="/html/cart.html">
            <img src="/assets/images/header/shopping-cart.svg" alt="cart-icon" width="30" height="33">
            <div id="cartCounter" class="counter">3</div>
          </a>
        </li>
        <li id="burger-menu" class="header-menu">
          <img src="/assets/images/header/burger-menu-icon.svg" alt="menu-icon" width="30" height="33">
        </li>
      </ul>
    </div>
    <hr class="regular">
    <nav class="main-navigation">
      <ul class="list nav-list">
        <li><a href="/">Home</a></li>
        <li><a href="/html/catalog.html">Catalog
            <img class="arrow-icon" src="/assets/images/header/arrow-icon.svg" alt="arrow">
          </a></li>
        <li><a href="/html/about.html">About Us</a></li>
        <li><a href="/html/contact.html">Contact Us</a></li>
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
          <li><a href="/html/catalog.html">Catalog</a></li>
          <li><a href="/html/about.html">About Us</a></li>
          <li><a href="/html/contact.html">Contact Us</a></li>
        </ul>
        <hr class="special">
      </nav>
      <ul class="list socialmedia">
        <li>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/header/facebook_icon.svg" alt="facebook logo">
          </a>
        </li>
        <li>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/header/twitter_icon.svg" alt="twitter logo">
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/header/instagram_icon.svg" alt="instagram logo">
          </a>
        </li>
      </ul>
    </div>
    </div>
  </header>`;

let dropdownMenu;
document.body.insertAdjacentHTML("afterbegin", headerHtml);

document.addEventListener("DOMContentLoaded", () => {
	const loginModal = document.querySelector("#loginModal");
	const hidePassword = document.querySelector("#eyeIcon");
	const accountBtn = document.querySelector("#account-btn");
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const loginForm = document.querySelector("#loginForm");
	const emailInput = document.querySelector("#emailLoginInput");
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		let isInvalid = true;
		const emailValue = emailInput.value.trim();
		if (!emailRegex.test(emailValue)) {
			isInvalid = false;
		}
		if (isInvalid) {
			loginModal.classList.toggle("hide");
		} else {
			emailInput.focus();
		}
	});
	hidePassword.addEventListener("click", (e) => {
		const passwordInput = e.target.previousElementSibling;
		if (passwordInput.type === "password") {
			// eslint-disable-next-line sonarjs/no-hardcoded-passwords
			passwordInput.type = "text";
		} else {
			// eslint-disable-next-line sonarjs/no-hardcoded-passwords
			passwordInput.type = "password";
		}
	});

	accountBtn.addEventListener("click", (e) => {
		console.log("Autorisation", e.target);
		loginModal.classList.toggle("hide");
	});
	const burgerMenu = document.getElementById("burger-menu");
	burgerMenu.addEventListener("click", toggleMenu);
	document.body.addEventListener("click", (event) => closeMenu(event));
	dropdownMenu = document.querySelector(".site-header .dropdown-menu");
});

function toggleMenu() {
	dropdownMenu.classList.toggle("show");
}
function closeMenu(event) {
	if (
		event.target.closest(".dropdown-menu") ||
		event.target.closest(".main-container")
	) {
		dropdownMenu.classList.remove("show");
	}
}
