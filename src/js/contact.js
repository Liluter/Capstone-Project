document.addEventListener("DOMContentLoaded", () => {
	const feedbackForm = document.querySelector("#feedbackForm");

	feedbackForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const emailInput = document.querySelector("#feedbackEmail");
		const emailMessage = document.querySelector("#feedbackMessagePopup");
		console.log("errorMess", emailMessage);
		let emailInvalid = true;
		const emailValue = emailInput.value.trim();

		if (!emailRegex.test(emailValue)) {
			emailInvalid = false;
		}
		if (emailInvalid) {
			emailMessage.firstElementChild.textContent = "Form submited succesfully.";
			emailMessage.classList.add("success");
			emailMessage.classList.toggle("hide");
			setTimeout(() => {
				emailMessage.classList.toggle("hide");
				emailMessage.classList.remove("failure");
				emailMessage.classList.remove("success");
				feedbackForm.reset();
			}, 3000);
		} else {
			emailMessage.firstElementChild.textContent =
				"Form invalid, please check email.";
			emailMessage.classList.add("failure");
			emailMessage.classList.toggle("hide");
			setTimeout(() => {
				emailMessage.classList.toggle("hide");
				emailMessage.classList.remove("failure");
				emailMessage.classList.remove("success");
			}, 3000);
			emailInput.focus();
		}
	});
});
