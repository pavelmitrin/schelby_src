// TODO: article
// TODO: pictures
// TODO: category information

/* var fs = require('fs'); */
import { info } from 'console';
import * as fs from 'fs';
/* var path = require('path'); */
import * as path from 'path';

var getFiles = function (dir, files_) {

	files_ = files_ || [];
	var files = fs.readdirSync(dir);
	for (var i in files) {
		var name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files_);
		} else {
			files_.push(name);
		}
	}
	return files_;
};


let PathFromStart = getFiles('../img/catalog'),
	allPath = [];

	PathFromStart.forEach(el => {
	el = el.replace('../img/catalog/', '' );
	allPath.push(el);
})

let categoryName = [];
let productsArticle = [];
let done = {};
function CategoryOptions(name, subtitle, pictute) {
	this.categoryName = '',
	this.categorySubtitle = '',
	this.categoryPictute = '',
	this.categoryPageTitle = '',
	this.categoryPageInfo = []
}
function FullProduct(article) {
	this.name = '';
	this.article = article;
	this.pictures = [];
	this.options = [];
	this.description = [];
	this.status = '';
}


allPath.forEach(el => {
	if (/.?txt$/.test(el) !== true) {;
	/* categoryName */	
		let from = 0,
				to = el.search(/\//);
		if (el.substring(from, to) !== '') {
			categoryName.push(el.substring(from, to));
		}

	/* articles */
		from = el.substring(from, to);
		to = /[A-Z]+?\d{4}/;
		if (el.match(to) !== null) {
			productsArticle.push(el.match(to)[0]);
		}
	}
})

categoryName = categoryName.filter((value, index, self) => self.indexOf(value) === index);
productsArticle = productsArticle.filter((value, index, self) => self.indexOf(value) === index);

categoryName.forEach(el => {
	done[`${el}`] = [new CategoryOptions()];
})

productsArticle.forEach((elem, index) => {
	categoryName.forEach(el => {
		if (elem.search(el) != -1) {
			done[`${el}`].push(new FullProduct(elem));
		}
	})
	
})
let catInfo = [];
/* array categoryInformation &&  pictures */
categoryName.forEach(el => {
	done[`${el}`].forEach(category => {
		PathFromStart.forEach(e => {
			let rer = new RegExp(`.+${el}/info.txt`, 'g');
			if (e.match(rer) !== null) {
				catInfo.push(e.match(rer)[0]);
			}

			if (e.search(category.article) != -1) {
				if (/.?info.txt/.test(e) !== true && category.article != undefined && e.search(/.+\.webp/) != -1) {
					category.pictures.push(e);
				}
				
			}
			let reg = new RegExp(`\.\+${category.article}\/info.txt\$`);
			if (reg.test(e) !== false) {
				let data = fs.readFileSync(`${e}`, 'utf8')
				// console.log(data);
				let name = data.match(/^name:.+,/g);
				name = name[0].replace('name:', '');
				name = name.replace(/,/g, '');
				category.name = name;
				// console.log(name);


				let option = data.match(/^options: \[.+\]/gm);
				if (option != null) {
					option = option[0].replace('options: [', '');
					option = option.replace(']', '');
					option = option.match(/'.+?'/g);
					option.forEach(ele => {
						ele = ele.replace(/'/g, '')
						category.options.push(ele);
					})
				}


				let description = data.match(/^descriptions: \[.+\]/gm);
				if (description !== null) {
					description = description[0].replace('descriptions: [', '');
					description = description.replace(']', '')
					description = description.match(/'.+?'/gm);
					description.forEach(ele => {
						ele = ele.replace(/'/g, ''),
						category.description.push(ele); 
					})
				}

				let statusPage = data.match(/^status: true|false/gm);
				if (statusPage) {					
					statusPage = statusPage[0].replace(/status: /, '');
					category.status = statusPage;
				}
				
				
				
			}
		})
	})
})
catInfo = catInfo.filter((value, index, self) => self.indexOf(value) === index);
/* category info */
categoryName.forEach(el => {
	catInfo.forEach(elem => {
		if (elem.search(el) !== -1) {
			let categInfo = fs.readFileSync(`${elem}`, 'utf8',);
			let name = categInfo.match(/.+,/g);
			if (name != null) {
				name = name[0].replace(/categoryName: /, '');
				name = name.replace(/,/g, '');
				done[`${el}`][0].categoryName = name;
			}
			

			let subtitle = categInfo.match(/^categorySubtitle:.+/gm);
			if (subtitle != null) {
				subtitle = subtitle[0].replace(/categorySubtitle:/, '');
				done[`${el}`][0].categorySubtitle = subtitle;
			}
			
			
			let pageTitle = categInfo.match(/^categoryPageTitle:.+/gm)
			if (pageTitle !== null) {
				pageTitle = pageTitle[0].replace(/categoryPageTitle:/, '');
				pageTitle = pageTitle.replace(/,/, '');
				done[`${el}`][0].categoryPageTitle = pageTitle;
			}
			


			let pageInfo = categInfo.match(/^categoryPageInfo: \[.+\]/gm);
			if (pageInfo != null) {
				pageInfo = pageInfo[0].replace(/categoryPageInfo: \[/, '');
				pageInfo = pageInfo.replace(']', '');
				pageInfo = pageInfo.match(/'.+?'/gm);
				pageInfo.forEach(ele => {
						ele = ele.replace(/'/g, ''),
						done[`${el}`][0].categoryPageInfo.push(ele);
					})
			}

			
			
		}
	})
	PathFromStart.forEach(elem => {
		let reg = new RegExp(`\.\?${el}\/cover\.webp`); // надо будет заменить на webp
		if (reg.test(elem) === true) {
			done[`${el}`][0].categoryPictute = elem;
		};
	})
});

// create Pages
function catalogPageSubtitle(key, done) {
	function createEl(el) {
		return `<p>${el}</p>`
	}
	let list = ``;
	done[`${key}`][0].categoryPageInfo.forEach(el => {
		list += createEl(el);
	})
	return list;
}
function catalogItem(key, done) {
	let ae = ``;
	for (let index = 1; index < done[`${key}`].length; index++) {
		ae += `<div class="products__item">
				<a href="#product" class="product popup-link">
				<div class="product__img">
					<img src="../img/catalog/${key}/${done[`${key}`][index].article}/1.webp" alt="">
				</div>
				<div class="product__text">
					<h4 class="product_title">${done[`${key}`][index].name}</h4>
					<p class="product__article">Арт. ${done[`${key}`][index].article}</p>
				</div>
				<button type="button">Подробнее</button>
			</a>
			<a href="#" target="_blank" class="products__item-dwg">Скачать DWG</a>
		</div>`;
	}
	return ae;
}
function catalogCategory (key, done) {
	return `<!DOCTYPE html>
	<html lang="ru">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="shortcut icon" href="../img/favicon.ico" type="image/x-icon">
		<link rel="stylesheet" href="../styles/fonts.min.css">
		<script async src="../js/jquery.min.js"></script>
		<!-- libs -->
		<link rel="stylesheet" href="../styles/bootstrap-grid.min.css">
		<link rel="stylesheet" href="../styles/swiper-bundle.min.css">
		<link rel="stylesheet" href="../styles/products.min.css">
		<!-- Media -->
		<title>${done[key][0].categoryName}</title>
	</head>
	
	<body>
		<div class="wrapper">
			<header class="header">
		<div class="container-fluid">
			<div class="header__body">
	
				<div class="header__burger">
					<span></span>
				</div>
				<nav class="header__menu">
					<div class="header__logo">
						<a href="../index.html" class="header__link"><img src="../img/logo.webp" alt=""></a>
					</div>
					<div class="header__list">
						<div class="header__item">
							<h3 class="header__link">Компания</h3>
							<div class="header__second-list">
								<a href="../company.html" class="header__second-link">О компании</a>
							</div>
						</div>
						<div class="header__item">
							<h3 class="header__link">Каталог</h3>
							<div class="header__second-list" id="headerCatalog">
								<a href="../catalog.html" class="header__second-link">ВЕСЬ КАТАЛОГ</a>
								<a href="../equipment.html" class="header__second-link">ОБОРУДОВАНИЕ В НАЛИЧИИ</a>
								
							</div>
						</div>
						
						<div class="header__item">
							<a href="../partners.html">
								<h3 class="header__link header__second-link">Для проектировщиков и госучреждений</h3>
							</a>
						</div>
						<div class="header__item">
							<h3 class="header__link">Обслуживание</h3>
							<div class="header__second-list">
								<a href="../delivery.html" class="header__second-link">Доставка</a>
								<a href="../mounting.html" class="header__second-link">Монтаж</a>
								/* <a href="#" class="header__second-link">Материалы</a> */
								<a href="../safety.html" class="header__second-link">Безопасность</a>
							</div>
						</div>
						<div class="header__item">
							<h3 class="header__link">Контакты</h3>
							<div class="header__second-list">
								<a href="tel:" class="header__second-link" target="_blank">+7 (999) 999-99-99 </a>
								<a href="mailto:" class="header__second-link"
									target="_blank">hello@shelby-ltd.ru</a>
								<a href="#" class="header__second-link">Заказать звонок</a>
								<a href="https://wa.me/" class="header__second-link" target="_blank">WhatsApp</a>
								<a href="https://t.me/" class="header__second-link" target="_blank">Telegram</a>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</header>
			<main class="main">
				<section class="preview">
					<div class="container">
						<h2 class="preview__title">Каталог оборудования для детских игровых и спортивных площадок</h2>
					</div>
					<div class="preview__bg"><img src="../img/1.webp" alt=""></div>
				</section>
	
				<section class="breadcumps">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<nav aria-label="breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="../index.html">Главная</a></li>
							<li class="breadcrumb-item"><a href="../catalog.html">Каталог</a></li>
							<li class="breadcrumb-item active" aria-current="page">${done[key][0].categoryName}</li>
						</ol>
					</nav>
				</div>
			</div>
		</div>
	</section>
	
				<section class="products">
					<div class="container">
						<div class="produsts__text">
							<h2 class="products__title">${done[key][0].categoryPageTitle}</h2>
							<h3 class="products__subtitle">
								${catalogPageSubtitle(key, done)}
							</h3>
						</div>
						<div class="products__prompt">
							<p>Под заказ мы можем изготовить комплектующие для детских игровых комплексов в любых цветах. Предложим различные цветовые решения для реализации идей ваших детских площадок. И да, что немаловажно, в отличие от конкурентов, мы подберем любой цвет для детского игрового оборудования в зависимости от ваших пожеланий абсолютно бесплатно!</p>
						</div>
						<div class="products__items">

							${catalogItem(key, done)}
							
	
	
						</div>
					</div>
				</section>
	
		
				<section class="calculation">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h2 class="title">Узнайте, какое оборудование подойдет для вашей площадки и решит поставленную
						задачу</h2>
				</div>
			</div>
			<div class="row calculation__content">
				<div class="col-12 col-md-5">
					<p class="calculation__text">Ответьте на несколько простых вопросов, и мы рассчитаем стоимость
						вашего детского игрового оборудования!</p>
					<div class="buttons">
						<a href="#calculation" class=" btn btn_1 popup-link">Онлайн расчёт</a>
						<a href="../catalog.html" class="btn btn_2">Смотреть каталог</a>
					</div>
				</div>
				<div class="col-12 col-md-7">
					<img src="../img/22_2.webp" alt="">
				</div>
			</div>
		</div>
	</section>
	
	<section class="scheme">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h2 class="title">Схема работы</h2>
				</div>
			</div>
			<div class="scheme__steps steps">
				<div class="step">
					<div class="step__number">
						<span>1</span>
						<p></p>
					</div>
					<div class="step__content">
						<h4 class="scheme__title">Заявка на консультацию</h4>
						<p class="scheme__text">Оставьте заявку в форме обратной связи или свяжитесь с нами по номеру
							телефона +7 (499) 390-50-07</p>
					</div>
				</div>
				<div class="step">
					<div class="step__number">
						<span>2</span>
						<p></p>
					</div>
					<div class="step__content">
						<h4 class="scheme__title">Осмотр объекта и КП</h4>
						<p class="scheme__text">Наши специалисты проведут осмотр объекта и найдут подходящие места для
							установки оборудования</p>
					</div>
				</div>
				<div class="step">
					<div class="step__number">
						<span>3</span>
						<p></p>
					</div>
					<div class="step__content">
						<h4 class="scheme__title">Согласование</h4>
						<p class="scheme__text">Составим КП, согласуем схему расположения оборудования, обсудим все
							детали
							для подписания договора</p>
					</div>
				</div>
				<div class="step">
					<div class="step__number">
						<span>4</span>
						<p></p>
					</div>
					<div class="step__content">
						<h4 class="scheme__title">Установка и монтаж</h4>
						<p class="scheme__text">Качественно и быстро произведем установку всего оборудования, расскажем,
							как его использовать</p>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<section class="feedback">
		<img src="../img/1.webp" alt="" class="section__bg">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h2 class="title">Помогаем создавать проекты мечты.</h2>
					<h2 class="title">Напишите нам.</h2>
				</div>
			</div>
			<div class="row">
				<div class="col-12 col-sm-10 col-md-8">
					<p class="feedback__subtitle">По вашим пожеланиям мы можем изменить конструкцию площадки,
						добавить элементы и сделать уникальный проект на ваш вкус.
						Просто сообщите нам об этом.</p>
				</div>
			</div>
			<div class="row">
				<div class="col-12 col-sm-10 col-md-8 col-lg-6">
					<form class="feedback__form" actioin='#' method="post">
						<div>
							<input type="email" placeholder="hello@shelby-ltd.ru">
						</div>
						<div><input type="tel" placeholder="+7 000 000 00 00"></div>
						<div><input type="text" placeholder="Иван Смирнов"></div>
						<div><input type="text" placeholder="ООО Шелби Плэй"></div>
						<button type="submit">Отправить</button>
					</form>
					<p class="feedback__info">Нажимая «отправить», Вы соглашаетесь с политикой конфиденциальности сайта
						Все поля обязательны для заполнения</p>
				</div class="col-12 col-sm-8">
			</div>
		</div>
	</section>
			</main>
			<footer class="footer">
		<section class="contacts">
			<div class="container">
				<div class="row">
					<div class="col-12 col-lg-6">
						<a href="tel:+" class="tel"></a>
						<a href="mailto:" class="mail"></a>
						<p>Работаем с понедельника по пятницу с 09.00 до 18.00</p>
					</div>
				</div>
			</div>
		</section>
		<section class="footer-links">
			<div class="container">
				<div class="row">
					<div class="col-12 col-sm-6 col-lg-3 footer-links__row">
						<h4 class="footer-links__title">Компания</h4>
						<a href="#" class="footer-links__link">О компании</a>
						<a href="#" class="footer-links__link">Команда</a>
						<a href="#" class="footer-links__link">Новости</a>
						<a href="#" class="footer-links__link">Проекты</a>
						<a href="#" class="footer-links__link">Отзывы</a>
						<a href="#" class="footer-links__link">Доставка</a>
						<a href="#" class="footer-links__link">Монтаж</a>
						<a href="#" class="footer-links__link">Материалы и цвета</a>
						<a href="#" class="footer-links__link">Контакты</a>
						<a href="#" class="footer-links__link">Карта сайта</a>
					</div>
					<div class="col-12 col-sm-6 col-lg-3 footer-links__row" id="footerCatalog">
						<h4 class="footer-links__title">Оборудование</h4>
						<a href="../equipment.html" class="footer-links__link footer-links__link-active">Оборудование в наличии</a>
					</div>
					
					<div class="col-12 col-sm-6 col-lg-3 footer-links__row">
						<h4 class="footer-links__title">Подписаться на рассылку</h4>
						<form action="#" method="post" class="footer-links__sending sending">
							<input type="email" placeholder="Почта">
							<button type="submit"><img src="../img/arrow.svg" alt=""></button>
						</form>
						<p class="footer-links__sending-about">В рассылке мы отправляем только полезные статьи и материалы,
							новости о новых линейках, разработках
							комплектующих для изготовления детских игровых комплексов.</p>
						<div class="footer-links__media footer__media">
							<div><a href="#"><img src="../img/footer-media/pinterest.svg" alt="" class="footer__media-icons"></a>
							</div>
							<div><a href="#"><img src="../img//footer-media/telegram.svg" alt="" class="footer__media-icons"></a>
							</div>
							<div><a href="#"><img src="../img/footer-media/whatsapp.svg" alt="" class="footer__media-icons"></a>
							</div>
							<div><a href="#"><img src="../img/footer-media/zen.svg" alt="" class="footer__media-icons"></a></div>
						</div>
					</div>
				</div>
				<div class="row footer__copy">
					<div class="col-12">
						<p>&copy; 2022 ООО «Шелби Плей»</p>
						<p>ИНН 5003143285</p>
						<p>ОГРН 1215000013205</p>
					</div>
				</div>
			</div>
		</section>
	</footer>
			
	<div id="calculation" class="modal">
		<div class="modal__dialog">
			<div class="modal__head">
				<a href="#" class="modal__close close-modal">
					<span></span>
				</a>
			</div>
			<div class="modal__content">
				<form action="#" method="post" id="formCalculator" class="form__body">
					<div class="modal__header">
						<div class="modal__titles">
							<h5 class="modal__title">Пройдите краткий опросник, чтоб наши специалисты помогли вам с решением
								задачи как можно быстрее.</h5>
							<p class="modal__steps"><span class="modal__step">1</span>/3</p>
						</div>
						<div class="modal__lasts-text">
							<h4 class="modal__last-text">Спасибо за ваши ответы, оставьте контакты, в скором времени наши
								специалисты
								свяжутся с вами.</h4>
						</div>
					</div>
	
					<div class="modal__progressbar">
						<div class="modal__progressbar-progress"></div>
					</div>
	
					<div class="form__items">
						<div class="form__item active" id="body_1">
							<div class="form__label">
								<h3 class="form__label-title">Какой у вас тип объекта?</h3 la>
							</div>
							<div class="options ">
								<div class="options__item ">
									<label for="privateFacilities" class="options__label">
										<img src="../img/popup/1.webp" alt="Дом">
										<p class="options__text">Частные объекты, дача, дом и т.п.</p>
									</label>
									<input class="options__input" type="radio" name="typeObject"
										value="Частные объекты, дача, дом и т.п." id="privateFacilities">
									<div class="options__item-check">
										<img src="../img/popup/check.svg" alt="">
									</div>
								</div>
								<div class="options__item">
									<label for="schools" class="options__label">
										<img src="../img/popup/2.webp" alt="schools">
										<p class="options__text">Общеобразовательные учреждения, школы, колледжи, детские сады и т.п.
										</p>
									</label>
									<input class="options__input" type="radio" name="typeObject" id="schools"
										value="Общеобразовательные учреждения, школы, колледжи, детские сады и т.п.">
									<div class="options__item-check">
										<img src="../img/popup/check.svg" alt="">
									</div>
								</div>
								<div class="options__item">
									<label for="residentialСomplexes" class="options__label">
										<img src="../img/popup/3.webp" alt="Жилые комплексы">
										<p class="options__text">Жилые комплексы, ГБУ жилищники, программы реновации, мой двор и т.п.
										</p>
									</label>
									<input class="options__input" type="radio" name="typeObject" id="residentialСomplexes"
										value="Жилые комплексы, ГБУ жилищники, программы реновации, мой двор и т.п.">
									<div class="options__item-check">
										<img src="../img/popup/check.svg" alt="">
									</div>
								</div>
								<div class="options__item">
									<label for="parks" class="options__label">
										<img src="../img/popup/4.webp" alt="Парки">
										<p class="options__text">Парки, скверы, благотворительные объекты и т.п.</p>
									</label>
									<input class="options__input" type="radio" name="typeObject" id="parks"
										value="Парки, скверы, благотворительные объекты и т.п.">
									<div class="options__item-check">
										<img src="../img/popup/check.svg" alt="">
									</div>
								</div>
							</div>
						</div>
						<div class="form__item " id="body_2">
							<div class="form__label">
								<h3 class="form__label-title">Какой бюджет вы закладываете в благоустройство территории?</h3>
							</div>
							<div class="ranges">
								<div class="range">
									<input type="range" name="budget" id="rangeBudget" class="input__range" oninput=range(this)
										min="300000" max="30000000" step="297000" value="14850000">
									<div class="selector">
										<div class="selector__btn"></div>
										<div class="selector__value">14850000</div>
									</div>
								</div>
								<div class="ranges__meanings">
									<p class="ranges__min">300000</p>
									<p class="ranges__max">30000000</p>
								</div>
							</div>
	
						</div>
						<div class="form__item " id="body_3">
							<div class="form__label">
								<h3 class="form__label-title">Укажите сроки сдачи объекта? (в месяцах)</h3>
							</div>
							<div class="ranges">
								<div class="range">
									<input type="range" name="date" id="rangeDate" class="input__range" oninput=range(this) min="1"
										max="12" step="1" value="7">
									<div class="selector">
										<div class="selector__btn"></div>
										<div class="selector__value">7</div>
									</div>
								</div>
								<div class="ranges__meanings">
									<p class="ranges__min">1</p>
									<p class="ranges__max">12</p>
								</div>
							</div>
						</div>
						<div class="form__item " id="body_4">
							<div class="informations">
								<div class="informations__tel">
									<div class="informations__label">Ваш номер телефона</div>
									<input type="tel" name="tel" id="formTel" class="form__input formTel _req"
										placeholder="+7 (999) 999 99 99">
								</div>
								<div class="informations__name">
									<div class="informations__label">Ваше имя</div>
									<input type="text" name="name" id="formName" class="form__input formName _req"
										placeholder="Имя">
								</div>
								<div class="informations__email">
									<div class="informations__label">Ваш E-mail</div>
									<input type="email" name="email" id="formEmail" class="form__input formEmail _req"
										placeholder="Почта">
								</div>
							</div>
						</div>
					</div>
	
					<div class="modal__footer">
						<button id="modal__back" type="button" id="back"><img src="../img/popup/arrow.svg" alt="">
							Назад</button>
						<button id="modal__next" type="button" id="forward">Вперёд <img src="../img/popup/arrow.svg"
								alt=""></button>
						<button id="form__button" type="submit">Отправить ответы</button>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="product" class="modal">
		<div class="modal__dialog">
			<div class="modal__head">
				<a href="#" class="modal__close close-modal">
					<span></span>
				</a>
			</div>
			<div class="modal__content">
				<div class="product__images">
					<div class="swiper-wrapper">
						<!-- Slides -->
						
					</div>
					<!-- If we need navigation buttons -->
					<div class="swiper-button-prev"></div>
					<div class="swiper-button-next"></div>
	
				</div>
				<div class="product__descriptions desc">
					<h4 class="desc__title"> Игровой канатный комплекс</h4>
					<h5 class="desc__article"> Арт. SHR0001</h5>
					<a href="#buy" class="desc__price popup-link">Запрос цены</a>
					<div class="desc__text">
						<div class="desc__options">
							<ul>
								
							</ul>
						</div>
						<div class="desc__descriptions">
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	
	
	
	
	<div id="buy" class="modal">
		<div class="modal__dialog">
			<div class="modal__head">
				<a href="#" class="modal__close close-modal">
					<span></span>
				</a>
			</div>
			<div class="modal__content">
				<div class="shopping__cart cart">
					<h3 class="cart__title">Ваш заказ</h3>
	
					
	
					<div class="cart__form">
						<form action="#" id="buyForm" class="form-buy">
							<div class="cart__products">
							
							</div>

							<div class="form-buy__item">
								<label for="buyFormName">Ваше имя</label>
								<input id="buyFormName" class="_req" type="text" placeholder="Иван Смирнов">
							</div>
							<div class="form-buy__item">
								<label for="buyFormEmail">Почта</label>
								<input id="buyFormEmail" class="_req" type="email" placeholder="hello@shelby.com">
							</div>
							<div class="form-buy__item">
								<label for="buyFormTel">Телефон</label>
								<input id="buyFormTel" class="_req" type="tel" placeholder="+7 000 000 00 00">
							</div>
							<div class="form-buy__item">
								<label for="buyFormOrgan">Название организации</label>
								<input id="buyFormOrgan" class="_req" type="text" placeholder="ООО Шелби Плэйс">
							</div>
	
							<button type="submit" id="buyFormSubmit">Заказать</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="connection">
	<div class="connection__call">
		<div class="connection__call-form hidden">
			<form action="#" class="call__form" id="connectionCall">
				<h3 class="call__form-title">Заполните форму или позвоните по номеру указанному ниже</h3>
				<p class="call__form-subtitle">Наши менеджеры проконсультируют вас по любой из наших услуг.</p>
				<div class="call__form-input">
					<input type="tel" required id="connectionCallTel">
					<button id="callFormSubmit">Заказать звонок</button>
				</div>
				<div class="call__form-link">
					<a href="tel:"></a>
				</div>
				<p class="call__form-agree">Нажимая на кнопку, вы даете согласие на обработку ваших персональных данных.</p>
			</form>
		</div>
		<div class="connection__call-button btn-open">
			<img src="../img/call.webp" alt="">
		</div>
	</div>
	<div class="connection__chat">
		<div class="connection__chat-connect chat hidden">
			<a href="#" target="_blank" class="chat__mail">
				<img src="../img/mail.svg" alt="">
			</a>
			<a href="#" target="_blank" class="chat__whatsapp">
				<img src="../img/whatsapp.svg" alt="">
			</a>
			<a href="#" target="_blank" class="chat__telegram">
				<img src="../img/telegramm.svg" alt="">
			</a>
		</div>
		<div class="connection__chat-button btn-open">
			<img src="../img/message.webp" alt="">
		</div>
	</div>
</div>

<div class="cart none" id="buyCart">
	<a href="#buy" class="popup-link"><img src="../img/shoppingCart.svg" alt=""></a>
</div>
	
			
			
		</div>
		<script src="../js/functions.min.js"></script>
	<script src="../js/typed.min.js"></script>
	<script src="../js/swiper-bundle.min.js"></script>
	<script src="../js/burger.min.js"></script>
	<script src="../js/jquery.maskedinput.min.js"></script>
	<script src="../js/app.min.js"></script>
	<script src="../js/calculation.min.js"></script>
	
	</body>
	
	</html>`
};



fs.writeFile('./catalog.json', JSON.stringify(done), function (err) {
	if (err) return console.log(err);
});

for (const key in done) {
	fs.open(`../catalog/${key}.html`, 'w', (err) => {
	if(err) throw err;

	fs.appendFile(`../catalog/${key}.html`, catalogCategory(key, done), (err => {
		if(err) throw err;
		console.log('Data has been added!');
	}))
	});
}

