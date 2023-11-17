export const burger = document.querySelector(".burger");


burger.addEventListener("click", function () {
	burger.classList.toggle("burger_active");
	nav.classList.toggle("nav_active");
	if (burger.classList.contains("burger_active")) {
			header.classList.add("header_active")
			nav.style.paddingTop = header.offsetHeight + "px";
			disableScroll();
	} else {
			nav.style.paddingTop = "";
			setTimeout(() => {
			}, 300);
			header.classList.remove("header_active");
			enableScroll();
	}
});