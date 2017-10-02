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

    // get current date and time for search form
    var timestamps = document.querySelectorAll('.timestamp');
    timestamps.forEach(function (timestamp) {
        timestamp.textContent = new Date();
    });
});