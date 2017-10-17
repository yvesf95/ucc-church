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
        closer.addEventListener('click', function (e) {
            e.preventDefault();
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

    var dropdownBtns = document.querySelectorAll('.dropdown-btn');
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
        try {
            var carousel = document.querySelector('.carousel');
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
        } catch (error) {
            return;
        }
    }

    // accordion
    accordion();

    function accordion() {
        try {
            var accordion = document.querySelector('.accordion');
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
        } catch (error) {
            return;
        }
    }

    // the sermon player (bottom sheet)
    var sermonPlayer = document.getElementById('sermon-player');
    // the sermon track (mp3 file)
    var sermonTrack = document.getElementById('sermon-track');
    // waits for meta data to be loaded
    sermonTrack.addEventListener('loadedmetadata', function () {
        // shows player
        var showPlayer = document.getElementById('show-player');
        showPlayer.addEventListener('click', function (e) {
            e.preventDefault();
            sermonPlayer.classList.add('open');
            playOrPause();
        });

        // hides player
        var hidePlayer = document.getElementById('hide-player');
        hidePlayer.addEventListener('click', function (e) {
            e.preventDefault();
            sermonPlayer.classList.remove('open');
        });

        // plays or pauses the track
        var playButton = document.getElementById('play-button');
        playButton.addEventListener('click', playOrPause);

        function playOrPause() {
            if (!sermonTrack.paused && !sermonTrack.ended) {
                sermonTrack.pause();
                playButton.firstElementChild.textContent = "play_circle_outline";
                showPlayer.firstElementChild.textContent = "play_circle_outline";
            } else {
                sermonTrack.play();
                playButton.firstElementChild.textContent = "pause_circle_outline";
                showPlayer.firstElementChild.textContent = "pause_circle_outline";
            }
        }

        // mutes or unmutes the volume of the track
        var volumeButton = document.getElementById('volume-button');
        volumeButton.addEventListener('click', muteOrUnmute);

        function muteOrUnmute() {
            if (sermonTrack.muted) {
                sermonTrack.muted = false;
                volumeButton.firstElementChild.textContent = "volume_up";
            } else {
                sermonTrack.muted = true;
                volumeButton.firstElementChild.textContent = "volume_off";
            }
        }

        // sets the current time
        var currentTime = document.getElementById('current-time');
        currentTime.textContent = ("0" + parseInt(sermonTrack.currentTime / 60)).slice(-2) + ":" + ("0" + parseInt(sermonTrack.currentTime % 60)).slice(-2);

        // sets the full duration
        var fullDuration = document.getElementById('full-duration');
        fullDuration.textContent = ("0" + parseInt(sermonTrack.duration / 60)).slice(-2) + ":" + ("0" + parseInt(sermonTrack.duration % 60)).slice(-2);

        var trackProgress = document.getElementById('track-progress');
        var timeBuffered = document.getElementById('time-buffered');
        var timeCurrent = document.getElementById('time-current');
        var timeFloat = document.getElementById('time-float');
        var trackHandle = document.getElementById('track-handle');


        // shows time float on mouse move (hover)
        trackProgress.addEventListener('mousemove', function (e) {
            timeFloat.style.left = e.pageX - trackProgress.getBoundingClientRect().left + "px";
            var targetTime = (e.pageX - trackProgress.getBoundingClientRect().left) * sermonTrack.duration / trackProgress.clientWidth;
            timeFloat.textContent = ("0" + parseInt(targetTime / 60)).slice(-2) + ":" + ("0" + parseInt(targetTime % 60)).slice(-2);
        });

        // adds event on mouse down
        trackProgress.addEventListener('mousedown', function (e) {
            // makes the progress bar draggable after mouse down
            trackProgress.onmousemove = function (e) {
                var size = e.pageX - trackProgress.getBoundingClientRect().left + "px";
                timeCurrent.style.width = size;
                trackHandle.style.left = size;
            };

            // sets the new current time on mouse leave(when mouse goes out of progress bar) and removes mousemove(draggable) and mouseleave
            trackProgress.onmouseleave = function (e) {
                var newTime = (e.pageX - trackProgress.getBoundingClientRect().left) * sermonTrack.duration / trackProgress.clientWidth;
                if (newTime < 0) {
                    newTime = 0;
                } else if (newTime > sermonTrack.duration) {
                    newTime = sermonTrack.duration;
                }
                sermonTrack.currentTime = newTime;
                trackProgress.onmousemove = null;
                trackProgress.onmouseleave = null;
            };
        });

        // sets new current time on mouse up (click) and removes mousemove(draggable) and mouseleave
        trackProgress.addEventListener('mouseup', function (e) {
            var newTime = (e.pageX - trackProgress.getBoundingClientRect().left) * sermonTrack.duration / trackProgress.clientWidth;
            if (newTime < 0) {
                newTime = 0;
            } else if (newTime > sermonTrack.duration) {
                newTime = sermonTrack.duration;
            }
            sermonTrack.currentTime = newTime;
            trackProgress.onmousemove = null;
            trackProgress.onmouseleave = null;
        });

        // updates current time and progress bar 
        sermonTrack.ontimeupdate = function () {
            if (sermonTrack.ended) {
                playButton.firstElementChild.textContent = "play_circle_outline";
                showPlayer.firstElementChild.textContent = "play_circle_outline";
            }
            currentTime.textContent = ("0" + parseInt(sermonTrack.currentTime / 60)).slice(-2) + ":" + ("0" + parseInt(sermonTrack.currentTime % 60)).slice(-2);
            var size = sermonTrack.currentTime / sermonTrack.duration * trackProgress.clientWidth + "px";
            timeCurrent.style.width = size;
            trackHandle.style.left = size;
        };

        var volumeControl = document.getElementById('volume-control');
        var volumeCurrent = document.getElementById('volume-current');
        var volumeHandle = document.getElementById('volume-handle');

        sermonTrack.volume = 0.2;
        volumeCurrent.style.width = sermonTrack.volume * 100 + "%";
        volumeHandle.style.left = sermonTrack.volume * 100 + "%";

        volumeControl.addEventListener('mousedown', function (e) {
            volumeControl.onmousemove = function (e) {
                var size = e.pageX - volumeControl.getBoundingClientRect().left;
                if (size < 0) {
                    size = 0;
                }
                size = size + "px";
                volumeCurrent.style.width = size;
                volumeHandle.style.left = size;
                var newVolume = (e.pageX - volumeControl.getBoundingClientRect().left) / volumeControl.clientWidth;
                if (newVolume < 0) {
                    newVolume = 0;
                } else if (newVolume > 1) {
                    newVolume = 1;
                }
                sermonTrack.volume = newVolume;
            };

            volumeControl.onmouseleave = function (e) {
                var newVolume = (e.pageX - volumeControl.getBoundingClientRect().left) / volumeControl.clientWidth;
                if (newVolume < 0) {
                    newVolume = 0;
                } else if (newVolume > 1) {
                    newVolume = 1;
                }
                sermonTrack.volume = newVolume;
                volumeControl.onmousemove = null;
                volumeControl.onmouseleave = null;
            };
        });

        // sets new current time on mouse up (click) and removes mousemove(draggable) and mouseleave
        volumeControl.addEventListener('mouseup', function (e) {
            var newVolume = (e.pageX - volumeControl.getBoundingClientRect().left) / volumeControl.clientWidth;
            if (newVolume < 0) {
                newVolume = 0;
            } else if (newVolume > 1) {
                newVolume = 1;
            }
            sermonTrack.volume = newVolume;
            volumeControl.onmousemove = null;
            volumeControl.onmouseleave = null;
        });

        sermonTrack.onvolumechange = function () {
            if (sermonTrack.volume !== 0 && !sermonTrack.muted) {
                volumeButton.firstElementChild.textContent = "volume_up";
            } else {
                volumeButton.firstElementChild.textContent = "volume_off";
            }
            volumeCurrent.style.width = sermonTrack.volume * 100 + "%";
            volumeHandle.style.left = sermonTrack.volume * 100 + "%";
        };
    });


    // check if HTML imports are supported
    if ('import' in document.createElement('link')) {
        // HTML imports are supported!
        console.log("HTML imports are supported!");
    } else {
        // HTML imports are not supported.
        console.log("HTML imports are not supported!");
    }

    // get current date and time for search form
    var timestamps = document.querySelectorAll('.timestamp');
    timestamps.forEach(function (timestamp) {
        timestamp.textContent = new Date();
    });
});