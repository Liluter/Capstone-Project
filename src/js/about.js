import {Cart} from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
	const cartCounterElement = document.querySelector("#cartCounter");
	const myCart = new Cart(cartCounterElement);
	myCart.cartInit();
});
