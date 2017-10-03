document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.querySelector('.overlay');

    // opens dialogs / modals via data-target
    var togglers = document.querySelectorAll('.toggler');
    togglers.forEach(function (toggler) {
        toggler.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(toggler.dataset.target);
            target.classList.add('open');
            overlay.style.display = 'block';
        });
    });

    // closes dialogs / modals via data-target
    var closers = document.querySelectorAll('.close');
    closers.forEach(function (closer) {
        closer.addEventListener('click', function () {
            var target = document.querySelector(closer.dataset.target);
            target.classList.remove('open');
            setTimeout(function () {
                overlay.style.display = 'none';
            }, 500);
        });
    });

    // closes dialogs / modals when overlay is clicked
    overlay.addEventListener('click', function () {
        overlay.style.display = 'none';
        document.querySelectorAll('.open').forEach(function (open) {
            open.classList.remove('open');
        });
    });

    // dropdown trigger
    // var dropdowns = document.querySelectorAll('.dropdown');
    // dropdowns.forEach(function (dropdown) {
    //     dropdown.addEventListener('click', function (e) {
    //         if (e.target.classList.contains('dropdown-btn')) {
    //             e.preventDefault();
    //             var content = dropdown.querySelector('.dropdown-content');
    //             if (e.target.classList.contains('active')) {
    //                 e.target.classList.remove('active');
    //                 // content.style.display = 'none';
    //             } else {
    //                 e.target.classList.add('active');
    //                 // content.style.display = 'block';
    //             }
    //         }
    //     });
    // });

    // var menus = document.querySelectorAll('.menu');
    // var indicator = document.createElement('li');
    // indicator.className = 'indicator';
    // menus.forEach(function (menu) {
    //     menu.appendChild(indicator);
    // });


    // input-group check if has value
    var inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(function (input) {
        // initial check of all input-groups if has value
        hasValue(input);
        // addEventListener to check validity when focusing out of input field
        input.addEventListener('focusout', function () {
            if (input.checkValidity() === false) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
            hasValue(input);
        });
    });

    function hasValue(input) {
        if (input.value === "") {
            input.classList.remove('has-value');
        } else {
            input.classList.add('has-value');
        }
    }

    // ripple effect for buttons
    var buttons = document.getElementsByTagName('button');
    Array.from(buttons).forEach(function (button) {
        button.addEventListener('click', function (e) {
            var circle = document.createElement('div');
            this.appendChild(circle);

            var size = Math.max(this.clientWidth, this.clientHeight);
            var rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = size + 'px';
            circle.style.left = e.clientX - rect.left - size / 2 + 'px';
            circle.style.top = e.clientY - rect.top - size / 2 + 'px';

            circle.classList.add('ripple');

            setTimeout(() => {
                this.removeChild(circle);
            }, 600);
        });
    });

    // carousel
    carousel();

    function carousel() {
        var currentIndex = 0;
        var touchstartX = 0;
        var touchendX = 0;
        var carousel = document.querySelector('.carousel');
        var slides = carousel.getElementsByClassName('carousel-item');
        var carouselPrev = carousel.querySelector('.carousel-prev');
        var carouselNext = carousel.querySelector('.carousel-next');
        var indicators = carousel.querySelector('.carousel-indicators');
        var isShowing = false;

        for (var i = 0; i < slides.length; i++) {
            var li = document.createElement('LI');
            if (currentIndex == i) {
                li.classList.add('active');
            }
            indicators.appendChild(li);
        }
        var lis = indicators.getElementsByTagName('LI');

        // slideshow
        setInterval(function () {
            next();
        }, 5000);

        carousel.addEventListener('touchstart', function (e) {
            if (!isShowing) {
                touchstartX = e.changedTouches[0].screenX;
            }
        }, false);

        carousel.addEventListener('touchend', function (e) {
            if (!isShowing) {
                touchendX = e.changedTouches[0].screenX;
                handleGesure();
            }
        }, false);

        function handleGesure() {
            // swipe left
            if (touchendX < touchstartX) {
                next();
            }
            // swipe right
            if (touchendX > touchstartX) {
                prev();
            }
        }

        carouselPrev.addEventListener('click', function (e) {
            if (!isShowing) {
                e.preventDefault();
                prev();
            }
        });

        carouselNext.addEventListener('click', function (e) {
            if (!isShowing) {
                e.preventDefault();
                next();
            }
        });

        indicators.addEventListener('click', function (e) {
            if (!isShowing) {
                if (e.target.tagName == 'LI') {
                    var index = Array.prototype.indexOf.call(lis, e.target);
                    showSlide(index);
                }
            }
        });

        function next() {
            if (!isShowing) {
                showSlide((((currentIndex + 1) % slides.length) + slides.length) % slides.length);
            }
        }

        function prev() {
            if (!isShowing) {
                showSlide((((currentIndex - 1) % slides.length) + slides.length) % slides.length);
            }
        }

        function showSlide(index) {
            isShowing = true;
            lis[index].classList.add('active');
            slides[index].classList.add('active');
            slides[index].classList.add('fade-in');
            slides[currentIndex].classList.add('fade-out');
            setTimeout(function () {
                lis[currentIndex].classList.remove('active');
                slides[currentIndex].classList.remove('active');
                slides[index].classList.remove('fade-in');
                slides[currentIndex].classList.remove('fade-out');
                currentIndex = index;
                isShowing = false;
            }, 600);
        }
    }


    // get current date and time for search form
    var timestamps = document.querySelectorAll('.timestamp');
    timestamps.forEach(function (timestamp) {
        timestamp.textContent = new Date();
    });
});