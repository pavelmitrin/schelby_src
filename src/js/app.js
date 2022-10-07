/* Swiper */
const swiper = new Swiper('.swiper', {
	loop: true,
	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	speed: 400,
	effect: "fade",
	fadeEffect: {
		crossFade: true,
	},
	slideToClickedSlide: false,
	allowTouchMove: false,
});

/* Typed */
let options = { strings: ["", "когда прогулка в парке действительно в радость", "пожалуй, лучшие детские игровые проcтранства", "когда игры для детей в саду действительно увлекательны"], typeSpeed: 60, backSpeed: 40, loop: !0, backDelay: 800 },
	typed = new Typed(".element", options);

/* Input range */

/* function rangeSlider(value) {
	let min = +document.querySelector('.scrollmar__min').textContent;
	let max = +document.querySelector('.scrollbar__max').textContent;
	document.querySelector(".scrollbar__value").value = ((max - min) * value) / 100 + min;
	if (value < 50) {
		document.querySelector('.scrollbar__value').style.left = `calc(${value}% - 0px)`;
	} else {
		document.querySelector('.scrollbar__value').style.left = `calc(${value}% - 0px)`;
	}
} */

function rangeSlider(slider) {
	let popup = slider.closest('.modal__range'),
		scrollbarSlider = popup.querySelector('.scrollbar__slider'),
		scrollbarValue = popup.querySelector('.scrollbar__value'),
		min = +popup.querySelector('.scrollmar__min').textContent,
		max = +popup.querySelector('.scrollbar__max').textContent,
		rangeWidth = scrollbarSlider.offsetWidth;

	if (popup.classList.contains('modal__body_2')) {
		scrollbarValue.value = ((max - min) * scrollbarSlider.value) / 100 + min;
		/* popup.querySelector('.scrollbar__value').style.left = `calc(${(scrollbarSlider.value - 1) * rangeWidth / 100}px)`; */
		popup.querySelector('.scrollbar__value').style.left = `calc(${(scrollbarSlider.value - 1)}% - 25px)`;
	} else {
		scrollbarValue.value = scrollbarSlider.value;
		popup.querySelector('.scrollbar__value').style.left = `${(scrollbarSlider.value - 1) * 8.333}%`;
	}
}


function changeModalBody() {
	let modalBack = document.querySelector('.modal__prev'),
		modalNext = document.querySelector('.modal__next'),
		modalStep = document.querySelector('.modal__step'),
		modalProgress = document.querySelector('.modal__progressbar-progress'),
		modalBodes = document.querySelectorAll('.modal__body');

	modalNext.addEventListener('click', () => {
		modalStep.textContent += 1;
	})
}
changeModalBody();