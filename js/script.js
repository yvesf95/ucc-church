document.addEventListener('DOMContentLoaded', function () {

    var navbar = function () {
        const BREAKPOINT = 768;
        var navbar = document.getElementById('navbar');

        if (!navbar) {
            return;
        }

        changeBackground();
        addPaddingTopToNextElement();

        window.addEventListener('scroll', changeBackground);
        window.addEventListener('resize', function () {
            changeBackground();
            addPaddingTopToNextElement();
        });

        function changeBackground() {
            if (window.scrollY >= 100 || window.innerWidth < BREAKPOINT) {
                navbar.classList.add('dark-transparent');
                navbar.classList.add('raised-2');
                // navbar.firstElementChild.classList.remove('flat');
                navbar.firstElementChild.classList.add('menubar--scrolled');
            } else {
                navbar.classList.remove('raised-2');
                // navbar.firstElementChild.classList.add('flat');
                navbar.firstElementChild.classList.remove('menubar--scrolled');
                navbar.classList.remove('dark-transparent');
            }
        }

        function addPaddingTopToNextElement() {
            if (window.innerWidth < BREAKPOINT) {
                navbar.nextElementSibling.style.marginTop = '56px';
            } else {
                navbar.nextElementSibling.style = "";
            }
        }
    }();

    var modal = function () {
        var overlay = document.querySelector('.overlay');

        if (!overlay) {
            return;
        }

        // opens dialogs / modals via data-target
        var togglers = document.querySelectorAll('.toggler');
        togglers.forEach(function (toggler) {
            toggler.addEventListener('click', function (e) {
                e.preventDefault();
                document.body.style.overflow = "hidden";
                var target = document.querySelector(toggler.dataset.target);
                target.classList.add('open');
                overlay.style.display = 'block';
            });
        });

        // closes dialogs / modals via data-target
        var closers = document.querySelectorAll('.close');
        closers.forEach(function (closer) {
            closer.addEventListener('click', function (e) {
                e.preventDefault();
                document.body.style.overflow = "";
                var target = document.querySelector(closer.dataset.target);
                target.classList.remove('open');
                setTimeout(function () {
                    overlay.style.display = 'none';
                }, 300);
            });
        });

        // closes dialogs / modals when overlay is clicked
        overlay.addEventListener('click', function () {
            document.body.style.overflow = "";
            overlay.style.display = 'none';
            document.querySelectorAll('.open').forEach(function (open) {
                open.classList.remove('open');
            });
        });
    }();

    // dropdown trigger
    var dropdown = function () {
        var dropdownBtns = document.querySelectorAll('.dropdown-btn');

        if (!dropdownBtns) {
            return;
        }

        dropdownBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                if (btn.parentElement.classList.contains('show')) {
                    btn.parentElement.classList.remove('show');
                } else {
                    btn.parentElement.classList.add('show');
                }
            });
        });

        document.onclick = function (event) {
            if (!parentIsSubmenu(event.target)) {
                var dropdowns = document.getElementsByClassName("dropdown");
                for (var i = 0; i < dropdowns.length; i++) {
                    if (dropdowns[i].classList.contains('show')) {
                        dropdowns[i].classList.remove('show');
                    }
                }
                var dropups = document.getElementsByClassName('dropup');
                for (var j = 0; j < dropups.length; j++) {
                    if (dropups[j].classList.contains('show')) {
                        dropups[j].classList.remove('show');
                    }
                }
            }
        };

        function parentIsSubmenu(child) {
            var node = child;
            while (node != null) {
                if ((node.className || '').indexOf('dropdown-btn') > -1) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
    }();

    var buttonWave = function () {
        // ripple effect for buttons
        var buttons = document.getElementsByTagName('button');

        if (!buttons) {
            return;
        }

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

                setTimeout(function(){
                    button.removeChild(circle);
                }, 400);
            });
        });
    }();

    var cards = function () {
        var cardExpands = document.querySelectorAll('.card-expand');
        cardExpands.forEach(function (cardExpand) {
            var trigger = cardExpand.querySelector('.card-expand-trigger');
            trigger.addEventListener('click', function () {
                var content = cardExpand.querySelector('.card-expand-content');
                if (cardExpand.classList.contains('expand')) {
                    content.classList.add('fade-out-up');
                    setTimeout(function () {
                        cardExpand.classList.remove('expand');
                        content.classList.remove('fade-out-up');
                    }, 300);
                } else {
                    cardExpand.classList.add('expand');
                    content.classList.add('fade-in-down');
                    setTimeout(function () {
                        content.classList.remove('fade-in-down');
                    }, 300);
                }
            });
        });

        var cardButtons = document.querySelectorAll('.card-button');
        cardButtons.forEach(function (cardButton) {
            cardButton.addEventListener('click', function (e) {
                e.preventDefault();
            });
        });
    }();

    // input-group check if has value
    var input = function () {
        var inputs = document.querySelectorAll('.input-group input');
        if (!inputs.length) {
            return;
        }

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
    }();

    // carousel
    var carousel = function () {
        var currentIndex = 0;
        var touchstartX = 0;
        var touchendX = 0;

        var carousel = document.querySelector('.carousel');

        if (!carousel) {
            return;
        }

        var slides = carousel.querySelectorAll('.carousel-item');
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
            if (touchendX + 25 < touchstartX) {
                next();
            }
            // swipe right
            if (touchendX > touchstartX + 25) {
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
            }, 400);
        }
    }();

    // accordion
    var accordion = function () {
        var accordion = document.querySelector('.accordion');

        if (!accordion) {
            return;
        }

        accordion.addEventListener('click', function (e) {
            if (e.target.className == 'accordion-header') {
                if (e.target.parentElement.classList.contains('active')) {
                    e.target.parentElement.classList.remove('active');
                } else {
                    Array.from(accordion.children).forEach(function (child) {
                        child.classList.remove('active');
                    });
                    e.target.parentElement.classList.add('active');
                }
            }
        });
    }();

    // lightbox
    (function() {
        var lightbox = document.querySelector(".lightbox");

        if (!lightbox) {
            return;
        }

        // Get all galleries
        var galleries = document.querySelectorAll(".gallery");

        // Check if one gallery exists
        if (!galleries.length) {
            return;
        }

        const TRANSLATE_VALUE = -100,
            BLANK_SRC = "img/blank.gif",
            DISPLACEMENT_LIMIT = 20,
            ANIMATION_DURATION = 300,
            DOUBLE_CLICK_TIME_INTERVAL = 300;
        // Lightbox data
        var clickedGallery,
            items = [],
            index = 0,
            zoomX = 0,
            zoomY = 0,
            containerX = 0,
            lastTap = 0,
            evCache = [],
            prevDiff = -1,
            isZoomedIn = false,
            isDragging = false;

        var resizeTimer, fadeOutTimer, doubleClickTimer;

        // Lightbox Elements
        var topBar = lightbox.querySelector(".lightbox-top-bar"),
            scroll = lightbox.querySelector(".scroll-container"),
            container = lightbox.querySelector(".photos-container"),
            captionArea = lightbox.querySelector(".caption-area"),
            preloader = lightbox.querySelector(".preloader"),
            leftArrow = lightbox.querySelector(".arrow-left"),
            rightArrow = lightbox.querySelector(".arrow-right"),
            backArrow = lightbox.querySelector(".arrow-back"),
            zoomButton = lightbox.querySelector(".zoom-button"),
            fsButton = lightbox.querySelector(".fs-button"),
            dlButton = lightbox.querySelector(".dl-button");

        galleries.forEach(gallery => {
            gallery.addEventListener("click", function(e) {
                // Prevent anchor tag redirect to another page
                e.preventDefault();
                // Check if the element clicked is an image
                if (
                    e.target.tagName === "IMG" &&
                    !e.target.classList.contains("fit-screen")
                ) {
                    var figure = getParentByTagName(e.target, "figure");
                    // Get the clicked gallery
                    clickedGallery = figure.parentElement;
                    // Get the index of the clicked item
                    index = Array.prototype.indexOf.call(
                        gallery.children,
                        figure
                    );
                    // Initialize the lightbox
                    initLightbox(gallery);
                    // Zoom thumb then show lightbox
                    zoomInThumb(e.target);
                }
            });
        });

        // #region Thumbnail functions
        function zoomInThumb(thumb) {
            var nw = thumb.parentElement.dataset.nw,
                nh = thumb.parentElement.dataset.nh,
                centerFitStyle = calcCenterFitStyle(thumb, nw, nh),
                figure = getParentByTagName(thumb, "figure"),
                rect = figure.getBoundingClientRect();

            // retain the container's width before positioning the thumb absolute
            figure.style.width = rect.width + "px";
            figure.style.maxWidth = rect.width + "px";

            // Add overlay
            var imgOverlay = document.createElement("div");
            imgOverlay.id = "img-overlay";
            figure.appendChild(imgOverlay);
            imgOverlay.classList.add("fade-in");

            // position the thumb absolute
            thumb.classList.add("fit-screen");

            var diffWidth = centerFitStyle.width - rect.width;
            var diffHeight = centerFitStyle.height - rect.height;

            animate({
                duration: ANIMATION_DURATION,
                timing: makeEaseInOut(circ),
                draw(progress) {
                    thumb.style.top = centerFitStyle.top * progress + "px";
                    thumb.style.left = centerFitStyle.left * progress + "px";
                    thumb.style.width = diffWidth * progress + rect.width + "px";
                    thumb.style.minWidth = diffWidth * progress + rect.width + "px";
                    thumb.style.maxWidth = diffWidth * progress + rect.width + "px";
                    thumb.style.height = diffHeight * progress + rect.height + "px";
                    // Remove overlay when finished animating
                    if (progress === 1) {
                        figure.removeChild(imgOverlay);
                        // Reset position
                        figure.style.cssText = "";
                        thumb.style.cssText = "";
                        thumb.classList.remove("fit-screen");
                        // Show Lightbox
                        lightbox.classList.add("show");
                    }
                }
            });
        }
        function zoomOutThumb(thumb) {
            var nw = thumb.parentElement.dataset.nw,
                nh = thumb.parentElement.dataset.nh,
                centerFitStyle = calcCenterFitStyle(thumb, nw, nh),
                figure = getParentByTagName(thumb, "figure"),
                rect = figure.getBoundingClientRect();

            // retain the container's width before positioning the thumb absolute
            figure.style.width = rect.width + "px";
            figure.style.maxWidth = rect.width + "px";

            // Add overlay
            var imgOverlay = document.createElement("div");
            imgOverlay.id = "img-overlay";
            figure.appendChild(imgOverlay);
            imgOverlay.classList.add("fade-out");

            // position the thumb absolute
            thumb.classList.add("fit-screen");
            setImageStyles(thumb, centerFitStyle);

            var diffWidth = centerFitStyle.width - rect.width;
            var diffHeight = centerFitStyle.height - rect.height;

            animate({
                duration: ANIMATION_DURATION,
                timing: makeEaseInOut(circ),
                draw(progress) {
                    var reverse = 1 - progress;
                    thumb.style.top = centerFitStyle.top * reverse + "px";
                    thumb.style.left = centerFitStyle.left * reverse + "px";
                    thumb.style.width = diffWidth * reverse + rect.width + "px";
                    thumb.style.minWidth = diffWidth * reverse + rect.width + "px";
                    thumb.style.maxWidth = diffWidth * reverse + rect.width + "px";
                    thumb.style.height = diffHeight * reverse + rect.height + "px";
                    // Remove overlay when finished animating
                    if (progress === 1) {
                        figure.removeChild(imgOverlay);
                        thumb.classList.remove("fit-screen");
                        figure.style.cssText = "";
                        thumb.style.cssText = "";
                    }
                }
            });
        }
        function animate({ timing, draw, duration }) {
            // Get start time
            let start = performance.now();

            requestAnimationFrame(function animate(time) {
                // timeFraction goes from 0 to 1
                let timeFraction = (time - start) / duration;
                // Check if animation is fininshed
                if (timeFraction > 1) {
                    timeFraction = 1;
                }

                // calculate the current animation state
                let progress = timing(timeFraction);

                draw(progress); // draw it

                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                }
            });
        }
        function makeEaseInOut(timing) {
            return function(timeFraction) {
                if (timeFraction < 0.5) return timing(2 * timeFraction) / 2;
                else return (2 - timing(2 * (1 - timeFraction))) / 2;
            };
        }
        function circ(timeFraction) {
            return 1 - Math.sin(Math.acos(timeFraction));
        }
        // #endregion

        // #region Image functions
        function calcCenterFitStyle(img, width, height) {
            var ratio = height / width,
                top = 0,
                left = 0;

            // First, fit image to screen
            // img is larger than either width or height of the window
            if (width > window.innerWidth || height > window.innerHeight) {
                // is the img landscape or portrait or square?
                if (width > height) {
                    // img is landscape, make the width of the img 90% of the window
                    width = window.innerWidth;
                    // new height is computed by aspect ratio from its width
                    height = width * ratio;
                    // does the new height fit the screen? if not make it smaller again with respect to its height
                    if (height > window.innerHeight) {
                        height = window.innerHeight;
                        width = height / ratio;
                    }
                } else if (width < height) {
                    // img is portrait, make the height of the img 90% of the window
                    height = window.innerHeight;
                    // new width is computed by aspect ratio from its height
                    width = height / ratio;
                    // does the new width fit the screen? if not make it smaller again with respect to its width
                    if (width > window.innerWidth) {
                        width = window.innerWidth;
                        height = width * ratio;
                    }
                } else {
                    // img is square
                    width = window.innerWidth;
                    height = window.innerHeight;
                }
            }

            // Second, center the image
            var imgRect = img.getBoundingClientRect();
            var rect = img.parentElement.getBoundingClientRect();
            // Check if element fills the whole screen
            if (Math.abs(rect.width - window.innerWidth) < 1) {
                // Just get the coordinates of the center of the screen
                left = (window.innerWidth - width) / 2;
            } else {
                /**
                 * Get the coordinates of the center of the screen
                 * then subtract the top and left offset of its parent
                 * since it is still positioned relative to it
                 */
                left = (window.innerWidth - width) / 2 - rect.left;
            }

            if (Math.abs(rect.height - window.innerHeight) < 1) {
                top = (window.innerHeight - height) / 2;
            } else {
                top = (window.innerHeight - height) / 2 - rect.top;
            }
            return {
                top: top,
                left: left,
                width: width,
                height: height
            };
        }
        function setImageStyles(img, { top, left, width, height }) {
            img.style.top = top + "px";
            img.style.left = left + "px";

            img.style.width = width + "px";
            img.style.minWidth = width + "px";
            img.style.maxWidth = width + "px";
            img.style.height = height + "px";
        }
        function imgLoaded(imgElement) {
            return imgElement.complete && imgElement.naturalHeight !== 0;
        }
        // #endregion

        // #region Lightbox functions
        function parseThumbnailElements(gallery) {
            var elements = gallery.children;
            var items = [];

            Array.from(elements).forEach(el => {
                var placeholder = el.firstElementChild,
                    large = placeholder.getAttribute("href"),
                    thumb = placeholder.firstElementChild,
                    small = thumb.getAttribute("src"),
                    naturalWidth = placeholder.dataset.nw,
                    naturalHeight = placeholder.dataset.nh,
                    figcaption = el.getElementsByTagName("figcaption")[0],
                    title = figcaption.querySelector(".title").textContent,
                    caption = figcaption.querySelector(".caption").textContent;

                var item = {
                    large: large,
                    small: small,
                    naturalWidth: naturalWidth,
                    naturalHeight: naturalHeight,
                    title: title,
                    caption: caption,
                    isLoading: true
                };

                items.push(item);
            });
            return items;
        }
        function initLightbox(gallery) {
            document.body.style.overflow = "hidden";
            // Parse data
            var clicked = parseThumbnailElements(gallery);
            // Check if the clicked gallery is the same as the previous
            if (!isEqual(items, clicked)) {
                // Set new array of items
                items = clicked;
                // Creates elements for each item in the array
                initPhotoItems();
            }

            // Set containerX to the clicked thumb
            containerX = TRANSLATE_VALUE * index;
            container.style.transform = `translateX(${containerX}%)`;

            // Set the src for the current, prev, and next items
            setLightboxImages();
        }
        function initPhotoItems() {
            // Create document fragment
            var frag = document.createDocumentFragment();

            // Create a photoItem
            var photoItem = document.createElement("div");
            photoItem.classList.add("photo-item");
            var img = document.createElement("img");
            img.src = BLANK_SRC;
            photoItem.appendChild(img);
            photoItem.appendChild(preloader);

            // Append to document fragment
            for (let i = 0; i < items.length; i++) {
                frag.appendChild(photoItem.cloneNode(true));
            }

            // Remove all photoItems
            removeChildElements(container);
            container.appendChild(frag);
        }
        function setLightboxImages() {
            var photoItems = container.children,
                curImg = photoItems[index].querySelector("img");
            // Previous and Next image index
            var prevIndex = index - 1,
                nextIndex = index + 1;

            // Load the current image
            loadImage(curImg, index);
            // Load the previous image if exists
            if (prevIndex >= 0) {
                var prevImg = photoItems[prevIndex].querySelector("img");
                loadImage(prevImg, prevIndex);
            }
            // Load the next image if exists
            if (nextIndex < items.length) {
                var nextImg = photoItems[nextIndex].querySelector("img");
                loadImage(nextImg, nextIndex);
            }

            // Set href of download button
            dlButton.href = items[index].large;

            // Set the caption
            initCaptionArea(index);
        }
        function loadImage(el, idx) {
            // natural image size
            var nw = items[idx].naturalWidth,
                nh = items[idx].naturalHeight;
            // Fit image to screen
            setImageStyles(el, calcCenterFitStyle(el, nw, nh));
            // Show preloader when fullsize image is not yet loaded
            if (items[idx].isLoading === true) {
                el.nextElementSibling.classList.add('show');
            }

            // 1: load small image and show it
            var img = new Image(),
                small = items[idx].small;
            img.src = small;
            img.onload = function() {
                el.src = small;
            };

            // 2: load large image then replace
            var imgLarge = new Image(),
                large = items[idx].large;
            imgLarge.src = large;
            imgLarge.onload = function() {
                el.src = large;
                items[idx].isLoading = false;
                el.nextElementSibling.classList.remove('show');
            };
        }
        function initCaptionArea(itemIndex) {
            // Remove captions
            removeChildElements(captionArea);

            var frag = document.createDocumentFragment();
            // Check for title
            if (items[itemIndex].title) {
                var title = document.createElement("div");
                title.classList.add("title");
                title.textContent = items[itemIndex].title;
                frag.appendChild(title);
            }
            // Check for caption
            if (items[itemIndex].caption) {
                var caption = document.createElement("div");
                caption.classList.add("caption");
                caption.textContent = items[itemIndex].caption;
                frag.appendChild(caption);
            }

            // Append to captionArea
            captionArea.appendChild(frag);
        }
        // #endregion

        // #region Event Listeners
        // Listener for holding mouse button (ready state for dragging)
        container.addEventListener("touchstart", dragEvent);
        container.addEventListener("mousedown", dragEvent);
        function dragEvent(e) {
            e.preventDefault();
            // Check if current image is in a zoomed state
            if (isZoomedIn && e.target.tagName === "IMG") {
                // Move image
                moveEnlargedImage(e);
            } else {
                // Move container
                moveContainer(e);
            }
        }
        function moveEnlargedImage(e) {
            var img = e.target,
                startX = e.clientX || e.changedTouches[0].clientX,
                startY = e.clientY || e.changedTouches[0].clientY,
                distX = 0,
                distY = 0;

            // Set dragging state to false (allows click event to trigger)
            isDragging = false;

            // Remove transition-duration property
            img.classList.add("move");

            var move = function(e) {
                // e.preventDefault();
                // Check if the mouse actually moved
                var clientX = e.clientX || e.changedTouches[0].clientX,
                    clientY = e.clientY || e.changedTouches[0].clientY;
                if (startX !== clientX || startY !== clientY) {
                    // Set dragging state to true (prevents click event to trigger)
                    isDragging = true;
                    // Compute the displacement from the start position
                    // then subtract it from your original position
                    distX = zoomX - (startX - clientX);
                    distY = zoomY - (startY - clientY);
                    // Apply the style while dragging
                    img.style.top = distY + "px";
                    img.style.left = distX + "px";
                }
            };
            // Listens to drag move
            document.addEventListener('touchmove', move);
            document.addEventListener('mousemove', move);

            var stop = function(e) {
                // e.preventDefault();
                // Return the transition-duration property
                img.classList.remove("move");

                // Set the new position of image
                if (distX !== 0 || distY !== 0) {
                    zoomX = distX;
                    zoomY = distY;
                    // Validate new position of image
                    moveZoomWrap(img, img.naturalWidth, img.naturalHeight);
                    distX = 0;
                    distY = 0;
                }

                // Remove listeners
                document.removeEventListener('touchmove', move);
                document.removeEventListener('mousemove', move);
                document.removeEventListener('touchend', stop);
                document.removeEventListener('mouseup', stop);
            };
            // Listens to drag stop
            document.addEventListener('touchend', stop);
            document.addEventListener('mouseup', stop);
        }
        function moveContainer(e) {
            // e.preventDefault();
            var startX = e.clientX || e.changedTouches[0].clientX,
                distX = 0;

            // Set dragging state to false (allows click event to trigger)
            isDragging = false;
            // Get actual translate value
            var matrix = getComputedStyle(container).transform,
                values = matrix.match(/([-+]?[\d\.]+)/g),
                translate = values[5] ? +values[4] : values[4] ? +values[4] : 0;

            translate = translate / window.innerWidth * 100;

            // Remove transition-duration property
            container.classList.add("move");

            var move = function(e) {
                // e.preventDefault();
                // Check if the mouse actually moved
                var clientX = e.clientX || e.changedTouches[0].clientX;
                if (startX !== clientX) {
                    // Set dragging state to true (prevents click event to trigger)
                    isDragging = true;
                    // Compute the displacement from the start position
                    // then convert it to percent relative to the width of the screen
                    distX = (clientX - startX) / window.innerWidth * 100;
                    // Apply the style while dragging (ES6 syntax)
                    container.style.transform = `translateX(${translate +
                        distX}%)`;
                }
            };
            document.addEventListener('touchmove', move);
            document.addEventListener('mousemove', move);

            var stop = function(e) {
                // e.preventDefault();
                // Return the transition-duration property
                container.classList.remove("move");

                // Check if the displacement is large enough to change the current image
                if (distX > DISPLACEMENT_LIMIT) {
                    // Move to the previous image
                    showPreviousImage(e);
                } else if (distX < -DISPLACEMENT_LIMIT) {
                    // Move to the next image
                    showNextImage(e);
                } else {
                    // Revert back to original position
                    container.style.transform = `translateX(${containerX}%)`;
                }
                distX = 0;

                // Remove listeners
                document.removeEventListener('touchmove', move);
                document.removeEventListener('mousemove', move);
                document.removeEventListener('touchend', stop);
                document.removeEventListener('mouseup', stop);
            };
            document.addEventListener('touchend', stop);
            document.addEventListener('mouseup', stop);
        }
        function moveZoomWrap(el, nw, nh) {
            if (zoomX >= 0) {
                zoomX = 0;
            } else if (zoomX < window.innerWidth - nw) {
                zoomX = window.innerWidth - nw;
            }
            if (zoomY >= 0) {
                zoomY = 0;
            } else if (zoomY < window.innerHeight - nh) {
                zoomY = window.innerHeight - nh;
            }
            el.style.top = zoomY + "px";
            el.style.left = zoomX + "px";
        }

        // Listener for double-tap (zoom-in or zoom-out)
        container.addEventListener("touchend", function(e) {
            e.preventDefault();
            // Check if the current image or the container is in a dragging state
            if (e.target.tagName === "IMG" && !isDragging) {
                if (isDoubleTapped() === true) {
                    var img = e.target;
                    // Check if image is in a zoomed state
                    if (!isZoomedIn) {
                        // Enlarge image size to its natural size
                        enlargeImage(img, e);
                    } else {
                        // Reduce image size to fit screen
                        reduceImage(img);
                    }
                }
            }
        });
        function isDoubleTapped() {
            var currentTime = new Date().getTime();
            var tapLength = currentTime - lastTap;
            clearTimeout(doubleClickTimer);
            if (tapLength < DOUBLE_CLICK_TIME_INTERVAL && tapLength > 0) {
                return true;
            } else {
                doubleClickTimer = setTimeout(function() {
                    clearTimeout(doubleClickTimer);
                    return false;
                }, DOUBLE_CLICK_TIME_INTERVAL);
            }
            lastTap = currentTime;
        }
        // Listener for click (zoom-in or zoom-out)
        container.addEventListener("click", function(e) {
            e.preventDefault();
            // Check if the current image or the container is in a dragging state
            if (e.target.tagName === "IMG" && !isDragging) {
                var img = e.target;
                // Check if image is in a zoomed state
                if (!isZoomedIn) {
                    // Enlarge image size to its natural size
                    enlargeImage(img, e);
                } else {
                    // Reduce image size to fit screen
                    reduceImage(img);
                }
            }
        });
        function enlargeImage(img, e) {
            if (items[index].isLoading === false) {
                var naturalWidth = img.naturalWidth,
                    naturalHeight = img.naturalHeight;
                // Do not zoom 
                if (naturalWidth <= window.innerWidth && naturalHeight <= window.innerHeight) {
                    return;
                }
                // Put in zoomed state
                isZoomedIn = true;
                // Allow dragging
                isDragging = true;
                // Change cursor to zoom-out
                img.classList.add("enlarged");
    
                var width = img.getBoundingClientRect().width,
                    height = img.getBoundingClientRect().height,
                    scaleValue = naturalWidth / width,
                    clientX = e.clientX || e.changedTouches[0].clientX,
                    clientY = e.clientY || e.changedTouches[0].clientY;
    
                // Center the image to the point where the mouse is clicked
                zoomX = window.innerWidth / 2 - clientX * scaleValue;
                zoomY = window.innerHeight / 2 - clientY * scaleValue;
    
                // Validate new position of image
                moveZoomWrap(img, naturalWidth, naturalHeight);
                // Resize the image to its natural size
                img.style.width = naturalWidth + "px";
                img.style.minWidth = naturalWidth + "px";
                img.style.maxWidth = naturalWidth + "px";
                img.style.height = naturalHeight + "px";
            }
        }
        function reduceImage(img) {
            var nw = img.naturalWidth,
                nh = img.naturalHeight;
            // Revert cursor to zoom-in
            img.classList.remove("enlarged");
            // Fit image to screen size
            setImageStyles(img, calcCenterFitStyle(img, nw, nh));
            // Forbid dragging
            isDragging = false;
            // Remove from zoom state
            isZoomedIn = false;
        }

        // #region Lightbox Controls
        lightbox.addEventListener("touchstart", showControls);
        lightbox.addEventListener("mouseover", showControls);
        function showControls() {
            // Reset fadeout timer
            clearTimeout(fadeOutTimer);
            // Show topbar, left and right arrows
            topBar.classList.add("hover");
            leftArrow.classList.add("hover");
            rightArrow.classList.add("hover");
        }
        lightbox.addEventListener("touchend", hideControls);
        lightbox.addEventListener("mouseleave", hideControls);
        function hideControls() {
            // Hides topbar, left and right arrows
            // if mouse doesn't hover on the lightbox for 3 seconds
            fadeOutTimer = setTimeout(function(){
                topBar.classList.add("fade-out");
                leftArrow.classList.add("fade-out");
                rightArrow.classList.add("fade-out");
                setTimeout(function(){
                    topBar.classList.remove("hover");
                    topBar.classList.remove("fade-out");
                    leftArrow.classList.remove("hover");
                    leftArrow.classList.remove("fade-out");
                    rightArrow.classList.remove("hover");
                    rightArrow.classList.remove("fade-out");
                }, 400);
            }, 3000);
        }

        // Listener for Left arrow
        leftArrow.addEventListener("click", showPreviousImage);
        function showPreviousImage(e) {
            e.preventDefault();
            // Checks if image is in a zoomed state
            if (isZoomedIn) {
                var img = container.children[index].firstElementChild;
                reduceImage(img);
            }
            index--;
            if (index <= 0) {
                index = 0;
                leftArrow.style.display = "none";
                containerX = 0;
            } else {
                containerX = containerX - TRANSLATE_VALUE;
            }
            setLightboxImages();
            rightArrow.style.display = "block";
            container.style.transform = `translateX(${containerX}%)`;
        }
        // Listener for Right arrow
        rightArrow.addEventListener("click", showNextImage);
        function showNextImage(e) {
            e.preventDefault();
            // Checks if image is in a zoomed state
            if (isZoomedIn) {
                var img = container.children[index].firstElementChild;
                reduceImage(img);
            }
            index++;
            if (index >= items.length - 1) {
                index = items.length - 1;
                rightArrow.style.display = "none";
                containerX = TRANSLATE_VALUE * (items.length - 1);
            } else {
                containerX = containerX + TRANSLATE_VALUE;
            }
            setLightboxImages();
            leftArrow.style.display = "block";
            container.style.transform = `translateX(${containerX}%)`;
        }

        // Closes lightbox
        backArrow.addEventListener("click", function(e) {
            e.preventDefault();
            document.body.style = "";
            var figure = clickedGallery.children[index],
                thumb = figure.querySelector("img");
            reduceImage(container.children[index].firstElementChild);
            lightbox.classList.remove("show");
            zoomOutThumb(thumb);
        });
        // Toggle zoom-in and zoom-out
        zoomButton.addEventListener("click", function(e) {
            e.preventDefault();
            var img = container.children[index].firstElementChild;
            // Check if image is in a zoomed state
            if (!isZoomedIn) {
                // Enlarge image size to its natural size
                enlargeImage(img, e);
            } else {
                // Reduce image size to fit screen
                reduceImage(img);
            }
        });
        // Toggle fullscreen
        fsButton.addEventListener("click", function(e) {
            e.preventDefault();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
        // Listener for screen resize
        window.addEventListener("resize", function() {
            // Resets timeout until screen has stopped resizing
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function(){
                if (lightbox.classList.contains("show")) {
                    var img = container.children[index].querySelector('img');
                    reduceImage(img);
                    setLightboxImages();
                }
            }, 200);
        });
        // #endregion
        // #endregion
    
        // #region Other functions
        var isEqual = function(value, other) {
            // Get the value type
            var type = Object.prototype.toString.call(value);
        
            // If the two objects are not the same type, return false
            if (type !== Object.prototype.toString.call(other)) return false;
        
            // If items are not an object or array, return false
            if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;
        
            // Compare the length of the length of the two items
            var valueLen =
                type === "[object Array]" ? value.length : Object.keys(value).length;
            var otherLen =
                type === "[object Array]" ? other.length : Object.keys(other).length;
            if (valueLen !== otherLen) return false;
        
            // Compare two items
            var compare = function(item1, item2) {
                // Get the object type
                var itemType = Object.prototype.toString.call(item1);
        
                // If an object or array, compare recursively
                if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
                    if (!isEqual(item1, item2)) return false;
                } else {
                    // Otherwise, do a simple comparison
                    // If the two items are not the same type, return false
                    if (itemType !== Object.prototype.toString.call(item2))
                        return false;
        
                    // Else if it's a function, convert to a string and compare
                    // Otherwise, just compare
                    if (itemType === "[object Function]") {
                        if (item1.toString() !== item2.toString()) return false;
                    } else {
                        if (item1 !== item2) return false;
                    }
                }
            };
        
            // Compare properties
            if (type === "[object Array]") {
                for (var i = 0; i < valueLen; i++) {
                    if (compare(value[i], other[i]) === false) return false;
                }
            } else {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        if (compare(value[key], other[key]) === false) return false;
                    }
                }
            }
        
            // If nothing failed, return true
            return true;
        };
        
        var getParentByTagName = function(node, tagname) {
            var parent;
            if (node === null || tagname === "") return;
            parent = node.parentNode;
            tagname = tagname.toUpperCase();
        
            while (parent.tagName !== "HTML") {
                if (parent.tagName === tagname) {
                    return parent;
                }
                parent = parent.parentNode;
            }
        
            return parent;
        };
        
        function removeChildElements(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
        // #endregion
    })();

    // Horizontal lists
    var horizontalLists = function () {
        var horizontalLists = document.querySelectorAll('.horizontal-list');
        const BREAKPOINT = 959;

        if (!horizontalLists.length) {
            return;
        }

        for (let i = 0; i < horizontalLists.length; i++) {
            horizontalList(horizontalLists[i]);
        }

        function horizontalList(horizontalList) {
            var inner = horizontalList.querySelector('.horizontal-list-inner');
            var item = inner.querySelector('.horizontal-list-item');
            var arrowLeft = horizontalList.querySelector('.arrow-left');
            var arrowRight = horizontalList.querySelector('.arrow-right');

            var noOfItems = inner.childElementCount;
            var itemWidth = item.getBoundingClientRect().width;
            var translateValue = +inner.style.transform.replace(/[^0-9.\-]/g, '') || 0;
            var max = -(itemWidth * noOfItems - inner.parentElement.getBoundingClientRect().width);

            var touchstartX = 0;
            var touchendX = 0;

            var resizeTimer,
                didResizeWhileHidden = false,
                flexWrap = false;

            (function () {
                checkForFlexWrap();
                toggleLeftArrowVisibility();
                toggleRightArrowVisibility();
            })();

            horizontalList.addEventListener('click', function (e) {
                if (isChildOfClassName(e.target, "arrow-left")) {
                    prev();
                } else if (isChildOfClassName(e.target, "arrow-right")) {
                    next();
                }
            });

            horizontalList.addEventListener('touchstart', function (e) {
                touchstartX = e.changedTouches[0].screenX;
                // e.preventDefault();
            }, false);

            horizontalList.addEventListener('touchend', function (e) {
                touchendX = e.changedTouches[0].screenX;
                handleGesure();
                // e.preventDefault();
            }, false);

            window.addEventListener('resize', function (e) {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function(){
                    recalibrate();
                    move();
                }, 250);
            });

            function handleGesure() {
                // swipe left
                if (touchendX + 75 < touchstartX) {
                    next();
                }
                // swipe right
                if (touchendX > touchstartX + 75) {
                    prev();
                }
            }

            function prev() {
                if (didResizeWhileHidden) {
                    didResizeWhileHidden = false;
                    itemWidth = item.getBoundingClientRect().width;
                    max = -(itemWidth * inner.childElementCount - inner.parentElement.getBoundingClientRect().width);
                }
                if (translateValue + itemWidth >= 0) {
                    translateValue = 0;
                } else {
                    translateValue = translateValue + itemWidth;
                }
                toggleLeftArrowVisibility();
                toggleRightArrowVisibility();
                move();
            }

            function next() {
                if (didResizeWhileHidden) {
                    didResizeWhileHidden = false;
                    itemWidth = item.getBoundingClientRect().width;
                    max = -(itemWidth * inner.childElementCount - inner.parentElement.getBoundingClientRect().width);
                }
                if (translateValue - itemWidth <= max) {
                    translateValue = max;
                } else {
                    translateValue = translateValue - itemWidth;
                }
                toggleLeftArrowVisibility();
                toggleRightArrowVisibility();
                move();
            }

            function move() {
                inner.style.transform = "translateX(" + translateValue + "px)";
            }

            function recalibrate() {
                if (isHidden(horizontalList)) {
                    didResizeWhileHidden = true;
                    translateValue = 0;
                    return;
                }
                var currentIndex = translateValue / itemWidth;
                itemWidth = item.getBoundingClientRect().width;
                translateValue = itemWidth * currentIndex;
                max = -(itemWidth * inner.childElementCount - inner.parentElement.getBoundingClientRect().width);
                checkForFlexWrap();
                toggleLeftArrowVisibility();
                toggleRightArrowVisibility();
            }

            function toggleLeftArrowVisibility() {
                // Check for touch device and screen below breakpoint, contains flex wrap, or at last item
                if (("ontouchstart" in document.documentElement && window.innerWidth < BREAKPOINT) ||
                    flexWrap || translateValue === 0) {
                    arrowLeft.style.display = "none";
                } else {
                    arrowLeft.style.display = "block";
                }
            }

            function toggleRightArrowVisibility() {
                // Check for touch device and screen below breakpoint, contains flex wrap, or at first item
                if (("ontouchstart" in document.documentElement && window.innerWidth < BREAKPOINT) ||
                    flexWrap || translateValue === max) {
                    arrowRight.style.display = "none";
                } else {
                    arrowRight.style.display = "block";
                }
            }

            function checkForFlexWrap() {
                var innerStyle = getComputedStyle(inner, null);
                if (innerStyle.getPropertyValue('flex-wrap') === "wrap") {
                    flexWrap = true;
                    translateValue = 0;
                    max = 0;
                    move();
                } else {
                    flexWrap = false;
                }
            }
        }

        function isChildOfClassName(child, className) {
            var element = child;
            while (element !== null) {
                if ((element.className || '').indexOf(className) > -1) {
                    return true;
                }
                element = element.parentElement;
            }
            return false;
        }

        function isHidden(el) {
            return (el.offsetParent === null);
        }
    }();

    // Tabs
    var tabs = function () {
        var tabs = document.querySelectorAll('.tabs');

        if (!tabs.length) {
            return;
        }

        for (let i = 0; i < tabs.length; i++) {
            tab(tabs[i]);
        }

        function tab(tab) {
            var bar = tab.querySelector('.tabs-bar');
            var nav = tab.querySelector('.tabs-nav');
            var items = tab.querySelector('.tab-items');
            var active = nav.querySelector('.active');
            var activeItem = items.querySelector(active.dataset.target);
            var arrowLeft, arrowRight, indicator;

            var barRect, navRect, activeRect;
            var translateValue = 0;
            var startx = 0;
            var dist = 0;
            var isTransitioning = false;
            const TRANSITION_DURATION = 300;

            // Init function
            (function () {
                barRect = bar.getBoundingClientRect();
                nav.style.transform = "translateX(" + -translateValue + "px)";
                // Hide all items
                hideAllItems();
                // Show active item
                activeItem.style.display = "block";

                // Create indicator
                indicator = document.createElement('LI');
                indicator.classList.add('tab-indicator');
                nav.appendChild(indicator);
                // Move indicator to active link
                moveIndicator();

                // Create arrows
                arrowLeft = createArrow("left");
                arrowRight = createArrow("right");
                // Toggle arrow visibility
                toggleArrowVisibility();

                // Check for touch device
                if ("ontouchstart" in document.documentElement) {
                    arrowLeft.style.display = "none";
                    arrowRight.style.display = "none";
                }
            })();

            // Event Listeners
            nav.addEventListener('click', function (e) {
                var clicked = closest(e.target, "tab-link");
                if (clicked && !isTransitioning) {
                    active.classList.remove('active');

                    clicked.classList.add('active');
                    active = clicked;

                    var targetItem = items.querySelector(active.dataset.target);
                    targetItem.style.display = "block";

                    var prevIndex = Array.prototype.indexOf.call(items.children, activeItem);
                    var nextIndex = Array.prototype.indexOf.call(items.children, targetItem);
                    var transitionTo;
                    if (prevIndex < nextIndex) {
                        transitionTo = "left";
                    } else if (prevIndex > nextIndex) {
                        transitionTo = "right";
                    } else {
                        return;
                    }

                    // Animation
                    activeItem.classList.add('tab-transition-to-' + transitionTo);
                    targetItem.classList.add('tab-transition-to-' + transitionTo);
                    isTransitioning = true;

                    setTimeout(function () {
                        activeItem.classList.remove('tab-transition-to-' + transitionTo);
                        targetItem.classList.remove('tab-transition-to-' + transitionTo);
                        activeItem.style.display = "none";
                        activeItem = targetItem;
                        isTransitioning = false;
                    }, 300);

                    moveIndicator();
                }
            });

            nav.addEventListener('touchstart', function (e) {
                // reference first touch point (ie: first finger)
                var touchobj = e.changedTouches[0];
                // get x position of touch point relative to left edge of browser
                startx = parseInt(touchobj.clientX);
            });

            nav.addEventListener('touchmove', function (e) {
                // reference first touch point for this event
                var touchobj = e.changedTouches[0];
                // Distance from touchstart to current
                dist = -(parseInt(touchobj.clientX) - startx);
                // Move nav while dragging
                nav.style.transform = "translateX(" + -(translateValue + dist) + "px)";
            });

            nav.addEventListener('touchend', function (e) {
                // Get the translateValue after dragging
                translateValue = translateValue + dist;
                // Check if nav is dragged too far to the left
                if (translateValue <= 0) {
                    // Set translateValue to initial pos
                    translateValue = 0;
                }
                // Check if nav is dragged too far to the right
                if (translateValue >= navRect.width - barRect.width) {
                    // Compare widths
                    if (barRect.width <= navRect.width) {
                        // Set translateValue to farthest
                        translateValue = navRect.width - barRect.width;
                    } else {
                        // Go back to initial pos
                        translateValue = 0;
                    }
                }
                nav.style.transform = "translateX(" + -translateValue + "px)";
                dist = 0;
            });

            arrowLeft.addEventListener('click', function () {
                // Check if nav is moved too far to the left
                if (translateValue - barRect.width <= 0) {
                    // Set translateValue to initial pos
                    translateValue = 0;
                    arrowLeft.style.display = "none";
                } else {
                    translateValue -= barRect.width;
                    arrowRight.style.display = "block";
                }
                nav.style.transform = "translateX(" + -translateValue + "px)";
                setTimeout(toggleArrowVisibility, TRANSITION_DURATION);
            });

            arrowRight.addEventListener('click', function () {
                console.log(translateValue);
                // Check if nav is moved too far to the right
                if (translateValue + barRect.width >= navRect.width - barRect.width) {
                    // Set translateValue to farthest
                    translateValue = navRect.width - barRect.width;
                    arrowRight.style.display = "none";
                } else {
                    translateValue += barRect.width;
                    arrowLeft.style.display = "block";
                }
                console.log(translateValue);
                nav.style.transform = "translateX(" + -translateValue + "px)";
                setTimeout(toggleArrowVisibility, TRANSITION_DURATION);
            });

            // Recompute values on resize
            window.addEventListener('resize', recalibrate);


            // Functions
            function recalibrate() {
                barRect = bar.getBoundingClientRect();
                moveIndicator();
                toggleArrowVisibility();
            }

            function createArrow(arrowType) {
                var arrow = bar.querySelector('.arrow-' + arrowType);

                // Check if arrow exists
                if (arrow) {
                    return;
                }

                arrow = document.createElement('button');
                arrow.classList.add('arrow-' + arrowType);

                var icon = document.createElement('i');
                icon.classList.add('material-icons');
                icon.textContent = "chevron_" + arrowType;

                arrow.appendChild(icon);
                bar.appendChild(arrow);
                return arrow;
            }

            function toggleArrowVisibility() {
                if (!arrowLeft || !arrowRight || "ontouchstart" in document.documentElement) {
                    return;
                }

                navRect = nav.getBoundingClientRect();
                if (barRect.width < navRect.width) {
                    // Check if nav still has links to the left
                    if (barRect.left <= navRect.left) {
                        arrowLeft.style.display = "none";
                    } else {
                        arrowLeft.style.display = "block";
                    }
                    // Check if nav still has links to the right
                    if (barRect.right >= navRect.right) {
                        arrowRight.style.display = "none";
                    } else {
                        arrowRight.style.display = "block";
                    }
                } else {
                    translateValue = 0;
                    nav.style.transform = "translateX(" + -translateValue + "px)";
                    arrowLeft.style.display = "none";
                    arrowRight.style.display = "none";
                }
            }

            function moveIndicator() {
                navRect = nav.getBoundingClientRect();
                activeRect = active.getBoundingClientRect();
                indicator.style.left = activeRect.left - navRect.left + "px";
                indicator.style.width = activeRect.width + "px";
            }

            function hideAllItems() {
                var children = items.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].style.display = "none";
                }
            }

            function closest(child, className) {
                var node = child;
                while (node !== null) {
                    if ((node.className || '').indexOf(className) > -1) {
                        return node;
                    }
                    node = node.parentElement;
                }
                return null;
            }
        }
    }();

    // timeline
    var timeline = function () {

        var timeline = document.querySelector('.timeline');

        if (!timeline) {
            return;
        }

        var eventsSection = document.getElementById('events-section');
        var timelineInner = timeline.querySelector('.timeline-inner');
        var panels = document.querySelectorAll('.panel');

        var translate = 0;
        var visible = timelineInner.getBoundingClientRect().width - timeline.getBoundingClientRect().width;

        timeline.addEventListener('click', function (e) {
            e.preventDefault();
            if (e.target.className === 'timeline-link') {
                timeline.querySelectorAll('.timeline-link').forEach(function (timelineLink) {
                    if (timelineLink == e.target) {
                        timelineLink.classList.add('active');
                    } else {
                        timelineLink.classList.remove('active');
                    }
                });
                var targetPanel = document.querySelector(e.target.dataset.target);
                var eventImg = targetPanel.getElementsByTagName('IMG')[1];
                eventsSection.style.backgroundImage = "url('" + eventImg.getAttribute('src') + "')";
                panels.forEach(function (panel) {
                    if (panel == targetPanel) {
                        panel.classList.add('active');
                        panel.classList.add('fade-in');
                    } else {
                        panel.classList.remove('active');
                        panel.classList.add('fade-out');
                    }
                });
            } else if (parentIsSubmenu(e.target, 'timeline-prev')) {
                if (translate - 300 < 0) {
                    translate = 0;
                } else {
                    translate = translate - 300;
                }
                timelineInner.style.transform = 'translateX(-' + translate + 'px)';
            } else if (parentIsSubmenu(e.target, 'timeline-next')) {
                console.log(visible);
                console.log(timeline.getBoundingClientRect().width);
                if (translate + 300 > visible) {
                    translate = visible;
                } else {
                    translate = translate + 300;
                }
                timelineInner.style.transform = 'translateX(-' + translate + 'px)';
            }
        });

        var computeVisible = function () {
            visible = timelineInner.getBoundingClientRect().width - timeline.getBoundingClientRect().width;
        };

        window.addEventListener('resize', computeVisible);

        function parentIsSubmenu(child, className) {
            var node = child;
            while (node !== null) {
                if ((node.className || '').indexOf(className) > -1) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
    }();

    // sermon player
    var sermonPlayer = function () {
        // the sermon player (bottom sheet)
        var sermonPlayer = document.getElementById('sermon-player');

        if (!sermonPlayer) {
            return;
        }

        // the sermon track (mp3 file)
        var sermonTrack = document.getElementById('sermon-track');
        // get current time element
        var currentTime = document.getElementById('current-time');

        // Play Button
        var playButton = document.getElementById('play-button');
        var showPlayerButton = document.getElementById('show-player-button');
        var hidePlayerButton = document.getElementById('hide-player-button');

        // Progress Bar
        var trackProgress = document.getElementById('track-progress');
        var timeBufferedBar = document.getElementById('time-buffered-bar');
        var timeElapsedBar = document.getElementById('time-elapsed-bar');
        var timeElapsedFloat = document.getElementById('time-elapsed-float');
        var trackHandle = document.getElementById('track-handle');
        var isTrackProgressOnMouseDown = false;

        // Volume
        var volumeButton = document.getElementById('volume-button');
        var volumeProgress = document.getElementById('volume-progress');
        var volumeCurrent = document.getElementById('volume-current');
        var volumeHandle = document.getElementById('volume-handle');
        var isVolumeControlOnMouseDown = false;

        // Hide volume progress bar on touch screen devices
        // if ("ontouchstart" in document.documentElement) {
        //     volumeProgress.parentElement.style.display = "none";
        // }

        // Sermon Track Events

        // Fires when the audio is playing after having been paused or stopped for buffering
        sermonTrack.addEventListener('playing', function () {
            playButton.firstElementChild.textContent = "pause_circle_outline";
            showPlayerButton.firstElementChild.textContent = "pause_circle_outline";
            showPlayerButton.querySelector('span').textContent = "Pause";
        });

        // Fires when the audio has been paused
        sermonTrack.addEventListener('pause', function () {
            playButton.firstElementChild.textContent = "play_circle_outline";
            showPlayerButton.firstElementChild.textContent = "play_circle_outline";
            showPlayerButton.querySelector('span').textContent = "Play";
        });

        // Fires when the duration of the audio is changed
        sermonTrack.addEventListener('durationchange', function () {
            // Sets the full duration
            var fullDuration = document.getElementById('full-duration');
            fullDuration.textContent = parseTime(sermonTrack.duration);
        });

        // Fires when the current playback position has changed
        sermonTrack.addEventListener('timeupdate', function () {
            // Convert to minutes and seconds ex. 00:01
            currentTime.textContent = parseTime(sermonTrack.currentTime);
            // Computes size of time elapsed progress bar 
            var size = sermonTrack.currentTime / sermonTrack.duration * trackProgress.clientWidth + "px";
            // Updates time elapsed progress bar 
            timeElapsedBar.style.width = size;
            trackHandle.style.left = size;
        });

        // Fires when volume is changed
        sermonTrack.addEventListener('volumechange', function () {
            if (sermonTrack.volume !== 0 && !sermonTrack.muted) {
                // Volume is not muted and not zero
                volumeButton.firstElementChild.textContent = "volume_up";
            } else {
                // Volume is muted and 0
                volumeButton.firstElementChild.textContent = "volume_off";
            }
            // Updates volume bar
            volumeCurrent.style.width = sermonTrack.volume * 100 + "%";
            volumeHandle.style.left = sermonTrack.volume * 100 + "%";
        });
        // Set initial volume
        sermonTrack.volume = 0;
        sermonTrack.volume = 1;

        // Fires when the browser can start playing the audio
        sermonTrack.addEventListener('canplay', function () {
            // Add listener for when downloading track
            addProgressListener();
        });

        // Fires when the browser can play through the audio without stopping for buffering
        sermonTrack.addEventListener('canplaythrough', function () {
            // Update the time buffered bar when track can play everything
            updateTimeBuffered();
        });

        function addProgressListener() {
            // Fires when the browser is downloading the audio
            sermonTrack.addEventListener('progress', function () {
                // Updates time buffered bar on download
                updateTimeBuffered();
            });
        }

        function updateTimeBuffered() {
            // Checks if has buffered parts of the audio
            if (sermonTrack.buffered.length > 0) {
                // Get the end position of the buffered range
                var bufferedEnd = sermonTrack.buffered.end(0);
                var duration = sermonTrack.duration;
                if (duration > 0) {
                    // Computes and sets the size of time buffered bar
                    timeBufferedBar.style.width = ((bufferedEnd / duration) * 100) + "%";
                }
            }
        }


        // Click Events

        // Shows player
        showPlayerButton.addEventListener('click', function () {
            sermonPlayer.classList.add('open');
            playOrPause();
        });

        // Hides player
        hidePlayerButton.addEventListener('click', function (e) {
            e.preventDefault();
            sermonPlayer.classList.remove('open');
        });

        // Plays or pauses the track
        playButton.addEventListener('click', playOrPause);

        function playOrPause() {
            if (!sermonTrack.paused && !sermonTrack.ended) {
                sermonTrack.pause();
            } else {
                sermonTrack.play();
            }
        }

        // Mutes or unmutes the volume of the track
        volumeButton.addEventListener('click', function () {
            if (sermonTrack.muted) {
                sermonTrack.muted = false;
                volumeButton.firstElementChild.textContent = "volume_up";
            } else {
                sermonTrack.muted = true;
                volumeButton.firstElementChild.textContent = "volume_off";
            }
        });


        // Hover and Drag Events

        // Order of events
        // touchstart
        // touchmove
        // touchend
        // mouseover
        // mousemove
        // mousedown
        // mouseup
        // click

        // Touch Events

        // Touchstart - show time-float
        trackProgress.addEventListener('touchstart', function (e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            trackProgress.classList.add('hover');
            setNewTime(e.changedTouches[0].pageX);
            // sets time float position on mouse position
            setTimeFloatPosition(e.changedTouches[0].pageX);
        });

        // Touchmove - drag time-elapsed bar and time-float
        trackProgress.addEventListener('touchmove', function (e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            setNewTime(e.changedTouches[0].pageX);
            // sets time float position on mouse position
            setTimeFloatPosition(e.changedTouches[0].pageX);
        });

        // Touchend - hide time-float
        trackProgress.addEventListener('touchend', function () {
            trackProgress.classList.remove('hover');
        });

        // Mouse Events
        // Mouseover - show time-float
        trackProgress.addEventListener('mouseover', function () {
            trackProgress.classList.add('hover');
        });

        // Mousemove - sets time-float position and label on move
        trackProgress.addEventListener('mousemove', function (e) {
            setTimeFloatPosition(e.pageX);
        });

        // Mousedown - ready for mouse drag on track-progress
        trackProgress.addEventListener('mousedown', function (e) {
            // prevents selecting
            e.preventDefault();
            // enables mousemove while on mouse down (dragging)
            isTrackProgressOnMouseDown = true;
            setNewTime(e.pageX);

            // Listener placed on document to allow going out of the progress bar while dragging
            document.onmousemove = function (e) {
                // changes track progress bar while dragging
                if (isTrackProgressOnMouseDown) {
                    // prevents selecting while dragging
                    e.preventDefault();
                    setNewTime(e.pageX);
                }
            };

            // Listener placed on document to listen to mouseup 
            // outside of progress bar for indication of mouse drag
            document.onmouseup = function () {
                // removes mousemove after mouseup
                isTrackProgressOnMouseDown = false;
                document.onmouseup = null;
                document.onmousemove = null;
            };
        });

        // Mouseleave - hide time-float
        trackProgress.addEventListener('mouseleave', function () {
            trackProgress.classList.remove('hover');
        });

        // Track Progress functions
        function setTimeFloatPosition(pageX) {
            timeElapsedFloat.style.left = pageX - trackProgress.getBoundingClientRect().left + "px";
            var targetTime = (pageX - trackProgress.getBoundingClientRect().left) * sermonTrack.duration / trackProgress.clientWidth;
            // shows the time of where the mouse position
            timeElapsedFloat.textContent = parseTime(targetTime);
        }

        function setNewTime(pageX) {
            var newTime = (pageX - trackProgress.getBoundingClientRect().left) * sermonTrack.duration / trackProgress.clientWidth;
            if (newTime >= 0 && newTime <= sermonTrack.duration) {
                sermonTrack.currentTime = newTime;
            }
        }

        // Listens to mouse down on volume progress bar
        // Touchstart - show time-float
        volumeProgress.addEventListener('touchstart', function (e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            volumeProgress.classList.add('hover');
            setNewVolume(e.changedTouches[0].pageX);
        });

        // Touchmove - drag time-elapsed bar and time-float
        volumeProgress.addEventListener('touchmove', function (e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            setNewVolume(e.changedTouches[0].pageX);
        });

        // Touchend - hide time-float
        volumeProgress.addEventListener('touchend', function () {
            volumeProgress.classList.remove('hover');
        });

        volumeProgress.addEventListener('mousedown', function (e) {
            // prevents selecting
            e.preventDefault();
            // enables mousemove while on mouse down (dragging)
            isVolumeControlOnMouseDown = true;
            setNewVolume(e.pageX);

            // Listens to mousemove while on mousedown (dragging)
            document.onmousemove = function (e) {
                // changes volume progress bar while dragging
                if (isVolumeControlOnMouseDown) {
                    e.preventDefault();
                    setNewVolume(e.pageX);
                }
            };

            // Listens to mouseup (done dragging)
            document.onmouseup = function () {
                // removes mousemove after mouseup
                isVolumeControlOnMouseDown = false;
                document.onmouseup = null;
                document.onmousemove = null;
            };
        });

        // Volume functions
        function setNewVolume(pageX) {
            var newVolume = (pageX - volumeProgress.getBoundingClientRect().left) / volumeProgress.clientWidth;
            if (newVolume < 0) {
                newVolume = 0;
            }
            if (newVolume > 1) {
                newVolume = 1;
            }
            sermonTrack.volume = newVolume;
        }

        // Scope functions
        function computeNewBarWidth(newPos, rect) {
            return (newPos - rect.left) / rect.width;
        }

        function parseTime(time) {
            return ("0" + parseInt(time / 60)).slice(-2) + ":" + ("0" + parseInt(time % 60)).slice(-2);
        }
    }();

    var dev = function () {
        var devotional = document.getElementById('morning-evening-devotional');

        if (!devotional) {
            return;
        }

        fetchJSONfile("morning-and-evening-master/m_e.json", function (data) {
            var dateToday = new Date();
            var day = dateToday.getDate();
            var month = dateToday.getMonth() + 1;
            var monthDateString = month + "-" + day;
            var time;
            if (dateToday.getHours < 12) {
                time = "pm";
            } else {
                time = "am";
            }
            for (var i = 0; i < data.length; i++) {
                var element = data[i];
                if (element !== null &&
                    element.month === month &&
                    element.day === day &&
                    element.time === time) {
                    console.log(element);
                    var bodyText = element.body.replace(/\n/g, "<br>");
                    document.getElementById('dev-body').innerHTML = bodyText;
                    document.getElementById('dev-keyverse').innerHTML = element.keyverse;
                }
            }
        });

        function fetchJSONfile(path, callback) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == "200") {
                    var data = JSON.parse(this.responseText);
                    if (callback) {
                        callback(data);
                    }
                }
            };
            xhttp.open("GET", path, true);
            xhttp.send();
        }
    }();

});