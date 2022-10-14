const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-modal');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.modal'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.modal.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		changeModalBody();
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.modal__content')) {
				popupClose(e.target.closest('.modal'));
			}
		})
	};
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}
function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.getElementsByClassName.PaddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout)
}
function bodyUnLock() {
	setTimeout(function () {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = '0px';
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.modal.open');
		popupClose(popupActive);
	}
});
(function () {
	//Проверяем поддержку
	if (!Element.prototype.closest) {
		//реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// Проверяем поддержку
	if (!Element.prototype.matches) {
		//определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();





function changeModalBody() {
	let modalBack = document.querySelector('.modal__prev'),
		modalNext = document.querySelector('.modal__next'),
		modalFormSubmit = document.querySelector('.modal__form-submit');
	modalStep = document.querySelector('.modal__step'),
		modalProgress = document.querySelector('.modal__progressbar-progress'),
		modalBodes = document.querySelectorAll('.modal__body');
	let step = 1;


	modalNext.addEventListener('click', () => {
		if (step < modalBodes.length) {
			step++;
			if (step == 4) {
				modalProgress.style.width = `${(step - 1) * 33.333}%`;
				modalBodes.forEach((el) => {
					el.classList.remove('active');
				});
				modalBodes[step - 1].classList.add('active');
				modalFormSubmit.classList.add('active');
				modalNext.classList.add('hidden');
				document.querySelector('.modal__last-text').classList.add('active');
				document.querySelector('.modal__title').classList.add('hidden');
				document.querySelector('.modal__steps').classList.add('hidden');
			} else {
				modalStep.textContent = step;
				modalProgress.style.width = `${(step - 1) * 33.333}%`;
				modalBodes.forEach((el) => {
					el.classList.remove('active');
				})
				modalBodes[step - 1].classList.add('active');
			}
		} else if (step = modalBodes.length) {
			modalProgress.style.width = `${step * 33.333}%`
		}
	})


	modalBack.addEventListener('click', () => {
		if (step <= modalBodes.length && step > 1) {
			step--;
			modalStep.textContent = step;
			modalProgress.style.width = `${(step - 1) * 33.333}%`;
			modalBodes.forEach((el) => {
				el.classList.remove('active');
			})
			modalBodes[step - 1].classList.add('active');
		} else if (step < 0) {
			modalProgress.style.width = `${step * 33.333}%`
		}
		if (step < 4) {
			modalFormSubmit.classList.remove('active');
			modalNext.classList.remove('hidden');
			document.querySelector('.modal__title').classList.remove('hidden');
			document.querySelector('.modal__steps').classList.remove('hidden');
			document.querySelector('.modal__last-text').classList.remove('active');
		}
	})

}