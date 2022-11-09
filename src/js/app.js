/* Swiper  on index.html*/
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

/* Swiper  on catalog.html*/
const productPage = new Swiper('.product__images', {
	// loop: true,

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
if (document.querySelector('.element') != null) {
	let options = { strings: ["", "когда прогулка в парке действительно в радость", "пожалуй, лучшие детские игровые проcтранства", "когда игры для детей в саду действительно увлекательны"], typeSpeed: 60, backSpeed: 40, loop: !0, backDelay: 800 },
	typed = new Typed(".element", options);
};


/* Input range */
function range(item) {
	let selector = item.nextElementSibling;
	let selectorValue = selector.querySelector('.selector__value');

	selectorValue.innerHTML = item.value;
	if (item.closest('#body_2')) {
		selector.style.left = (item.value / 300000) + '%';
	} else if (item.closest('#body_3')) {
		if (+item.value === 1) {
			selector.style.left = `calc(${(100 / 11 * (+item.value - 1))}% + 12.5px)`;
		} else if (+item.value === 12) {
			selector.style.left = `calc(${(100 / 11 * (+item.value - 1))}% - 8px)`;
		} else {
			selector.style.left = (100 / 11 * (+item.value - 1)) + '%';
		}
	}
}


/* maskedinput plugin */
$.fn.setCursorPosition = function (pos) {
	if ($(this).get(0).setSelectionRange) {
		$(this).get(0).setSelectionRange(pos, pos);
	} else if ($(this).get(0).createTextRange) {
		var range = $(this).get(0).createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
};

/* validation */

$("#formTel").click(function () {
	$(this).setCursorPosition(3);
}).mask("+7 999 999 99 99");
$("#formTel").mask("+7 999 999 99 99");

$("#connectionCallTel").click(function () {
	$(this).setCursorPosition(3);
}).mask("+7 999 999 99 99");
$("#formTel").mask("+7 999 999 99 99");



/* open buttons */

let buttonOpen = document.querySelectorAll('.btn-open');

buttonOpen.forEach(el => {
	el.addEventListener('click', () =>  {
		el.previousElementSibling.classList.toggle('hidden');
	})
})


async function f() {
	let DB = await(await fetch('../files/catalog.json')).json();
	
	console.log(DB);

	function catalogHeaderLink(link, name) {
		return `<a href="${link}.html" class="header__second-link">${name}</a>`
	}
	function catalogFooterLink(link, name) {
		return `<a href="${link}.html" class="footer-links__link">${name}</a>`
	}
	function catalogPage(link, image, title, subtitle) {
		return `
		<a href="catalog/${link}.html" class="catalog__item item">
		<div class="item__img">
			<img src="${image}" alt="">
		</div>
		<div class="item__text">
			<h4 class="item__title">${title} (${link})</h4>
			<p class="item__description">${subtitle}</p>
		</div>
		</a>
		`
	}
	const headercatalog = document.getElementById('headerCatalog');
	const footerCatalog = document.getElementById('footerCatalog');
	for (const key in DB) {
		headercatalog.innerHTML += catalogHeaderLink(`/catalog/${key}`, DB[`${key}`][0].categoryName);		
		footerCatalog.innerHTML += catalogFooterLink(`/catalog/${key}`, DB[`${key}`][0].categoryName);
	
		// catalog
		if (document.getElementById('catalogItem') !== null) {
			catalog = document.getElementById('catalogItem');
			catalog.innerHTML += catalogPage(key, DB[`${key}`][0].categoryPictute, DB[`${key}`][0].categoryName, DB[`${key}`][0].categorySubtitle);
		}
	}
	

};

f();

