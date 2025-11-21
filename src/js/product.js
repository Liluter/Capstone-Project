import {Cart} from "../js/cart.js";

document.addEventListener("DOMContentLoaded", dataAccess);

async function dataAccess() {
	try {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const productId = urlParams.get("id");
		const data = await fetchLocalData("/assets/data.json");
		const cartCounterElement = document.querySelector("#cartCounter");
		const myCart = new Cart(cartCounterElement);
		const selectedProduct = data.filter((item) => item.id === productId);
		const mainPicture = document.querySelector("#mainPicture");
		const title = document.querySelector("#productTitle");
		const priceValue = document.querySelector("#priceValue");
		const inputPcs = document.querySelector("#inputPcs");

		inputPcs.addEventListener("click", (e) => {
			switch (e.target.id) {
				case "increment":
					inputPcs.children[1].value = +inputPcs.children[1].value + 1;
					break;
				case "decrement":
					if (inputPcs.children[1].value === "1") {
						break;
					} else {
						inputPcs.children[1].value = inputPcs.children[1].value - 1;
					}
					break;
			}
		});

		[...mainPicture.children].forEach((e) => {
			const newSource = selectedProduct[0].imageUrl;
			e.src = `../${newSource}`;
		});
		title.textContent = selectedProduct[0].name;

		const ratingStarList = document.querySelector("#rating-star-list");
		[...ratingStarList.children].forEach((star, idx) => {
			if (idx + 1 < selectedProduct[0].rating) {
				star.classList.add("icon-star__yellow");
				star.classList.remove("icon-star__gray");
				return;
			}
			star.classList.remove("icon-star__yellow");
			star.classList.add("icon-star__gray");
		});

		priceValue.textContent = `$${selectedProduct[0].price}`;

		const productForm = document.querySelector("#product-form");
		productForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const productData = selectedProduct[0];
			myCart.writeData(productData, +inputPcs.children[1].value);
		});

		const infoNav = document.querySelector(".info__nav");
		const infoContainer = document.querySelector("#info-container");
		const alsoLikeConteiner = document.querySelector(
			".also-like .product-list__container"
		);

		infoNav.addEventListener("click", (e) => {
			const listNav = [...infoNav.children];
			listNav.forEach((child, idx) => {
				if (child.firstElementChild === e.target) {
					child.firstElementChild.classList.add("info__active");

					infoContainer.children[idx].classList.remove("hide");
					return;
				}
				infoContainer.children[idx].classList.add("hide");
				child.firstElementChild.classList.remove("info__active");
			});
		});

		alsoLikeConteiner.addEventListener("click", (e) => {
			const btn = e.target.closest(".btn-primary");

			if (btn && btn.textContent === "Add To Cart") {
				const btnId = btn.closest(".flex-item").id;
				const productItem = getProductById(data, btnId);
				myCart.writeData(productItem);
			} else if (btn) {
				redirectToProductPage(btn);
			}
		});

		const reviewForm = document.querySelector("#reviewForm");
		const emailInput = document.querySelector("#email-input");
		const messagePopup = document.querySelector("#messagePopup");

		reviewForm.addEventListener("submit", (e) => {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			e.preventDefault();
			let isInvalid = true;
			const emailValue = emailInput.value.trim();
			if (!emailRegex.test(emailValue)) {
				isInvalid = false;
			}
			if (isInvalid) {
				messagePopup.firstElementChild.textContent =
					"Form submited succesfully.";
				messagePopup.classList.add("success");
				messagePopup.classList.toggle("hide");
				setTimeout(() => {
					messagePopup.classList.toggle("hide");
					messagePopup.classList.remove("failure");
					messagePopup.classList.remove("success");
				}, 3000);
			} else {
				messagePopup.firstElementChild.textContent =
					"Form invalid, please check.";
				messagePopup.classList.add("failure");
				messagePopup.classList.toggle("hide");
				setTimeout(() => {
					messagePopup.classList.toggle("hide");
					messagePopup.classList.remove("failure");
					messagePopup.classList.remove("success");
				}, 3000);
				emailInput.focus();
			}
		});
		mountRecommendationProduct(alsoLikeConteiner, data);
	} catch (error) {
		console.error("Some error ocure", error);
	}
}

async function fetchLocalData(url) {
	try {
		const response = await fetch(url);
		const json = await response.json();
		return json.data;
	} catch (error) {
		console.error("Error during fetching data ", error);
	}
}

function getProductById(data, productId) {
	const filteredItem = data.filter((elem) => elem.id === productId);
	return filteredItem[0];
}

function redirectToProductPage(descendantElement) {
	const parent = descendantElement.closest(".flex-item");
	if (parent) {
		const productId = parent.id;
		const pageUrl = "/html/product.html";
		const targetUrl = `${pageUrl}?id=${encodeURIComponent(productId)}`;
		window.location.href = targetUrl;
	}
}

function mountRecommendationProduct(destination, dataSet) {
	const data = [...dataSet];
	if (data) {
		let mixedArr = [];
		for (let i = 0; i < 4; i++) {
			const happyNumber = Math.floor(Math.random() * data.length);
			const splicy = data.splice(happyNumber, 1);
			mixedArr.push(splicy[0]);
		}
		const parser = new DOMParser();

		const docArr = mixedArr.map((data) => {
			const newString = templateStringGenerator(data);
			const newDoc = parser.parseFromString(newString, "text/html");

			return newDoc.body.firstChild;
		});
		destination.append(...docArr);
	}
}

function templateStringGenerator(data) {
	const productCard = `<div class="flex-item" id="${data.id}">
          <div class="product-card">
            <picture>
              <source srcset="/${data.imageUrl}" />
              <img src="/${data.imageUrl}" 
              alt="${data.category} ${
		data.color
	}" width="296" height="400" class="product-card__image">
            </picture>
            <div class="product-card__body">
              <h3 class="product-card__title">Vel vestibulum elit tuvel euqen.</h3>
              <p class="product-card__price">$${data.price}</p>
              <button class="btn-primary">Add To Cart</button>
              <div class="btn-small ${data.salesStatus ? "in-sale" : ""}">
                SALE
              </div>
            </div>
          </div>
        </div>`;
	return productCard;
}
