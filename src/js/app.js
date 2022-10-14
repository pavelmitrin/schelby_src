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



jQuery(function ($) {
	$("#main-modal__body-tel").mask("+7 (999) 999-99-99"), { autoclear: false };
});