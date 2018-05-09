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
                    document.getElementById("dev-keyverse").innerHTML =
                        element.keyverse;
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
                        chipImg.src =
                            "img/pastors/" + getSpeakerImage(prop.speaker);
                        chip.textContent = prop.speaker;

                        inner.appendChild(card.cloneNode(true));
                    });
                    monthlyEl.appendChild(section);
                }
            }
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
});