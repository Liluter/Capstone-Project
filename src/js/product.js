import {Cart} from "../js/cart.js";

document.addEventListener("DOMContentLoaded", dataAccess);

async function dataAccess() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const productId = urlParams.get("id");
	const paragrafId = document.getElementById("product_id");

	const cartCounterElement = document.querySelector("#cartCounter");
	const productForm = document.querySelector("#product-form");
	const infoNav = document.querySelector(".info__nav");
	const infoContainer = document.querySelector("#info-container");
	const myCart = new Cart(cartCounterElement);
	const data = await fetchLocalData("/assets/data.json");
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
	productForm.addEventListener("submit", (event) => {
		event.preventDefault();
		console.log("form", event);
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
	mountRecommendationProduct(alsoLikeConteiner, data);
}

async function fetchLocalData(url) {
	try {
		const response = await fetch(url);
		const json = await response.json();
		return json.data;
	} catch (error) {
		console.log("Error during fetching data ", error);
	}
}

function getProductById(data, productId) {
	console.log("getProductById", data);
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

const detailsContent = `<p>Vestibulum commodo sapien non elit porttitor, vitae volutpat nibh mollis. Nulla porta risus id neque tempor,
          in efficitur justo imperdiet. Etiam a ex at
          ante tincidunt imperdiet. Nunc congue ex vel nisl viverra, sit amet aliquet lectus ullamcorper. Praesent
          luctus lacus non lorem elementum, eu tristique
          sapien suscipit. Sed bibendum, ipsum nec viverra malesuada, erat nisi sodales purus, eget hendrerit dui ligula
          eu enim. Ut non est nisi. Pellentesque
          tristique pretium dolor eu commodo. Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna
          sit amet luctus. Suspendisse potenti.
          Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis
          pharetra, facilisis quam.</p>
        <br>
        <p>Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse
          potenti. Curabitur ac placerat est, sit amet sodales
          risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam. Proin iaculis nibh vitae
          lectus mollis bibendum. </p>
        <br>
        <p>Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales
          risus. Pellentesque viverra dui auctor,
          ullamcorper turpis pharetra, facilisis quam.</p>`;
