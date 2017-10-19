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
    // get current time element
    var currentTime = document.getElementById('current-time');

    // fires if track is playing
    sermonTrack.addEventListener('playing', function () {
        playButton.firstElementChild.textContent = "pause_circle_outline";
        showPlayer.firstElementChild.textContent = "pause_circle_outline";
    });

    // fires if track is paused
    sermonTrack.addEventListener('pause', function () {
        playButton.firstElementChild.textContent = "play_circle_outline";
        showPlayer.firstElementChild.textContent = "play_circle_outline";
    });

    // fires when duration is changed
    sermonTrack.addEventListener('durationchange', function () {
        // sets the full duration
        var fullDuration = document.getElementById('full-duration');
        fullDuration.textContent = ("0" + parseInt(sermonTrack.duration / 60)).slice(-2) + ":" + ("0" + parseInt(sermonTrack.duration % 60)).slice(-2);
    });

    // fires when current time is changed
    sermonTrack.addEventListener('timeupdate', function () {
        // convert to minutes and seconds ex. 00:01
        currentTime.textContent = ("0" + parseInt(sermonTrack.currentTime / 60)).slice(-2) + ":" + ("0" + parseInt(sermonTrack.currentTime % 60)).slice(-2);
        // computes size of progress bar 
        var size = sermonTrack.currentTime / sermonTrack.duration * trackProgress.clientWidth + "px";
        // updates current time and progress bar 
        timeCurrent.style.width = size;
        trackHandle.style.left = size;
    });

    // fires when volume is changed
    sermonTrack.addEventListener('volumechange', function () {
        if (sermonTrack.volume !== 0 && !sermonTrack.muted) {
            // volume is not muted and not zero
            volumeButton.firstElementChild.textContent = "volume_up";
        } else {
            // volume is muted and 0
            volumeButton.firstElementChild.textContent = "volume_off";
        }
        // updates volume bar
        volumeCurrent.style.width = sermonTrack.volume * 100 + "%";
        volumeHandle.style.left = sermonTrack.volume * 100 + "%";
    });

    sermonTrack.addEventListener('progress', function () {
        var duration = sermonTrack.duration;
        if (duration > 0) {
            for (var i = 0; i < sermonTrack.buffered.length; i++) {
                if (sermonTrack.buffered.start(sermonTrack.buffered.length - 1 - i) < sermonTrack.currentTime) {
                    timeBuffered.style.width = (sermonTrack.buffered.end(sermonTrack.buffered.length - 1 - i) / duration) * 100 + "%";
                    break;
                }
            }
        }
    });

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
        } else {
            sermonTrack.play();
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

    var trackProgress = document.getElementById('track-progress');
    var timeBuffered = document.getElementById('time-buffered');
    var timeCurrent = document.getElementById('time-current');
    var timeFloat = document.getElementById('time-float');
    var trackHandle = document.getElementById('track-handle');
    var isTrackProgressOnMouseDown = false;

    // shows time float on mouse move (hover)
    trackProgress.addEventListener('mousemove', function (e) {
        // sets time float position on mouse position
        timeFloat.style.left = e.pageX - trackProgress.getBoundingClientRect().left + "px";
        var targetTime = (e.pageX - trackProgress.getBoundingClientRect().left) * sermonTrack.duration / trackProgress.clientWidth;
        // shows the time of where the mouse position
        timeFloat.textContent = ("0" + parseInt(targetTime / 60)).slice(-2) + ":" + ("0" + parseInt(targetTime % 60)).slice(-2);
    });

    // listens to mouse down on track progress bar
    trackProgress.addEventListener('mousedown', function (e) {
        // prevents selecting
        e.preventDefault();
        // enables mousemove while on mouse down (dragging)
        isTrackProgressOnMouseDown = true;
        setNewTime(e);

        document.onmouseup = function () {
            // removes mousemove after mouseup
            isTrackProgressOnMouseDown = false;
            document.onmouseup = null;
            document.onmousemove = null;
        };

        document.onmousemove = function (e) {
            // changes track progress bar while dragging
            if (isTrackProgressOnMouseDown) {
                e.preventDefault();
                setNewTime(e);
            }
        };
    });

    function setNewTime(e) {
        var newTime = (e.pageX - trackProgress.getBoundingClientRect().left) * sermonTrack.duration / trackProgress.clientWidth;
        if (newTime >= 0 && newTime <= sermonTrack.duration) {
            sermonTrack.currentTime = newTime;
        }
    }

    // volume
    var volumeProgress = document.getElementById('volume-progress');
    var volumeCurrent = document.getElementById('volume-current');
    var volumeHandle = document.getElementById('volume-handle');
    var isVolumeControlOnMouseDown = false;

    // set initial volume
    sermonTrack.volume = 0.2;

    // listens to mouse down on volume progress bar
    volumeProgress.addEventListener('mousedown', function (e) {
        // prevents selecting
        e.preventDefault();
        // enables mousemove while on mouse down (dragging)
        isVolumeControlOnMouseDown = true;
        setNewVolume(e);

        document.onmouseup = function () {
            // removes mousemove after mouseup
            isVolumeControlOnMouseDown = false;
            document.onmouseup = null;
            document.onmousemove = null;
        };

        document.onmousemove = function (e) {
            // changes volume progress bar while dragging
            if (isVolumeControlOnMouseDown) {
                e.preventDefault();
                setNewVolume(e);
            }
        };
    });

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