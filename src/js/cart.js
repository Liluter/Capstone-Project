export class Cart {
	#cartName = "BestShopCart";
	#productContainer;
	#subTotalElement;
	#discountElement;
	#shippingElement;
	#totalElement;
	#messagePopup;
	constructor(cartElement, cartContainer) {
		this.cartElement = cartElement;
		this.#productContainer = cartContainer;
		this.#subTotalElement = document.querySelector("#sub-total");
		this.#discountElement = document.querySelector("#discount");
		this.#shippingElement = document.querySelector("#shipping");
		this.#totalElement = document.querySelector("#total");
		this.#messagePopup = document.querySelector("#popup-cart");
	}
	cartInit() {
		const existingCart = window.localStorage.getItem(this.#cartName);
		if (existingCart) {
			this.updateCouterElement();
			const existingCartData = this.parseData();
			const onCartPage = window.location.pathname.endsWith("/cart.html");
			if (onCartPage) {
				this.mountData(existingCartData);
			}
		} else {
			this.writeData();
			this.updateCouterElement();
		}
	}
	mountData(data) {
		if (data) {
			const stringedData = data.map((elem) => {
				return this.templateStringGenerator(elem);
			});
			const tabelhead = `<div class="table__head">
			<div class="table__col--iamge">IMAGE</div>
			<div class="table__col--product-name">PRODUCT NAME</div>
			<div class="table__col--price">PRICE</div>
			<div class="table__col--quantity">QUANTITY</div>
			<div class="table__col--total">TOTAL</div>
			<div class="table__col--delete">DELETE</div>
		</div>`;

			const concatedString = [tabelhead, stringedData.join("")].join("");
			this.#productContainer.innerHTML = concatedString;
		}
		this.updateSummary(data);
	}
	itemCaunter() {
		const data = this.parseData();
		if (data.length) {
			const redData = data.reduce((acc, curr) => acc + curr.quantity, 0);
			return redData;
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
			console.error("Parsing data", error);
		}
	}
	editData(dataID) {
		const localData = this.parseData();
		const productDataElement = this.getProductById(localData, dataID);
		return productDataElement;
	}
	modifyData(dataID, operator) {
		const localDataCopy = this.parseData();
		let newCopy;
		switch (operator) {
			case "ADD":
				newCopy = localDataCopy.map((element) => {
					if (element.id === dataID) {
						const modifed = {...element, quantity: element.quantity + 1};
						return modifed;
					} else {
						return element;
					}
				});
				break;
			case "SUBSTRACT":
				newCopy = localDataCopy.map((element) => {
					if (element.id === dataID && element.quantity > 1) {
						const modifed = {...element, quantity: element.quantity - 1};
						return modifed;
					} else if (element.id === dataID && element.quantity === 1) {
						return null;
					} else {
						return element;
					}
				});
				break;
			case "DELETE":
				newCopy = localDataCopy.map((element) => {
					if (element.id === dataID) {
						return null;
					} else {
						return element;
					}
				});
				break;
		}
		const cleared = newCopy.filter(Boolean);
		this.patchData(cleared);
	}
	patchData(data) {
		let result;
		if (data && data.length !== 0) {
			result = JSON.stringify(data);
		} else {
			const emptyArr = [];
			result = JSON.stringify(emptyArr);
		}
		try {
			window.localStorage.setItem(this.#cartName, result);
		} catch (error) {
			console.error("Error Parsing patch data", error);
		}
		const dataToMount = this.parseData();
		this.updateCouterElement();
		this.mountData(dataToMount);
	}
	writeData(data, pcs = 1) {
		const localData = this.parseData();
		let result;
		if (localData !== null) {
			let merged = false;
			const filteredCart = localData.map((item) => {
				if (
					item.name === data.name &&
					item.size === data.size &&
					item.color === data.color &&
					item.category === data.category
				) {
					item.quantity = item.quantity + pcs;
					merged = true;
					return item;
				}
				return item;
			});
			if (merged) {
				result = JSON.stringify(filteredCart);
			} else {
				data.quantity = pcs;
				const newDataArr = [...localData, data];
				result = JSON.stringify(newDataArr);
			}
		} else {
			const emptyArr = [];
			result = JSON.stringify(emptyArr);
		}
		window.localStorage.setItem(this.#cartName, result);
		this.updateCouterElement();
	}
	updateSummary(data) {
		const checkoutBtn = document.querySelector("#checkout-btn");
		const subTotal = data.reduce(
			(acc, curr) => acc + curr.price * curr.quantity,
			0
		);
		const discount = subTotal > 3000 ? subTotal * 0.1 : 0;
		const shipping = subTotal > 0 ? 30 : 0;
		const total = subTotal - discount + shipping;
		this.#subTotalElement.textContent = `${subTotal}`;
		this.#discountElement.textContent = `${discount}`;
		if (discount > 0) {
			this.#discountElement.parentElement.classList.remove("summary__hide");
		} else {
			this.#discountElement.parentElement.classList.add("summary__hide");
		}
		this.#shippingElement.textContent = `${shipping}`;
		this.#totalElement.textContent = `${total}`;

		if (total === 0) {
			checkoutBtn.disabled = true;
		} else {
			checkoutBtn.disabled = false;
		}
	}

	templateStringGenerator(data) {
		const productItem = `<div id="${data.id}" class="table__row">
		<div class="table__col--iamge">
			<picture>
				<source
					src="/${data.imageUrl}"
				/>
				<img
					src="/${data.imageUrl}"
					alt="product image"
					width="297"
					height="400"
					class="table__image block"
				/>
			</picture>
		</div>
		<div class="table__col--product-name">${data.name}</div>
		<div class="table__col--price">$${data.price}</div>
		<div class="table__col--quantity">
		<div class="table__input-pcs qty-wrapper">
			<button class="table__input-item pointer decrement">-</button>
				<input
					type="text"
					name="pieces"	
					class="table__input-number qty-number"
					value="${data.quantity}"
					aria-label="quantity"
					inputmode="numeric"
					pattern="[0-9]*"
					disabled
				/>
			<button class="table__input-item pointer increment">+</button>
		</div>
		</div>
		<div class="table__col--total">$${data.price * data.quantity}</div>
		<button class="table__col--delete">
			<picture>
				<source src="/assets/images/icons/trash_icon.webp" />
				<img
					src="/assets/images/icons/trash_icon.png"
					alt="product image"
					width="18"
					height="20"
					class="table__delete block"
				/>
			</picture>
		</button>
	</div>`;
		return productItem;
	}
	getProductById(data, productId) {
		const filteredItem = data.filter((elem) => elem.id === productId);
		return filteredItem[0];
	}
	showMessage(message) {
		console.log("Show messagemessage", this.#messagePopup);

		this.#messagePopup.firstElementChild.textContent = message;
		this.#messagePopup.classList.remove("hide");
		setTimeout(() => {
			this.#messagePopup.classList.add("hide");
		}, 2500);
	}
}

const onCartPage = window.location.pathname.endsWith("/cart.html");

if (onCartPage) {
	document.addEventListener("DOMContentLoaded", () => {
		const cartCounterElement = document.querySelector("#cartCounter");
		const tableContainer = document.querySelector("#table-container");
		const actionButtonsCont = document.querySelector(".table-footer");
		const cart = new Cart(cartCounterElement, tableContainer);
		cart.cartInit();

		actionButtonsCont.addEventListener("click", (e) => {
			switch (e.target.id) {
				case "continue-btn":
					window.location = "/html/catalog.html";
					break;
				case "clear-btn":
					cart.patchData();
					cart.showMessage(
						"Your Cart is empty. Use the catalog to add new items."
					);
					break;
				case "checkout-btn":
					cart.patchData();
					cart.showMessage("Thank you for your purchase.");
					break;
			}
		});

		tableContainer.addEventListener("click", (e) => {
			const elemntId = e.target.closest(".table__row").id;
			const increment = e.target.closest(".increment");
			const decrement = e.target.closest(".decrement");
			const deleteAction = e.target.closest(".table__delete");
			if (increment) {
				cart.modifyData(elemntId, "ADD");
			}
			if (decrement) {
				cart.modifyData(elemntId, "SUBSTRACT");
			}
			if (deleteAction) {
				cart.modifyData(elemntId, "DELETE");
			}
		});
	});
}
