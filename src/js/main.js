const travelContainer = document.querySelector("section.travel-suitcases ");
const flexContainer = travelContainer.querySelector("div.flex-container");
const mySliderHandler = createSliderHandler(flexContainer);

flexContainer.addEventListener("click", mySliderHandler);

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
						sliderContainer.replaceChildren(...childElements.slice(0, 5));
						sliderContainer.prepend(cloneToMove);
					}
					pending = false;
				}, 500);
			}
		}
	};
}
