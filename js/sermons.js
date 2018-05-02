document.addEventListener("DOMContentLoaded", function() {
    var backTop = function() {
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
    };

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