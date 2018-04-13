document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementsByClassName('back-to-top-container')[0];
    var backToTopButton = document.getElementById('back-to-top-button');

    console.log(container);

    backToTopButton.addEventListener('click', function () {
        document.querySelector(this.dataset.target).scrollIntoView({
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', buttonPosition);

    function buttonPosition() {
        if (window.scrollY >= container.offsetTop && window.scrollY + window.innerHeight < container.offsetTop + container.offsetHeight) {
            backToTopButton.style.transform = "scale(1)";
            backToTopButton.style.opacity = 1;
            backToTopButton.style.position = "fixed";
        } else if (window.scrollY + window.innerHeight >= container.offsetTop + container.offsetHeight) {
            backToTopButton.style.position = "absolute";
        } else {
            backToTopButton.style.opacity = 0;
            backToTopButton.style.transform = "scale(0)";
        }
    }
});