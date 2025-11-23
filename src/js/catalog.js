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

class Catalog {
	#data;
	#paginatorResultElement;
	#productContainer;
	pageListData;
	#pageNumberContainer;
	currentPageNumber;
	#backButton;
	#nextButton;
	#cart;
	#actualDataSet;
	#defaultSortData;
	activeFilters;
	#timer;
	searchPopup;
	constructor(cart) {
		this.#productContainer = document.querySelector("#productContainer");
		this.#paginatorResultElement = document.querySelector("#paginationCount");
		this.#pageNumberContainer = document.querySelector("#pageNumberButtons");
		this.#backButton = document.querySelector("#backButton");
		this.#nextButton = document.querySelector("#nextButton");
		this.activeFilters = document.querySelector("#activeFilters");
		this.searchPopup = document.querySelector("#searchPopup");
		this.#cart = cart;

		this.searchPopup.addEventListener("click", this.popUpHandler);
	}
	async init(dataUrl) {
		try {
			const response = await fetch(dataUrl);
			const json = await response.json();
			this.#data = json.data;
			this.filteredPagesSet();
			this.#productContainer.addEventListener("click", (e) => {
				const productId = e.target.closest(".flex-item").id;
				const selectedProduct = this.getProductById(this.#data, productId);
				this.#cart.writeData(selectedProduct);
			});
		} catch (error) {
			console.error("Error parsing data ", error);
		}
	}
	getProductById(data, productId) {
		const filteredItem = data.filter((elem) => elem.id === productId);
		return filteredItem[0];
	}

	mountPageSet(pageNumber = 1) {
		this.setActivePage(pageNumber);
		const pageElementsSet = this.pageListData[pageNumber - 1];
		const concatedString = pageElementsSet.join("");
		this.#productContainer.innerHTML = concatedString;
		this.setActivePage(pageNumber);

		const flatedArray = this.pageListData.flat();
		const secondNum = (12 * (pageNumber - 1) + 1).toString();
		const start = pageNumber === 1 ? 1 : secondNum;
		const endRange = +start + pageElementsSet.length - 1;

		this.setPaginationCount(start, endRange, flatedArray.length);
		this.#productContainer.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	searchProduct(query) {
		if (this.#timer) {
			clearTimeout(this.#timer);
		}
		this.#timer = setTimeout(() => {
			const results = this.#data.filter((elem) =>
				elem.name.toLowerCase().includes(query.toLowerCase())
			);
			if (results.length === 1) {
				this.redirectToProductPage(results[0].id);
			} else if (query) {
				this.showPopUp();
			}
			this.#timer = undefined;
		}, 1000);
	}
	popUpHandler(event) {
		const button = event.target.closest("#popupBtn");
		if (button) {
			event.target.closest("#searchPopup").classList.add("hide");
		}
	}
	showPopUp() {
		this.searchPopup.classList.remove("hide");
		setTimeout(function () {
			this.searchPopup.classList.add("hide");
		}, 5000);
	}

	redirectToProductPage(productId) {
		const pageUrl = "/html/product.html";
		const targetUrl = `${pageUrl}?id=${encodeURIComponent(productId)}`;
		window.location.href = targetUrl;
	}
	activeFilterInfoHandler(filterQuery) {
		if (filterQuery) {
			this.activeFilters.classList.remove("hide");

			const sizeTekst = filterQuery.size ? `by Size ${filterQuery.size}, ` : "";
			const colorTekst = filterQuery.color
				? `by Color ${filterQuery.color}, `
				: "";
			const categoryTekst = filterQuery.category
				? `by Category ${filterQuery.category}, `
				: "";

			this.activeFilters.textContent = `Active filters: ${[
				sizeTekst,
				colorTekst,
				categoryTekst,
			].join("")} `;
			this.activeFilters.classList.remove("hide");
		} else {
			this.activeFilters.classList.add("hide");
		}
	}
	setActivePage(pageNumber) {
		this.currentPageNumber = pageNumber;
		this.createPaginationButtons();
	}
	filteredPagesSet(filter) {
		this.activeFilterInfoHandler(filter);
		if (
			!filter ||
			(filter.size === "" &&
				filter.color === "" &&
				filter.category === "" &&
				filter.salesStatus === false)
		) {
			this.#actualDataSet = this.#data;
			this.#defaultSortData = this.#data;
			this.mountData(this.#data);
		} else {
			const filteredData = this.allFilters(filter, this.#data);
			this.#defaultSortData = filteredData;
			this.#actualDataSet = filteredData;
			this.mountData(filteredData);
		}
	}

	mountData(data) {
		const stringedData = data.map((elem) => {
			return this.templateStringGenerator(elem);
		});
		this.splitPagesData(stringedData);
		this.mountPageSet(1);
	}

	createPaginationButtons() {
		const filledButton = this.pageListData.map((list, idx) => {
			if (idx === 0) {
				return `<button class="page-button${
					this.currentPageNumber === idx + 1 ? "" : "__invert"
				}">1</button>`;
			} else {
				return `<button class="page-button${
					this.currentPageNumber === idx + 1 ? "" : "__invert"
				}">${idx + 1}</button>`;
			}
		});
		if (this.currentPageNumber === 1) {
			this.#backButton.classList.add("page-button__hidden");
		}
		if (this.currentPageNumber > 1) {
			this.#backButton.classList.remove("page-button__hidden");
		}
		if (this.pageListData.length === 1) {
			this.#backButton.classList.remove("page-button__hidden");
			this.#nextButton.classList.remove("page-button__hidden");
		}
		if (
			this.pageListData.length > 1 &&
			this.currentPageNumber > 1 &&
			this.currentPageNumber === this.pageListData.length
		) {
			this.#nextButton.classList.add("page-button__hidden");
		} else if (this.currentPageNumber !== this.pageListData.length) {
			this.#nextButton.classList.remove("page-button__hidden");
		}
		const joinedTemplateString = filledButton.join("");
		this.#pageNumberContainer.innerHTML = joinedTemplateString;
	}

	setPaginationCount(start, actualPage, all) {
		const firstLineElem = this.#paginatorResultElement.firstElementChild;
		firstLineElem.innerHTML = `Showing ${start}-${actualPage} <span class="second-line"> Of ${all} Results</span>`;
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
		return dataMatch.includes(data);
	}
	colorFilter(filter, data) {
		return filter === data;
	}
	categoryFilter(filter, data) {
		return filter === data;
	}
	salesStatusFilter(filter, data) {
		return filter === data;
	}
	sortedPagesSet(sortBy) {
		let sortedArr;
		switch (sortBy) {
			case "lowest_highest":
				sortedArr = this.#actualDataSet.toSorted((a, b) => a.price - b.price);
				break;
			case "highest_lowest":
				sortedArr = this.#actualDataSet.toSorted((a, b) => b.price - a.price);
				break;
			case "popularity":
				sortedArr = this.#actualDataSet.toSorted(
					(a, b) => b.popularity - a.popularity
				);
				break;
			case "rating":
				sortedArr = this.#actualDataSet.toSorted((a, b) => b.rating - a.rating);
				break;
			default:
				sortedArr = this.#defaultSortData;
		}
		this.#actualDataSet = sortedArr;
		this.mountData(sortedArr);
	}

	splitPagesData(data, number = 12) {
		if (data.length <= number) {
			this.pageListData = [data];
		} else if (data.length !== 0) {
			const newSplitedArray = [];
			while (data.length) {
				const splicy = data.splice(0, number);
				newSplitedArray.push(splicy);
			}
			this.pageListData = [...newSplitedArray];
		}
	}

	templateStringGenerator(data) {
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
}

document.addEventListener("DOMContentLoaded", () => {
	let filterQuery = {
		size: "",
		color: "",
		category: "",
		salesStatus: false,
	};

	const bestSetContainer = document.querySelector("#recommendation-container");
	mountRecommendationProduct(bestSetContainer, bestSet);
	const cartCounterElement = document.querySelector("#cartCounter");
	const myCart = new Cart(cartCounterElement);
	myCart.cartInit();
	const productCatalog = new Catalog(myCart);

	productCatalog.init("/assets/data.json");

	const sortBox = document.querySelector("#selectSort");
	sortBox.addEventListener("change", (e) => {
		productCatalog.sortedPagesSet(e.target.value);
	});

	const filterBtn = document.querySelector("#filterBtn");
	const filterDropdown = document.querySelector("#filterDropdown");
	const selectSize = filterDropdown.querySelector("#selectSize");
	const selectColor = filterDropdown.querySelector("#selectColor");
	const selectCategory = filterDropdown.querySelector("#selectCategory");
	const selectSales = filterDropdown.querySelector("#selectSales");

	const paginator = document.querySelector(".page-control__paginator");

	paginator.addEventListener(
		"click",
		(e) => {
			const currentTarget = e.currentTarget;
			if (e.target === currentTarget.children[0]) {
				if (productCatalog.currentPageNumber > 1) {
					productCatalog.mountPageSet(productCatalog.currentPageNumber - 1);
				}
			} else if (e.target === currentTarget.children[2]) {
				if (
					productCatalog.currentPageNumber < productCatalog.pageListData.length
				) {
					productCatalog.mountPageSet(productCatalog.currentPageNumber + 1);
				}
			} else if (e.target.closest("#pageNumberButtons")) {
				const pageNumber = e.target.textContent;
				if (productCatalog.currentPageNumber != pageNumber) {
					productCatalog.mountPageSet(+pageNumber);
				}
			}
		},
		false
	);
	const selectInputs = [selectSize, selectColor, selectCategory];
	selectInputs.forEach((elem) => {
		elem.addEventListener("change", (e) => {
			switch (e.target.id) {
				case "selectSize":
					filterQuery.size = e.target.value;
					break;
				case "selectColor":
					filterQuery.color = e.target.value;
					break;
				case "selectCategory":
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
			} else {
				productCatalog.filteredPagesSet();
			}
		});
	});

	let selectSalesChecked = selectSales.checked;
	selectSales.addEventListener("mousedown", () => {
		selectSalesChecked = selectSales.checked;
	});
	selectSales.addEventListener("click", () => {
		if (selectSalesChecked) {
			selectSales.checked = false;
		}
		filterQuery.salesStatus = selectSales.checked;
		productCatalog.filteredPagesSet(filterQuery);
	});

	const clearFilters = filterDropdown.querySelector("#clear_filters");
	const hideFilters = filterDropdown.querySelector("#hide_filters");
	[clearFilters, hideFilters].forEach((el) =>
		el.addEventListener("click", (e) => {
			if (e.target.id === "clear_filters") {
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
				productCatalog.filteredPagesSet();
			} else if (e.target.id === "hide_filters") {
				filterDropdown.classList.toggle("hide");
			}
		})
	);
	filterBtn.addEventListener("click", () => {
		filterDropdown.classList.toggle("hide");
	});
	const searchInput = document.querySelector("#searchInput");
	searchInput.addEventListener("change", (e) => {
		productCatalog.searchProduct(e.target.value);
	});
});

function mountRecommendationProduct(destination, dataSet) {
	const data = [...dataSet];
	if (dataSet) {
		let mixedArr = [];
		for (let i = 0; i < 5; i++) {
			const happyNumber = Math.floor(Math.random() * data.length);
			const splicy = data.splice(happyNumber, 1);
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
