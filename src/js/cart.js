export class Cart {
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
			console.error(error);
		}
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
					item.quantity = item.quantity + 1;
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
}
