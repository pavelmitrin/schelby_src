/* Burger */
$(document).ready(function () {
	$('.header__burger').click(function (event) {
		$('.header__burger,.header__menu').toggleClass('active');
		$('body').toggleClass('_lock');
	});
	$('.header__link').click(function (event) {
		$('.header__burger,.header__menu').removeClass('active');
		$('body').removeClass('_lock');
	});
});
$(document).ready(function () {
	if ($(window).width() >= '1200') {
		$('.header').hover(function (e) {
			$(".header__burger,.header__menu").toggleClass("active");
			$("body").toggleClass("lock");
		})
	}
});