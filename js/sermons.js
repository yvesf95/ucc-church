var complete = false;

document.addEventListener("DOMContentLoaded", function() {
    var backTop = (function() {
        var container = document.getElementsByClassName("back-to-top-container")[0];
        var backToTopButton = document.getElementById("back-to-top-button");

        backToTopButton.addEventListener("click", function() {
            document.querySelector(this.dataset.target).scrollIntoView({
                behavior: "smooth"
            });
        });

        window.addEventListener("scroll", buttonPosition);

        function buttonPosition() {
            if (
                window.scrollY >= container.offsetTop &&
                window.scrollY + window.innerHeight < container.offsetTop + container.offsetHeight
            ) {
                backToTopButton.style.transform = "scale(1)";
                backToTopButton.style.opacity = 1;
                backToTopButton.style.position = "fixed";
            } else if (
                window.scrollY + window.innerHeight >=
                container.offsetTop + container.offsetHeight
            ) {
                backToTopButton.style.position = "absolute";
            } else {
                backToTopButton.style.opacity = 0;
                backToTopButton.style.transform = "scale(0)";
            }
        }
    })();

    var dev = (function() {
        var devotional = document.getElementById("morning-evening-devotional");

        if (!devotional) {
            return;
        }

        fetchJSONfile("morning-and-evening-master/m_e.json", function(data) {
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
                if (
                    element !== null &&
                    element.month === month &&
                    element.day === day &&
                    element.time === time
                ) {
                    console.log(element);
                    var bodyText = element.body.replace(/\n/g, "<br>");
                    document.getElementById("dev-body").innerHTML = bodyText;
                    document.getElementById("dev-keyverse").innerHTML = element.keyverse;
                }
            }
        });
    })();

    var sermons = (function() {
        var monthlyEl = document.getElementById("monthly-sermons");
        var seriesEl = document.getElementById("sermon-series");

        const SERMON_PATH = "img/sermon-images/";
        const SERMON_IMG = "image-not-available-3.jpg";

        var template = document.getElementsByTagName("template")[0],
            yearLabel = template.content.querySelector(".headline"),
            monthSection = template.content.getElementById("month"),
            monthLabel = monthSection.querySelector(".title"),
            card = template.content.getElementById("sermon-card"),
            cardMedia = card.querySelector(".card-media img"),
            cardMediaCover = card.querySelector(".card-media-cover img"),
            captionText = card.querySelector(".card-header .caption"),
            cardTitle = card.querySelector(".card-header .card-title"),
            cardSubtitle = card.querySelector(".card-header .card-subtitle"),
            series = card.querySelector(".card-header .subheading-1"),
            chipImg = card.querySelector(".chip img"),
            chip = card.querySelector(".chip span");

        fetchJSONfile("sermons.json", function(data) {
            var yearlyData = groupBy(data, "year");
            for (const y in yearlyData) {
                const year = yearlyData[y],
                    yearStr = y.substr(1, y.length);
                yearLabel.textContent = yearStr;
                monthlyEl.appendChild(yearLabel.cloneNode(true));

                var monthlyData = groupBy(year, "month");

                for (const m in monthlyData) {
                    const month = monthlyData[m],
                        monthNo = m.substr(1, m.length),
                        monthStr = convertMonthToString(monthNo);

                    monthSection.id = monthStr;
                    monthLabel.textContent = monthStr;

                    var section = monthSection.cloneNode(true),
                        inner = section.querySelector(".horizontal-list-inner");

                    month.forEach(prop => {
                        if (prop.cover !== "") {
                            cardMedia.src = SERMON_PATH + prop.cover;
                            cardMediaCover.src = SERMON_PATH + prop.cover;
                        } else {
                            cardMedia.src = SERMON_PATH + SERMON_IMG;
                            cardMediaCover.src = SERMON_PATH + SERMON_IMG;
                        }
                        captionText.textContent = prop.date;
                        cardTitle.textContent = prop.title;
                        cardSubtitle.textContent = prop.scripture;
                        // series.textContent = prop.series;
                        chipImg.src = "img/pastors/" + getSpeakerImage(prop.speaker);
                        chip.textContent = prop.speaker;

                        inner.appendChild(card.cloneNode(true));
                    });
                    monthlyEl.appendChild(section);
                }
            }
            complete = true;
        });
    })();

    function groupBy(objectArray, property) {
        return objectArray.reduce(function(acc, obj) {
            var key = "p" + obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }

    function convertMonthToString(month) {
        switch (month) {
            case "1":
                return "January";
            case "2":
                return "February";
            case "3":
                return "March";
            case "4":
                return "April";
            case "5":
                return "May";
            case "6":
                return "June";
            case "7":
                return "July";
            case "8":
                return "August";
            case "9":
                return "September";
            case "10":
                return "October";
            case "11":
                return "November";
            case "12":
                return "December";
            default:
                return "No Such Month";
        }
    }

    function getSpeakerImage(speaker) {
        var src;
        switch (speaker) {
            case "Pastor Billy Arcayan":
                src = "billy_300x300.jpg";
                break;
            case "Pastor Chad Dexter":
                src = "chad_300x300.jpg";
                break;
            case "Pastor Nicky Joya":
                src = "nicky_300x300.jpg";
                break;
            case "Pastor Romy Alag":
                src = "romy_300x300.jpg";
                break;
            default:
                src = "blank-profile-picture.png";
                break;
        }
        return src;
    }

    function fetchJSONfile(path, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
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
    // sermon player
    var sermonPlayer = function() {
        // the sermon player (bottom sheet)
        var sermonPlayer = document.getElementById("sermon-player");

        if (!sermonPlayer) {
            return;
        }

        // the sermon track (mp3 file)
        var sermonTrack = document.getElementById("sermon-track");
        // get current time element
        var currentTime = document.getElementById("current-time"),
            fullDuration = document.getElementById("full-duration");

        // Play Button
        var playButton = document.getElementById("play-button");
        var showPlayerButton = document.getElementById("show-player-button");
        var hidePlayerButton = document.getElementById("hide-player-button");

        // Progress Bar
        var trackProgress = document.getElementById("track-progress");
        var timeBufferedBar = document.getElementById("time-buffered-bar");
        var timeElapsedBar = document.getElementById("time-elapsed-bar");
        var timeElapsedFloat = document.getElementById("time-elapsed-float");
        var trackHandle = document.getElementById("track-handle");
        var isTrackProgressOnMouseDown = false;

        // Volume
        var volumeButton = document.getElementById("volume-button");
        var volumeProgress = document.getElementById("volume-progress");
        var volumeCurrent = document.getElementById("volume-current");
        var volumeHandle = document.getElementById("volume-handle");
        var isVolumeControlOnMouseDown = false;

        // #region Sermon Track Events

        /** Order of loading process
         * loadstart
         * durationchange
         * loadedmetadata
         * loadeddata
         * progress
         * canplay
         * canplaythrough
         */

        // Fires when the audio is playing after having been paused or stopped for buffering
        sermonTrack.addEventListener("playing", function() {
            console.log("playing");
            playButton.firstElementChild.textContent = "pause_circle_outline";
            showPlayerButton.firstElementChild.textContent = "pause_circle_outline";
            showPlayerButton.querySelector("span").textContent = "Pause";
        });

        // Fires when the audio has been paused
        sermonTrack.addEventListener("pause", function() {
            console.log("paused");
            playButton.firstElementChild.textContent = "play_circle_outline";
            showPlayerButton.firstElementChild.textContent = "play_circle_outline";
            showPlayerButton.querySelector("span").textContent = "Play";
        });

        // Fires when the duration of the audio is changed
        sermonTrack.addEventListener("durationchange", function() {
            // Sets the full duration
            fullDuration.textContent = parseTime(sermonTrack.duration);
        });

        // Fires when the current playback position has changed
        sermonTrack.addEventListener("timeupdate", function() {
            console.log("timeupdate");
            // Convert to minutes and seconds ex. 00:01
            currentTime.textContent = parseTime(sermonTrack.currentTime);
            // Computes size of time elapsed progress bar
            var size =
                sermonTrack.currentTime / sermonTrack.duration * trackProgress.clientWidth + "px";
            // Updates time elapsed progress bar
            timeElapsedBar.style.width = size;
            trackHandle.style.left = size;
        });

        // Fires when volume is changed
        sermonTrack.addEventListener("volumechange", function() {
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

        sermonTrack.addEventListener("loadstart", function() {
            timeElapsedBar.style.width = 0;
            trackHandle.style.left = 0;
            timeBufferedBar.style.width = 0;
            currentTime.textContent = "00:00";
            fullDuration.textContent = "00:00";
            playButton.firstElementChild.textContent = "play_circle_outline";
            showPlayerButton.firstElementChild.textContent = "play_circle_outline";
        });

        // Fires when the browser can start playing the audio
        sermonTrack.addEventListener("canplay", function() {
            // Add listener for when downloading track
            sermonTrack.play();
            updateTimeBuffered();
        });

        // Fires when the browser can play through the audio without stopping for buffering
        sermonTrack.addEventListener("canplaythrough", function() {
            // Update the time buffered bar when track can play everything
            updateTimeBuffered();
        });

        // Fires when the browser is downloading the audio
        sermonTrack.addEventListener("progress", function() {
            // Updates time buffered bar on download
            updateTimeBuffered();
        });

        function updateTimeBuffered() {
            var length = sermonTrack.buffered.length;
            // Checks if has buffered parts of the audio
            if (length > 0) {
                // Get the end position of the buffered range
                var bufferedEnd = sermonTrack.buffered.end(length - 1);
                var duration = sermonTrack.duration;
                if (duration > 0) {
                    // Computes and sets the size of time buffered bar
                    timeBufferedBar.style.width = bufferedEnd / duration * 100 + "%";
                }
            }
        }
        // #endregion

        // Set initial volume
        sermonTrack.volume = 0;
        sermonTrack.volume = 0.1;

        // Click Events

        sermonPlayer.style.display = "block";
        // Shows player
        showPlayerButton.addEventListener("click", function(e) {
            e.preventDefault();
            if (!sermonPlayer.classList.contains("open")) {
                var backTopButton = document.querySelector(".back-to-top-button");
                if (backTopButton) {
                    backTopButton.style.bottom = "72px";
                }
                sermonPlayer.style.display = "block";
                setTimeout(function() {
                    sermonPlayer.classList.add("open");
                }, 10);
            }
            playOrPause();
        });

        // Hides player
        hidePlayerButton.addEventListener("click", function(e) {
            e.preventDefault();
            sermonPlayer.classList.remove("open");
            var backTopButton = document.querySelector(".back-to-top-button");
            if (backTopButton) {
                backTopButton.style.bottom = "";
            }
            setTimeout(function() {
                sermonPlayer.style.display = "none";
            }, 400);
        });

        // Plays or pauses the track
        playButton.addEventListener("click", playOrPause);

        function playOrPause() {
            if (!sermonTrack.paused && !sermonTrack.ended) {
                sermonTrack.pause();
            } else {
                sermonTrack.play();
            }
        }

        // Mutes or unmutes the volume of the track
        volumeButton.addEventListener("click", function() {
            if (sermonTrack.muted) {
                sermonTrack.muted = false;
                volumeButton.firstElementChild.textContent = "volume_up";
            } else {
                sermonTrack.muted = true;
                volumeButton.firstElementChild.textContent = "volume_off";
            }
        });

        // Hover and Drag Events

        /** Order of events
         *  touchstart
         *  touchmove
         *  touchend
         *  mouseover
         *  mousemove
         *  mousedown
         *  mouseup
         *  click */

        // #region Touch Events

        // Touchstart - show time-float
        trackProgress.addEventListener("touchstart", function(e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            trackProgress.classList.add("hover");
            setNewTime(e.changedTouches[0].pageX);
            // sets time float position on mouse position
            setTimeFloatPosition(e.changedTouches[0].pageX);
        });

        // Touchmove - drag time-elapsed bar and time-float
        trackProgress.addEventListener("touchmove", function(e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            setNewTime(e.changedTouches[0].pageX);
            // sets time float position on mouse position
            setTimeFloatPosition(e.changedTouches[0].pageX);
        });

        // Touchend - hide time-float
        trackProgress.addEventListener("touchend", function() {
            trackProgress.classList.remove("hover");
        });
        // #endregion

        // #region Mouse Events
        // Mouseover - show time-float
        trackProgress.addEventListener("mouseover", function() {
            trackProgress.classList.add("hover");
        });

        // Mousemove - sets time-float position and label on move
        trackProgress.addEventListener("mousemove", function(e) {
            setTimeFloatPosition(e.pageX);
        });

        // Mousedown - ready for mouse drag on track-progress
        trackProgress.addEventListener("mousedown", function(e) {
            // prevents selecting
            e.preventDefault();
            // enables mousemove while on mouse down (dragging)
            isTrackProgressOnMouseDown = true;
            setNewTime(e.pageX);

            // Listener placed on document to allow going out of the progress bar while dragging
            document.onmousemove = function(e) {
                // changes track progress bar while dragging
                if (isTrackProgressOnMouseDown) {
                    // prevents selecting while dragging
                    e.preventDefault();
                    setNewTime(e.pageX);
                }
            };

            // Listener placed on document to listen to mouseup
            // outside of progress bar for indication of mouse drag
            document.onmouseup = function() {
                // removes mousemove after mouseup
                isTrackProgressOnMouseDown = false;
                document.onmouseup = null;
                document.onmousemove = null;
            };
        });

        // Mouseleave - hide time-float
        trackProgress.addEventListener("mouseleave", function() {
            trackProgress.classList.remove("hover");
        });
        // #endregion

        // Track Progress functions
        function setTimeFloatPosition(pageX) {
            timeElapsedFloat.style.left = pageX - trackProgress.getBoundingClientRect().left + "px";
            var targetTime =
                (pageX - trackProgress.getBoundingClientRect().left) *
                sermonTrack.duration /
                trackProgress.clientWidth;
            // shows the time of where the mouse position
            timeElapsedFloat.textContent = parseTime(targetTime);
        }

        function setNewTime(pageX) {
            var newTime =
                (pageX - trackProgress.getBoundingClientRect().left) *
                sermonTrack.duration /
                trackProgress.clientWidth;
            if (newTime >= 0 && newTime <= sermonTrack.duration) {
                sermonTrack.currentTime = newTime;
            }
        }

        // Listens to mouse down on volume progress bar
        // Touchstart - show time-float
        volumeProgress.addEventListener("touchstart", function(e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            volumeProgress.classList.add("hover");
            setNewVolume(e.changedTouches[0].pageX);
        });

        // Touchmove - drag time-elapsed bar and time-float
        volumeProgress.addEventListener("touchmove", function(e) {
            // Prevents firing other events (mouse events)
            e.preventDefault();
            setNewVolume(e.changedTouches[0].pageX);
        });

        // Touchend - hide time-float
        volumeProgress.addEventListener("touchend", function() {
            volumeProgress.classList.remove("hover");
        });

        volumeProgress.addEventListener("mousedown", function(e) {
            // prevents selecting
            e.preventDefault();
            // enables mousemove while on mouse down (dragging)
            isVolumeControlOnMouseDown = true;
            setNewVolume(e.pageX);

            // Listens to mousemove while on mousedown (dragging)
            document.onmousemove = function(e) {
                // changes volume progress bar while dragging
                if (isVolumeControlOnMouseDown) {
                    e.preventDefault();
                    setNewVolume(e.pageX);
                }
            };

            // Listens to mouseup (done dragging)
            document.onmouseup = function() {
                // removes mousemove after mouseup
                isVolumeControlOnMouseDown = false;
                document.onmouseup = null;
                document.onmousemove = null;
            };
        });

        // Volume functions
        function setNewVolume(pageX) {
            var newVolume =
                (pageX - volumeProgress.getBoundingClientRect().left) / volumeProgress.clientWidth;
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
            return (
                ("0" + parseInt(time / 60)).slice(-2) + ":" + ("0" + parseInt(time % 60)).slice(-2)
            );
        }
    };
    sermonPlayer();

    var audioSelectors = document.querySelectorAll(".play-link"),
        audio = document.getElementsByTagName("audio")[0],
        sermonTitle = document.getElementById("sermon-title"),
        sermonVerse = document.getElementById("sermon-verse");

    audioSelectors.forEach(as => {
        as.addEventListener("click", function(e) {
            e.preventDefault();
            sermonTitle.textContent = as.textContent;
            sermonVerse.textContent = as.textContent;
            audio.src = as.href;
            audio.load();
        });
    });
});
