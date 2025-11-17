import {Cart} from "./cart.js";
const startTime = Date.now();

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
class Catalog {
	#doc;
	#parser;
	#data;
	#actualSet;
	#paginatorResultElement;
	#productContainer;
	#pageListData;
	#pageNumberContainer;
	constructor() {
		this.#parser = new DOMParser();
		this.#productContainer = document.querySelector("#productContainer");
		this.#paginatorResultElement = document.querySelector("#paginationCount");
		this.#pageNumberContainer = document.querySelector("#pageNumberButtons");
	}
	async init(dataUrl) {
		try {
			const response = await fetch(dataUrl);
			const json = await response.json();
			this.#data = json.data;
			// console.log("init data", this.#data);
			this.filteredPagesSet();
			console.log("Loding Time  ", Date.now() - startTime);
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	mountPageSet(pageNumber = 1) {
		const pageElementsSet = this.#pageListData[pageNumber - 1];
		const concatedString = pageElementsSet.join("");
		this.#productContainer.innerHTML = concatedString;

		const flatedArray = this.#pageListData.flat();
		this.setPaginationCount(pageElementsSet.length, flatedArray.length);
	}

	filteredPagesSet(filter) {
		if (
			!filter ||
			(filter.size === "" &&
				filter.color === "" &&
				filter.category === "" &&
				filter.salesStatus === false)
		) {
			const allProductsStringedData = this.#data.map((elem) => {
				return this.templateStringGenerator(elem);
			});
			this.splitPagesData(allProductsStringedData);

			this.mountPageSet(1);
		} else {
			const filteredData = this.allFilters(filter, this.#data);
			const filteredProductsStringedData = filteredData.map((elem) => {
				return this.templateStringGenerator(elem);
			});
			console.log("filteredData", filteredData);
			this.splitPagesData(filteredProductsStringedData);

			this.mountPageSet(1);
		}
	}
	createPaginationButtons() {
		const filledButton = this.#pageListData.map((list, idx) => {
			if (idx === 0) {
				return `<button class="page-button">1</button>`;
			} else {
				return `<button class="page-button__invert">${idx + 1}hell</button>`;
			}
		});
		const joinedTemplateString = filledButton.join("");
		console.log("joinedTemplateString", joinedTemplateString);
		this.#pageNumberContainer.innerHTML = joinedTemplateString;
	}

	setPaginationCount(actualPage, all) {
		const firstLineElem = this.#paginatorResultElement.firstElementChild;
		const secondLineElem =
			this.#paginatorResultElement.firstElementChild.firstElementChild;

		firstLineElem.innerHTML = `Showing 1-${actualPage} <span class="second-line"> Of ${all} Results</span>`;
	}
	allFilters(filter, data) {
		let filteredData = data;

		if (filter.size) {
			const filteredBySize = filteredData.filter((elem) =>
				this.sizeFilter(filter.size, elem.size)
			);
			filteredData = filteredBySize;
		}
		if (filter.color) {
			const filteredByColor = filteredData.filter((elem) =>
				this.colorFilter(filter.color, elem.color)
			);
			filteredData = filteredByColor;
		}
		if (filter.category) {
			const filteredByCategory = filteredData.filter((elem) =>
				this.categoryFilter(filter.category, elem.category)
			);
			filteredData = filteredByCategory;
		}
		if (filter.salesStatus) {
			const filteredBySalesStatus = filteredData.filter((elem) =>
				this.salesStatusFilter(filter.salesStatus, elem.salesStatus)
			);
			filteredData = filteredBySalesStatus;
		}

		console.log("allFilters ---------", filteredData);
		return filteredData;
	}
	sizeFilter(filter, data) {
		const truthTable = {
			S: ["S", "S, M, XL"],
			M: ["M", "S, M, XL"],
			L: ["L"],
			XL: ["XL", "S, M, XL"],
			"S-L": ["S", "M", "L", "S, M, XL"],
			"S, M, XL": ["S", "M", "XL", "S, M, XL"],
		};
		const dataMatch = truthTable[filter];
		console.log("sizeFilter ", dataMatch.includes(data));
		return dataMatch.includes(data);
	}
	colorFilter(filter, data) {
		console.log("colorFilter", filter, data);
		return filter === data;
	}
	categoryFilter(filter, data) {
		console.log("categoryFilter", filter, data);
		return filter === data;
	}
	salesStatusFilter(filter, data) {
		console.log("salesStatusFilter", filter, data);
		return filter === data;
	}
	sortedPagesSet(sortBy) {
		switch (sortBy) {
			case "lowest_highest":
				console.log("lowest_highest");
				break;
			case "highet_lowest":
				console.log("highet_lowest");
				break;
			case "popularity":
				console.log("rating");
				break;
			case "rating":
				console.log("rating");
				break;
			default:
				console.log("default");
		}
	}

	splitPagesData(data, number = 12) {
		console.log("all filtered data length", data.length);
		if (data.length <= number) {
			this.#pageListData = [data];
			console.log("PAGE LIST1", this.#pageListData);
		} else if (data.length !== 0) {
			const newSplitedArray = [];
			for (let i = 0; data.length !== 0; i++) {
				const splicy = data.splice(0, number);
				newSplitedArray.push(splicy);
			}

			this.#pageListData = [...newSplitedArray];
			console.log("");
			console.log("PAGE LIST2", this.#pageListData);
		}
	}

	templateStringGenerator(data) {
		const dataTemp = data;
		const productCard = `<div class="flex-item" id="${dataTemp.id}">
          <div class="product-card">
            <picture>
              <source srcset="/${dataTemp.imageUrl}" />
              <img src="/${dataTemp.imageUrl}" 
              alt="${dataTemp.category} ${
			dataTemp.color
		}" width="296" height="400" class="product-card__image">
            </picture>
            <div class="product-card__body">
              <h3 class="product-card__title">Vel vestibulum elit tuvel euqen.</h3>
              <p class="product-card__price">$${dataTemp.price}</p>
              <button class="btn-primary">Add To Cart</button>
              <div class="btn-small ${dataTemp.salesStatus ? "in-sale" : ""}">
                SALE
              </div>
            </div>
          </div>
        </div>`;
		return productCard;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	let filterQuery = {
		size: "",
		color: "",
		category: "",
		salesStatus: false,
	};
	const cartCounterElement = document.querySelector("#cartCounter");
	const myCart = new Cart(cartCounterElement);
	const bestSetContainer = document.querySelector("#recommendation-container");
	mountRecommendationProduct(bestSetContainer, bestSet);
	// dataAccess();

	const productCatalog = new Catalog();
	productCatalog.init("/assets/data.json");

	const paginationCount = document.querySelector("#paginationCount");
	// console.log(paginationCount);

	const selectBox = document.querySelector("#selectSort");
	selectBox.addEventListener("change", (e) => console.log(e.target.value));

	const filterBtn = document.querySelector("#filterBtn");
	const filterDropdown = document.querySelector("#filterDropdown");

	const selectSize = filterDropdown.querySelector("#selectSize");
	const selectColor = filterDropdown.querySelector("#selectColor");
	const selectCategory = filterDropdown.querySelector("#selectCategory");
	const selectSales = filterDropdown.querySelector("#selectSales");

	[selectSize, selectColor, selectCategory].forEach((elem) => {
		elem.addEventListener("click", (e) => {
			switch (e.target.id) {
				case "selectSize":
					console.log("selectSize", e.target.value);
					filterQuery.size = e.target.value;
					break;
				case "selectColor":
					console.log("selectColor");
					filterQuery.color = e.target.value;
					break;
				case "selectCategory":
					console.log("selectCategory");
					filterQuery.category = e.target.value;
					break;
			}
			if (
				filterQuery.category.length ||
				filterQuery.color.length ||
				filterQuery.salesStatus ||
				filterQuery.size
			) {
				productCatalog.filteredPagesSet(filterQuery);
			}

			console.log("check", e.target.value);
			console.log("filterQuery", filterQuery);
		});
	});

	let selectSalesChecked = selectSales.checked;
	selectSales.addEventListener("mousedown", () => {
		selectSalesChecked = selectSales.checked;
	});
	selectSales.addEventListener("click", () => {
		if (selectSalesChecked) [(selectSales.checked = false)];
		filterQuery.salesStatus = selectSales.checked;
		console.log("filterQuery", filterQuery);

		productCatalog.filteredPagesSet(filterQuery);
	});

	const clearFilters = filterDropdown.querySelector("#clear_filters");
	const hideFilters = filterDropdown.querySelector("#hide_filters");
	// console.log(clearFilters, hideFilters);
	[clearFilters, hideFilters].forEach((el) =>
		el.addEventListener("click", (e) => {
			if (e.target.id === "clear_filters") {
				console.log("clear");
				const defaultQuerry = {
					size: "",
					color: "",
					category: "",
					salesStatus: false,
				};
				[selectSize, selectColor, selectCategory].forEach(
					(elem) => (elem.value = "")
				);
				selectSales.checked = false;
				filterQuery = {...defaultQuerry};

				console.log("filterQuery", filterQuery);
				productCatalog.filteredPagesSet();
				//apply filtering for clear showFilteredData(filterQuery)
			} else if (e.target.id === "hide_filters") {
				filterDropdown.classList.toggle("hide");
			}
		})
	);
	filterBtn.addEventListener("click", (e) => {
		console.log("OPEN FILTER MODAL");
		filterDropdown.classList.toggle("hide");
	});

	const searchInput = document.querySelector("#searchInput");
	searchInput.addEventListener("change", (e) => console.log("Cheange", e));
});

// async function dataAccess() {
// 	try {
// 		const data = await fetchLocalData("/assets/data.json");
// 	} catch (error) {
// 		console.error("Error with data Acces", error);
// 	}
// }

// async function fetchLocalData(url) {
// 	try {
// 		const response = await fetch(url);
// 		const json = await response.json();
// 		return json.data;
// 	} catch (err) {
// 		throw err;
// 	}
// }

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

function docElementGenerator(data) {
	const parser = new DOMParser();
	if (data) {
		const elementString = productCardString(data);
		const newDoc = parser.parseFromString(elementString, "text/html");
		return newDoc.body.firstChild;
	}
}

function makeTempString(data) {
	const bestSetTemplate = `<li class="recommendation-list__item">
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
