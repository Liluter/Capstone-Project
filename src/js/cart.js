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
