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
                navbar.firstElementChild.classList.remove('flat');
                navbar.firstElementChild.classList.add('menubar--scrolled');
            } else {
                navbar.firstElementChild.classList.add('flat');
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

                setTimeout(() => {
                    this.removeChild(circle);
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

    // gallery
    var gallery = function () {
        var gallery = document.querySelector('.gallery');

        if (!gallery) {
            return;
        }

        var isZoomedIn = false,
            isLoading = false;
        
        gallery.addEventListener('click', function (e) {
            e.preventDefault();

            if (isLoading) {
                return;
            }

            var targetImage = e.target;
            if (targetImage.tagName == 'IMG') {
                if (!targetImage.classList.contains('zoomed-in')) {
                    var src = targetImage.getAttribute('data-src');
                    if (targetImage.getAttribute('src') !== src) {
                        isLoading = true;
                        var newImage = new Image();
                        newImage.onload = function () {
                            targetImage.src = src;
                            zoomImage(targetImage);
                            isLoading = false;
                        };
                        newImage.src = src;
                    } else {
                        zoomImage(targetImage);
                    }
                } else {
                    imgZoomOut();
                }
            }
        });

        function zoomImage (targetImage) {
            isZoomedIn = true;
            // get the actual width, height, aspect ratio of the img, and the boundaries of its container
            var imgWidth = targetImage.naturalWidth,
                imgHeight = targetImage.naturalHeight,
                imgRatio = imgHeight / imgWidth,
                rect = targetImage.parentElement.getBoundingClientRect(),
                top = 0,
                left = 0;

            // img is larger than either width or height of the window
            if (imgWidth > window.innerWidth * 0.9 || imgHeight > window.innerHeight * 0.9) {
                // is the img landscape or portrait or square?
                if (imgWidth > imgHeight) {
                    // img is landscape, make the width of the img 90% of the window
                    imgWidth = window.innerWidth * 0.9;
                    // new height is computed by aspect ratio from its width
                    imgHeight = imgWidth * imgRatio;
                    // does the new height fit the screen? if not make it smaller again with respect to its height
                    if (imgHeight > window.innerHeight * 0.9) {
                        imgHeight = window.innerHeight * 0.9;
                        imgWidth = imgHeight / imgRatio;
                    }
                } else if (imgWidth < imgHeight) {
                    // img is portrait, make the height of the img 90% of the window
                    imgHeight = window.innerHeight * 0.9;
                    // new width is computed by aspect ratio from its height
                    imgWidth = imgHeight / imgRatio;
                    // does the new width fit the screen? if not make it smaller again with respect to its width
                    if (imgWidth > window.innerWidth * 0.9) {
                        imgWidth = window.innerWidth * 0.9;
                        imgHeight = imgWidth * imgRatio;
                    }
                } else {
                    // img is square
                    imgWidth = window.innerWidth * 0.9;
                    imgHeight = window.innerHeight * 0.9;
                }
            }
            // position the img at the center of the screen 

            // (subtract the top offset of its container since it is still positioned relative to it)
            top = (window.innerHeight - imgHeight) / 2 - rect.top;
            // (subtract the left offset of its container since it is still positioned relative to it)
            left = (window.innerWidth - imgWidth) / 2 - rect.left;

            // retain the container's width before positioning the img absolute
            targetImage.parentElement.style.width = rect.width + "px";
            targetImage.parentElement.style.maxWidth = rect.width + "px";
            // make the img bigger
            targetImage.classList.add('zoomed-in');
            targetImage.style.top = top + "px";
            targetImage.style.left = left + "px";
            targetImage.style.width = imgWidth + "px";
            targetImage.style.minWidth = imgWidth + "px";
            targetImage.style.maxWidth = imgWidth + "px";
            targetImage.style.height = imgHeight + "px";
    
            var imgOverlay = document.createElement('div');
            imgOverlay.id = 'img-overlay';
            targetImage.parentElement.appendChild(imgOverlay);
        }

        function imgZoomOut() {
            if (!isZoomedIn) {
                return;
            }
            var zoomedIn = document.querySelector('.zoomed-in');
            // remove style
            zoomedIn.style = "";
            setTimeout(function () {
                zoomedIn.parentElement.style.width = "";
                zoomedIn.parentElement.style.maxWidth = "";
                zoomedIn.classList.remove('zoomed-in');
                document.getElementById('img-overlay').remove();
            }, 375);
            isZoomedIn = false;
        }

        document.addEventListener('click', function (e) {
            if (e.target.id === 'img-overlay') {
                imgZoomOut();
            }
        });

        window.onscroll = function () {
            console.log('scroll');
            imgZoomOut();
        };

        window.onresize = function () {
            imgZoomOut();
        }
    }();

    // lightbox
    (function () {
        var lightboxes = document.querySelectorAll('.lightbox');

        if (!lightboxes.length) {
            return;
        }
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
                resizeTimer = setTimeout(() => {
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
        if ("ontouchstart" in document.documentElement) {
            volumeProgress.parentElement.style.display = "none";
        }

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
        volumeProgress.addEventListener('mousedown', function (e) {
            // prevents selecting
            e.preventDefault();
            // enables mousemove while on mouse down (dragging)
            isVolumeControlOnMouseDown = true;
            setNewVolume(e);

            // Listens to mousemove while on mousedown (dragging)
            document.onmousemove = function (e) {
                // changes volume progress bar while dragging
                if (isVolumeControlOnMouseDown) {
                    e.preventDefault();
                    setNewVolume(e);
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
        function setNewVolume(e) {
            var newVolume = (e.pageX - volumeProgress.getBoundingClientRect().left) / volumeProgress.clientWidth;
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