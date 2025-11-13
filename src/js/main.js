const travelContainer = document.querySelector(".travel-suitcases");
const flexContainer = travelContainer.querySelector(".product-list__container");
const mySliderHandler = createSliderHandler(flexContainer);

flexContainer.addEventListener("click", mySliderHandler);

const selectedProductsContainer = document.querySelector(
	".product-list--selected .product-list__container"
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
              <button class="btn-primary">Add To Cart</button>
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

	createProductCard(data) {
		const elementTemplate = this.#doc.body.firstChild.cloneNode(true);
		const pictureEle = elementTemplate.querySelector("picture");
		elementTemplate.id = data.id;
		const [sourceElem, imgElem] = pictureEle.children;
		sourceElem.srcset = data.imageUrl;
		imgElem.src = data.imageUrl;
		imgElem.alt = `${data.color} ${data.category}`;
		const cardBody = elementTemplate.querySelector(".product-card__body");
		const [nameElem, priceElem, , saleElem] = cardBody.children;
		nameElem.textContent = data.name;
		priceElem.textContent = `$${data.price}`;
		data.salesStatus ? null : saleElem.classList.remove("in-sale");

		return elementTemplate;
	}
}

const htmlParser = new TemplateHtmlParser(productCardTemplate);
// temporary off
mountSelectedProduct(selectedProductsContainer);

async function mountSelectedProduct(containerElement) {
	try {
		const data = await fetchLocalData("assets/data.json");
		const selectedProductsItems = data.filter((element) =>
			element.blocks.includes("Selected Products")
		);

		const productCardElements = selectedProductsItems.map((data) =>
			htmlParser.createProductCard(data)
		);
		containerElement.append(...productCardElements);
		console.log("productCardElements", selectedProductsItems);
	} catch (error) {
		console.error("Error with showSelectedProduct", error);
	}
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
