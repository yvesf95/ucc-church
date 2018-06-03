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
        var docFrag = document.createDocumentFragment();

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
            chipText = card.querySelector(".chip span"),
            playLink = card.querySelector(".play-link"),
            downloadLink = card.querySelector(".download-link"),
            audio = document.getElementsByTagName("audio")[0];

        fetchJSONfile("sermons.json", function(data) {
            var yearlyData = groupBy(data, "year");
            for (const y in yearlyData) {
                const year = yearlyData[y],
                    yearStr = y.substr(1, y.length);
                yearLabel.textContent = yearStr;
                docFrag.appendChild(yearLabel.cloneNode(true));

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
                        chipText.textContent = prop.speaker;

                        playLink.setAttribute("href", "audio/" + prop.mp3);
                        downloadLink.setAttribute("href", "audio/" + prop.mp3);

                        inner.appendChild(card.cloneNode(true));
                    });
                    docFrag.appendChild(section);
                }
            }
            monthlyEl.appendChild(docFrag);
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
    var SermonPlayer = function(player) {
        if (!player) {
            return;
        }

        // the sermon track (mp3 file)
        var audio = player.getElementsByTagName("audio")[0],
            playButton = player.querySelector("#play-button");

        // Labels
        var currentTime = player.querySelector("#current-time"),
            fullDuration = player.querySelector("#full-duration"),
            title = player.querySelector("#title"),
            subtitle = player.querySelector("#subtitle");

        // Progress Bar
        var trackProgress = player.querySelector("#track-progress"),
            timeBufferedBar = player.querySelector("#time-buffered-bar"),
            timeElapsedBar = player.querySelector("#time-elapsed-bar"),
            timeElapsedFloat = player.querySelector("#time-elapsed-float"),
            trackHandle = player.querySelector("#track-handle");

        // Volume
        var volumeButton = player.querySelector("#volume-button"),
            volumeProgress = player.querySelector("#volume-progress"),
            volumeCurrent = player.querySelector("#volume-current"),
            volumeHandle = player.querySelector("#volume-handle");

        // #region Audio Events
        // Fires when the browser starts looking for the audio/video
        audio.addEventListener("loadstart", function() {
            // initialize everything
            trackHandle.style.left = 0;
            timeElapsedBar.style.width = 0;
            timeBufferedBar.style.width = 0;
            currentTime.textContent = "00:00";
            fullDuration.textContent = "00:00";
            playButton.firstElementChild.textContent = "play_circle_outline";
        });
        // Fires when the duration of the audio is changed
        audio.addEventListener("durationchange", function() {
            // Sets the full duration
            fullDuration.textContent = parseTime(audio.duration);
        });
        // Fires when the browser can start playing the audio
        audio.addEventListener("canplay", function() {
            audio.play();
            updateTimeBuffered();
        });
        // Fires when the browser can play through the audio without stopping for buffering
        audio.addEventListener("canplaythrough", updateTimeBuffered);
        // Fires when the browser is downloading the audio
        audio.addEventListener("progress", updateTimeBuffered);
        function updateTimeBuffered() {
            var length = audio.buffered.length;
            // Checks if has buffered parts of the audio
            if (length > 0) {
                var duration = audio.duration;
                if (duration > 0) {
                    /**
                     * Check all start of the buffered parts starting from the highest,
                     * then compare each one to the current time
                     */
                    for (var i = 0; i < length; i++) {
                        var index = length - 1 - i;
                        if (audio.buffered.start(index) < audio.currentTime) {
                            timeBufferedBar.style.width =
                                audio.buffered.end(index) / duration * 100 + "%";
                            break;
                        }
                    }
                }
            }
        }
        // Fires when the audio is playing after having been paused or stopped for buffering
        audio.addEventListener("playing", function() {
            playButton.firstElementChild.textContent = "pause_circle_outline";
        });
        // Fires when the audio has been paused
        audio.addEventListener("pause", function() {
            playButton.firstElementChild.textContent = "play_circle_outline";
        });
        // Fires when the current playback position has changed
        audio.addEventListener("timeupdate", function() {
            // Convert to minutes and seconds ex. 00:01
            currentTime.textContent = parseTime(audio.currentTime);
            // Computes size of time elapsed progress bar
            var size = audio.currentTime / audio.duration * trackProgress.clientWidth + "px";
            // Updates time elapsed progress bar
            timeElapsedBar.style.width = size;
            trackHandle.style.left = size;
        });
        // Fires when volume is changed
        audio.addEventListener("volumechange", function() {
            if (audio.volume !== 0 && !audio.muted) {
                // Volume is not muted and not zero
                volumeButton.firstElementChild.textContent = "volume_up";
            } else {
                // Volume is muted and 0
                volumeButton.firstElementChild.textContent = "volume_off";
            }
            // Updates volume bar
            volumeCurrent.style.width = audio.volume * 100 + "%";
            volumeHandle.style.left = audio.volume * 100 + "%";
        });
        // #endregion

        // Set initial volume
        audio.volume = 0;
        audio.volume = 0.1;

        // #region Controls
        // Plays or pauses the track
        playButton.addEventListener("click", function() {
            if (!audio.paused && !audio.ended) {
                audio.pause();
            } else {
                audio.play();
            }
        });
        // Mutes or unmutes the volume of the track
        volumeButton.addEventListener("click", function() {
            if (audio.muted) {
                audio.muted = false;
                volumeButton.firstElementChild.textContent = "volume_up";
            } else {
                audio.muted = true;
                volumeButton.firstElementChild.textContent = "volume_off";
            }
        });
        // #endregion

        // #region trackProgress Events
        addTouchDragListener(trackProgress, function(pageX) {
            setNewTime(pageX);
            // sets time float position on mouse position
            setTimeFloatPosition(pageX);
        });
        // Mousedown - ready for mouse drag on track-progress
        trackProgress.addEventListener("mousedown", function(e) {
            mouseDrag(e, setNewTime);
        });

        // Mouseover - show time-float
        trackProgress.addEventListener("mouseover", function() {
            trackProgress.classList.add("hover");
        });

        // Mousemove - sets time-float position and label on move
        trackProgress.addEventListener("mousemove", function(e) {
            setTimeFloatPosition(e.pageX);
        });

        // Mouseleave - hide time-float
        trackProgress.addEventListener("mouseleave", function() {
            trackProgress.classList.remove("hover");
        });

        function setTimeFloatPosition(pageX) {
            timeElapsedFloat.style.left = pageX - trackProgress.getBoundingClientRect().left + "px";
            var targetTime =
                (pageX - trackProgress.getBoundingClientRect().left) *
                audio.duration /
                trackProgress.clientWidth;
            // shows the time of where the mouse position
            timeElapsedFloat.textContent = parseTime(targetTime);
        }
        function setNewTime(pageX) {
            var newTime =
                (pageX - trackProgress.getBoundingClientRect().left) *
                audio.duration /
                trackProgress.clientWidth;
            if (newTime >= 0 && newTime <= audio.duration) {
                audio.currentTime = newTime;
            }
        }
        // #endregion

        // #region volumeProgress Events
        addTouchDragListener(volumeProgress, setNewVolume);
        volumeProgress.addEventListener("mousedown", function(e) {
            mouseDrag(e, setNewVolume);
        });

        function setNewVolume(pageX) {
            var newVolume =
                (pageX - volumeProgress.getBoundingClientRect().left) / volumeProgress.clientWidth;
            if (newVolume < 0) {
                newVolume = 0;
            }
            if (newVolume > 1) {
                newVolume = 1;
            }
            audio.volume = newVolume;
        }
        // #endregion

        // #region Scope functions
        function mouseDrag(e, fn) {
            // prevents selecting while dragging
            e.preventDefault();
            var isOnMouseDown = true;
            fn(e.pageX);

            // Listener placed on document to allow going out of the element while dragging
            // Listens to mousemove while on mousedown (dragging)
            document.onmousemove = function(e) {
                if (isOnMouseDown) {
                    // prevents selecting while dragging
                    e.preventDefault();
                    fn(e.pageX);
                }
            };

            // Listens to mouseup (done dragging)
            document.onmouseup = function() {
                // removes mousemove after mouseup
                isOnMouseDown = false;
                document.onmouseup = null;
                document.onmousemove = null;
            };
        }
        function addTouchDragListener(el, fn) {
            el.addEventListener("touchstart", function(e) {
                // Prevents firing other events (mouse events)
                e.preventDefault();
                el.classList.add("hover");
                fn(e.changedTouches[0].pageX);
            });

            el.addEventListener("touchmove", function(e) {
                // Prevents firing other events (mouse events)
                e.preventDefault();
                fn(e.changedTouches[0].pageX);
            });

            el.addEventListener("touchend", function() {
                el.classList.remove("hover");
            });
        }
        function computeNewBarWidth(newPos, rect) {
            return (newPos - rect.left) / rect.width;
        }
        function parseTime(time) {
            return (
                ("0" + parseInt(time / 60)).slice(-2) + ":" + ("0" + parseInt(time % 60)).slice(-2)
            );
        }
        // #endregion
    };

    // the sermon player (bottom sheet)
    var player = document.getElementById("sermon-player");
    SermonPlayer(player);

    var audio = document.getElementsByTagName("audio")[0],
        title = document.getElementById("title"),
        subtitle = document.getElementById("subtitle"),
        playerDownload = player.querySelector(".download-link");

    var a = setInterval(function() {
        if (complete) {
            var playLinks = document.querySelectorAll(".play-link");
            playLinks.forEach(pl => {
                pl.addEventListener("click", e => {
                    e.preventDefault();
                    var card = pl.closest(".card"),
                        cardTitle = card.querySelector(".card-title"),
                        cardSubtitle = card.querySelector(".card-subtitle"),
                        downloadLink = card.querySelector(".download-link");
                    title.textContent = cardTitle.textContent;
                    subtitle.textContent = cardSubtitle.textContent;
                    playerDownload.setAttribute("href", downloadLink.href);
                    audio.src = pl.href;
                    audio.load();

                    player.style.display = "block";
                    player.classList.add("open");
                });
            });
            clearInterval(a);
        }
    }, 500);
});
