const travelContainer = document.querySelector(".travel-suitcases");
const flexContainer = travelContainer.querySelector(".product-list__container");

const cartCounterElement = document.querySelector("#cartCounter");

const mySliderHandler = createSliderHandler(flexContainer);

flexContainer.addEventListener("click", mySliderHandler);

const selectedProductsContainer = document.querySelector(
	".selected-products .product-list__container"
);
const newProductsArrivalContainer = document.querySelector(
	".new-products-arrival .product-list__container"
);

const productCardTemplate = `
				<div class="flex-item">
					<div class="product-card">
            <picture>
							<source srcset="" />
              <img src="" alt="" width="296"
                height="400" class="product-card__image">
            </picture>
            <div class="product-card__body">
              <h3 class="product-card__title">Vel vestibulum elit tuvel euqen.</h3>
              <p class="product-card__price"></p>
              <button class="btn-primary"></button>
              <div class="btn-small in-sale">
                SALE
              </div>
            </div>
          </div>
				</div>
					`;

class TemplateHtmlParser {
	#doc;
	#parser;
	#templateString;
	constructor(templateString) {
		this.#templateString = templateString;
		this.#parser = new DOMParser();
		this.#doc = this.#parser.parseFromString(this.#templateString, "text/html");
	}

	createProductCard(data, btnTitle) {
		const elementTemplate = this.#doc.body.firstChild.cloneNode(true);
		const pictureEle = elementTemplate.querySelector("picture");
		elementTemplate.id = data.id;
		const [sourceElem, imgElem] = pictureEle.children;
		sourceElem.srcset = data.imageUrl;
		imgElem.src = data.imageUrl;
		imgElem.alt = `${data.color} ${data.category}`;
		const cardBody = elementTemplate.querySelector(".product-card__body");
		const [nameElem, priceElem, btnElem, saleElem] = cardBody.children;
		nameElem.textContent = data.name;
		btnElem.textContent = btnTitle;
		priceElem.textContent = `$${data.price}`;
		data.salesStatus ? null : saleElem.classList.remove("in-sale");

		return elementTemplate;
	}
}

class Cart {
	#cartName = "BestShopCart";
	constructor(cartElement) {
		this.cartElement = cartElement;
		this.cartInit();
	}
	cartInit() {
		const existingCart = window.localStorage.getItem(this.#cartName);
		if (existingCart) {
			this.updateCouterElement();
		} else {
			this.writeData();
			this.updateCouterElement();
		}
	}
	itemCaunter() {
		const data = this.parseData();
		if (data) {
			return data.length;
		} else {
			return 0;
		}
	}
	updateCouterElement() {
		if (this.itemCaunter() === 0) {
			this.cartElement.classList.add("counter--hidden");
			this.cartElement.textContent = "";
		} else {
			this.cartElement.classList.remove("counter--hidden");
			this.cartElement.textContent = this.itemCaunter();
		}
	}
	parseData() {
		try {
			const cartItems = window.localStorage.getItem(this.#cartName);
			const jsonData = JSON.parse(cartItems);
			return jsonData;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	writeData(data) {
		try {
			const localData = this.parseData();
			if (localData !== null && localData.length >= 0) {
				if (!data) {
					throw new Error("No data passed or wrong data");
				}
				const incomingDataArr = [data];
				const newDataArr = [...localData, ...incomingDataArr];
				const stringifyNewData = JSON.stringify(newDataArr);
				window.localStorage.setItem(this.#cartName, stringifyNewData);
				this.updateCouterElement();
			} else {
				const emptyArr = [];
				const stingifyDate = JSON.stringify(emptyArr);
				window.localStorage.setItem(this.#cartName, stingifyDate);
				this.updateCouterElement();
			}
		} catch (error) {
			console.error(error);
		}
	}
}

const myCart = new Cart(cartCounterElement);

const htmlParser = new TemplateHtmlParser(productCardTemplate);

dataAccess();

async function dataAccess() {
	try {
		const data = await fetchLocalData("assets/data.json");

		mountElements(
			data,
			selectedProductsContainer,
			"Add To Cart",
			"Selected Products"
		);
		mountElements(
			data,
			newProductsArrivalContainer,
			"View Product",
			"New Products Arrival"
		);
		//
		const productLists = document.querySelectorAll(
			".product-list__container:not(.product-list__container--slider)"
		);

		const arrProdCards = [...productLists];
		arrProdCards.forEach((list) =>
			list.addEventListener("click", (e) => {
				const picture = e.target.closest("picture");
				if (picture) {
					redirectToProductPage(picture);
				} else {
					const btn = e.target.closest(".btn-primary");
					if (btn && btn.textContent === "Add To Cart") {
						const btnId = btn.closest(".flex-item").id;
						const productItem = getProductById(data, btnId);
						myCart.writeData(productItem);
					} else if (btn) {
						redirectToProductPage(btn);
					}
				}
			})
		);
	} catch (error) {
		console.error("Error with data Acces", error);
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

function mountElements(data, containerElement, btnTitle, filterBy) {
	const selectedProductsItems = data.filter((element) =>
		element.blocks.includes(filterBy)
	);
	const productCardElements = selectedProductsItems.map((data) =>
		htmlParser.createProductCard(data, btnTitle)
	);
	containerElement.append(...productCardElements);
}

async function fetchLocalData(url) {
	try {
		const response = await fetch(url);
		const json = await response.json();
		return json.data;
	} catch (err) {
		throw err;
	}
}

function createSliderHandler(container) {
	let pending = false;
	return function handleClick(event) {
		const sliderContainer = container;

		if (!pending) {
			pending = true;
			const direction = event.x < window.innerWidth / 2;
			const firstElem = sliderContainer.firstElementChild;
			const lastElement = sliderContainer.lastElementChild;
			let elementTomove;
			let firstNeighbore;
			let cloneToMove;
			if (direction) {
				elementTomove = firstElem.nextElementSibling;
				firstNeighbore = elementTomove.nextElementSibling;
				cloneToMove = elementTomove.nextElementSibling.cloneNode(true);
			} else {
				elementTomove = lastElement.previousElementSibling;
				firstNeighbore = elementTomove.previousElementSibling;
				cloneToMove = elementTomove.previousElementSibling.cloneNode(true);
			}
			if (elementTomove) {
				const oldRect = elementTomove.getBoundingClientRect();
				const newRect = firstNeighbore.getBoundingClientRect();
				const deltaX = oldRect.left - newRect.left;
				sliderContainer.style.transition = "transform 0.5s ease";
				sliderContainer.style.transform = `translate(${deltaX}px, 0)`;

				setTimeout(() => {
					sliderContainer.style.transition = "none";
					sliderContainer.style.transform = `translate(0, 0)`;
					const childElements = [...sliderContainer.children];
					if (direction) {
						sliderContainer.replaceChildren(...childElements.slice(1));
						sliderContainer.append(cloneToMove);
					} else {
						sliderContainer.replaceChildren(...childElements.slice(0, 9));
						sliderContainer.prepend(cloneToMove);
					}
					pending = false;
				}, 500);
			}
		}
	};
}
