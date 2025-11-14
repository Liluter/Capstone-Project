import {Cart} from "./cart.js";

const bestSet = [
	{
		price: 1000,
		rating: 5,
		src: "../../assets/images/cataloge/set_red_small.webp",
	},
	{
		price: 1200,
		rating: 5,
		src: "../../assets/images/cataloge/set_black_small.webp",
	},
	{
		price: 2100,
		rating: 4,
		src: "../../assets/images/cataloge/set_blue_small.webp",
	},
	{
		price: 1500,
		rating: 4,
		src: "../../assets/images/cataloge/set_yellow_small.webp",
	},
	{
		price: 1100,
		rating: 4,
		src: "../../assets/images/cataloge/set_green_small.webp",
	},
];

document.addEventListener("DOMContentLoaded", () => {
	const cartCounterElement = document.querySelector("#cartCounter");
	const myCart = new Cart(cartCounterElement);
	const bestSetContainer = document.querySelector("#recommendation-container");
	mountRecommendationProduct(bestSetContainer, bestSet);
	dataAccess();
});

async function dataAccess() {
	try {
		const data = await fetchLocalData("/assets/data.json");
	} catch (error) {
		console.error("Error with data Acces", error);
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

function mountRecommendationProduct(destination, dataSet) {
	if (dataSet) {
		let mixedArr = [];
		for (let i = 0; i < 5; i++) {
			const happyNumber = Math.floor(Math.random() * dataSet.length);
			const splicy = dataSet.splice(happyNumber, 1);
			mixedArr.push(splicy[0]);
		}
		const parser = new DOMParser();

		const docArr = mixedArr.map((data) => {
			const newString = makeTempString(data);
			const newDoc = parser.parseFromString(newString, "text/html");

			return newDoc.body.firstChild;
		});
		destination.append(...docArr);
	}
}

function makeTempString(data) {
	const bestSetTemplate = ` <li class="recommendation-list__item">
    <a href="" class="recommendation-card">
    <picture class="recommendation-card__picture">
    <source type="image/webp" srcset="${data.src}">
    <img src="${data.src}" alt="Small product name"
    class="recommendation-card__image" width="87" height="87">
    </picture>
    <div class="recommendation-card__body">
    <div class="recommendation-card__title">Primis in faucibus aenean laoreet rhoncus ipsum eget.</div>
    <div class="recommendation-card__rating">
    <span class="icon-star icon-star__${
			data.rating >= 1 ? "yellow" : "gray"
		}"></span>
    <span class="icon-star icon-star__${
			data.rating >= 2 ? "yellow" : "gray"
		}"></span>
    <span class="icon-star icon-star__${
			data.rating >= 3 ? "yellow" : "gray"
		}"></span>
    <span class="icon-star icon-star__${
			data.rating >= 4 ? "yellow" : "gray"
		}"></span>
    <span class="icon-star icon-star__${
			data.rating >= 5 ? "yellow" : "gray"
		}"></span>
    </div>
    <div class="recommendation-card__price">$${data.price}</div>
    </div>
    </a>
    </li>`;
	return bestSetTemplate;
}
