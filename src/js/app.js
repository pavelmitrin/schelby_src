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

/* buy product */
// const buyPage = document.getElementById('buy');
// const cartProducts = document.querySelector('.cart__products');
// let product = cartProducts.getElementsByClassName('cart__product');
// const buyButton = document.querySelector('.desc__price.popup-link');
// buyButton.addEventListener('click', () => {
// if (product.length !== 0) {
// 		for (let index = 0; index < product.length; index++) {
// 			const element = product[index];
// 			let minus = product[index].querySelector('.amountMinus');
// 			let plus = product[index].querySelector('.amountPlus');
// 			
			
// 		}
// 	}
// })
// if (product.length !== 0 ) {
// }

async function f() {
	let DB = await(await fetch('../files/catalog.json')).json();
	// console.log(DB);

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

		//	catalog product popup
		const popupLinks = document.querySelectorAll('.popup-link');
		if (popupLinks.length > 0) {
			popupLinks.forEach(el => {
				el.addEventListener('click', (e) => {
					if (el.querySelector('.product__article') !== null) {
						let art = el.querySelector('.product__article').textContent.replace(/Арт. /, '');
						
						for (let index = 1; index < DB[`${key}`].length; index++) {
							const element = DB[`${key}`][index];
							
							if (element.article == art) {
								const popup = document.getElementById('product');
								let popupSlider = popup.querySelector('.swiper-wrapper');
								let popupTitle = popup.querySelector('.desc__title');
								let popupArticle = popup.querySelector('.desc__article');
								let popupOptions = popup.querySelector('.desc__options ul');
								let popupDescriptions = popup.querySelector('.desc__descriptions');

								
								function addSlide(pictures) {
									let slides = '';
									pictures.forEach(el => {
										slides += `
											<div class="swiper-slide">
												<img src="${el}" alt="">
											</div>
										`;
									})
									return slides;
								}
								popupSlider.innerHTML = addSlide(element.pictures);
								
								popupTitle.textContent = element.name;
								popupArticle.textContent = `Арт. ${element.article}`;

								function addOption(options) {
									let list = '';
									options.forEach(el => {
										list += `<li>${el}</li>`
										
									})
									return list;
								}
								popupOptions.innerHTML = addOption(element.options);

								function addDescription(descriptions) {
									let desc = '';
									descriptions.forEach(el => {
										desc += `<p>${el}</p>`;
									})
									return desc;
								}
								popupDescriptions.innerHTML = addDescription(element.description);
							}
						}
							
						
					}
					e.preventDefault();
				})
			})
		}

		// buy list 
		const buyButton = document.querySelector('.desc__price.popup-link');
		const buyPage = document.getElementById('buy');
		const cartProducts = document.querySelector('.cart__products');
		function buyProduct(el) {
			return `
			<div class="cart__product">
				<div class="cart__preview">
					<img src="${el.elem.pictures[0]}" alt="">
				</div>
				<div class="cart__inform">
					<div class="cart__data">
						<h4 class="cart__name">${el.elem.name}</h4>
						<h4 class="cart__article">Арт. ${el.elem.article}</h4>
					</div>

					<div class="cart__amount">
					<button type="button" class="amountMinus"><img src="../img/catalog/arrows_circle_minus.svg" alt=""></button>
					<input class="amount__Score" value="${el.count}" readonly>
					<button type="button" class="amountPlus"><img src="../img/catalog/arrows_circle_plus.svg" alt=""></button>
					</div>

					<button type="button" class="cart__remove"><img src="../img/catalog/arrows_circle_remove.svg" alt=""></button>
					
				</div>
			</div>
			`
		}
		function AddCatalogBuyProducts(elem) {
			this.elem = elem;
			this.count = 1;
		}
		let buyProductsCatalog = [];
		function updateBuyList() {
			let lists = '';
			if (buyProductsCatalog.length !== 0) {
				buyProductsCatalog.forEach(el => {
					lists += buyProduct(el);
					cartProducts.innerHTML  = lists;
				})
			} else {
				cartProducts.innerHTML = '';
			}
			
		}
		function addBuyProduct(ele) {
			if (buyProductsCatalog.length !== 0) {
				buyProductsCatalog.forEach(el => {
					if (el.elem == ele) {
						el.count++;
						
					} else {
						buyProductsCatalog.push(new AddCatalogBuyProducts(ele));
					}
				})
			} else {
				buyProductsCatalog.push(new AddCatalogBuyProducts(ele));
			}
		}
		
		function removeProductFromBuy(article) {
			buyProductsCatalog.forEach((el, index) => {
				if (article == el.elem.article) {
									
					if (buyProductsCatalog.length == 1) {
						buyProductsCatalog = [];
						
					} else {
						buyProductsCatalog.splice(index, 1);
					}
				
					
					
				}
			})
		}



		if (buyPage !== null && buyButton.getAttribute('href') == '#buy') {
			buyButton.addEventListener('click', () => {
				let art = buyButton.previousElementSibling.textContent.replace(/Арт. /, '');
				
				for (let index = 1; index < DB[`${key}`].length; index++) {
					const element = DB[`${key}`][index];
					if (element.article == art) {
						addBuyProduct(element);
						updateBuyList();

						if (cartProducts.getElementsByClassName('cart__product').length !== 0) {
							let buyProducts = cartProducts.getElementsByClassName('cart__product');
							for (let index = 0; index < buyProducts.length; index++) {
								const element = buyProducts[index];
								let amountMinus = element.querySelector('.amountMinus');
								let amountPlus = element.querySelector('.amountPlus');
								let amount = element.querySelector('.amount__Score');
								let cartRemove = element.querySelector('.cart__remove');
								amountMinus.addEventListener('click', (e) => {
									amount.value--;	
									
									e.preventDefault();
								})
								amountPlus.addEventListener('click', (e) => {
									amount.value++;

									e.preventDefault();
								})
								cartRemove.addEventListener('click', (e) => {
									let articleProduct = element.querySelector('.cart__article').textContent.replace(/Арт. /, '');
									removeProductFromBuy(articleProduct);
									// setTimeout(() => {
									// 	
									// }, 200);
									
									updateBuyList();

								})
							}
						}
					}
				}
			})
		}
		
		// if (cartProducts.getElementsByClassName('cart__product').length !== 0) {
		// 	let buyProducts = cartProducts.getElementsByClassName('cart__product');
		// 	
		// }
	}

};

f();

