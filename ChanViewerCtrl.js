angular.module('gvyweb').controller('ChanViewerCtrl', [
    '$scope', '$http',
    function($scope, $http) {
        $scope.msPerPx = 30000;
        $scope.times = [];
        $scope.timeHeight = "0";

        function msToMinSec(ms) {
            const sec = Math.round(ms/1000);
            return Math.floor(sec/60)+":"+(100+sec%60).toString().substring(1);
        }
        $scope.msToMinSec = msToMinSec;

        // gvyhome time standard is EST without daylight savings time correction
        // apply offset to change GMT to EST
        const estOffset = 5*60*60*1000;
        function fixDate(tm) {
            tm.setTime(tm.getTime() - estOffset);
            return tm;
        }
        const today = fixDate(new Date());
        // shift to midnight
        const oneDayMs = 24*60*60*1000;
        today.setTime(today.getTime() - today.getTime() % oneDayMs);

        // these objects specify choices for query dropdown
        $scope.queries = [{
            label: "Winter Season (Heat)",
            // three heat zones, water heater, boiler, hw pump, outdoor temp
            ch: "ma1)inp^1^2^4^8^16^512,ow1)temp"
        },{
            label: "Summer Season (A/C)",
            // three cool zones, water heater, boiler, hw pump, outdoor temp
            ch: "ma1)inp^1^16^32^64^128^512,ow1)temp"
        },{
            label: "Water",
            // water heater, boiler, hw pump, well pump
            ch: "ma1)inp^1^16^256^512"
        },{
            label: "Weather",
            ch: "ow1)temp)humid"
        },{
            label: "Network Outage",
            ch: "*.net)trouble^1,*.boot)"
        }];
        // default query based on current season in CT
        const month = today.getMonth();
        $scope.query = $scope.queries[(month >= 6 && month <= 9) ? 1 : 0];

        // channel information
        $scope.chanInfo = {
            "ma1)inp^1": {
                name: "Water Heater",
                columnClassName: "water",
                valueClassName: "heat",
                order: 31
            },
            "ma1)inp^2": {
                name: "MBR Heat",
                columnClassName: "",
                valueClassName: "heat",
                order: 20
            },
            "ma1)inp^4": {
                name: "1st Floor Heat",
                columnClassName: "",
                valueClassName: "heat",
                order: 21
            },
            "ma1)inp^8": {
                name: "2nd Floor Heat",
                columnClassName: "",
                valueClassName: "heat",
                order: 22
            },
            "ma1)inp^16": {
                name: "Boiler",
                columnClassName: "",
                valueClassName: "heat",
                order: 23
            },
            "ma1)inp^32": {
                name: "MBR Cool",
                columnClassName: "",
                valueClassName: "cool",
                order: 10,
            },
            "ma1)inp^64": {
                name: "1st Floor Cool",
                columnClassName: "",
                valueClassName: "cool",
                order: 11,
            },
            "ma1)inp^128": {
                name: "2nd Floor Cool",
                columnClassName: "",
                valueClassName: "cool",
                order: 12
            },
            "ma1)inp^256": {
                name: "Well Pump",
                columnClassName: "water",
                valueClassName: "cool",
                order: 40
            },
            "ma1)inp^512": {
                name: "HW Pump",
                columnClassName: "water",
                valueClassName: "heat",
                order: 32
            },
            "ow1)temp": {
                name: "Outdoor Temp",
                columnClassName: "",
                valueClassName: "neutral",
                order: 50
            },
            "ow1)humid": {
                name: "Outdoor Humdity",
                columnClassName: "",
                valueClassName: "neutral",
                order: 51
            }
        };

        $scope.getChanOrder = function(chan) {
            return $scope.chanInfo[chan.id].order;
        };

        function dateToString(date) {
            // ignore locale of server computer, which could be anywhere
            // force locale to US date format
            // time zone is GMT because we've already subtracted EST offset
            return date.toLocaleDateString('en-US', {
                timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            });
        }

        // note startDate, endDate ranges are inclusive
        // that means range of days includes endDate

        // make a week object
        // these objects specify choices for week dropdown
        function makeWeek(startDate, endDate) {
            return {
                label: "Week of " + dateToString(startDate),
                tStart: startDate.toISOString().substring(0, 10),
                nDays: Math.floor(1 + (endDate.getTime() - startDate.getTime()) / oneDayMs)
            };
        }

        // make array of week objects
        function makeWeeks(startDate, endDate) {
            const weeks = [];
            const date = new Date(startDate.getTime());
            const endpointMs = endDate.getTime() + oneDayMs;
            while (date.getTime() < endpointMs) {
                const dow = date.getUTCDay();
                const saturday = new Date(date.getTime() + ((7 - dow) - 1)*oneDayMs);
                if (saturday.getTime() < endpointMs) {
                    // week up to saturday fits
                    weeks.push(makeWeek(date, saturday));
                    date.setTime(saturday.getTime() + oneDayMs);
                } else {
                    // final partial week
                    weeks.push(makeWeek(date, endDate));
                    date.setTime(endpointMs);
                }
            }
            return weeks;
        }

        // make weeks array with temporary entry for today until we get db status
        $scope.weeks = [];
        $scope.weeks.push(makeWeek(today, today));
        $scope.week = $scope.weeks[0];

        // get database status which includes range of dates for which we have data
        $http.get("https://groovymarty.com/gvyhome/status")
            .then(res => {
                // start at earliest day for which data is available
                const startDate = fixDate(new Date(res.data.firstDay));
                // throw away old weeks
                $scope.weeks.splice(0);
                // make new weeks from known start date through today
                // add to weeks array in reverse order (most recent first)
                makeWeeks(startDate, today)
                    .reverse()
                    .forEach(week => $scope.weeks.push(week));
                // set default choice
                $scope.week = $scope.weeks[0];
            })
            .catch(err => {
                console.log("failed to get status", err);
            });

        // query result
        $scope.qr = null;

        // submit button clicked
        $scope.doSubmit = function() {
            // query the database
            let url = "https://groovymarty.com/gvyhome/data/chans";
            url += "?ch=" + $scope.query.ch;
            url += "&start=" + $scope.week.tStart;
            url += "&ndays=" + $scope.week.nDays;
            $http.get(url)
                .then(res => {
                    $scope.qr = res.data;
                    addDefaultChanInfo();
                    genTimes();
                })
                .catch(err => {
                    console.log("query failed", err);
                });
        };

        // make sure chan info exists for all channels in current query report
        function addDefaultChanInfo() {
            $scope.qr.chans.forEach(chan => {
                if (!$scope.chanInfo[chan.id]) {
                    $scope.chanInfo[chan.id] = {
                        name: chan.id,
                        className: "neutral",
                        order: 999
                    };
                }
            });
        }

        // format concise date/time string
        function dateToShortString(date) {
            const hour = date.getUTCHours();
            const min = date.getUTCMinutes();
            if (!hour && !min) {
                // midnight, display date
                return date.toLocaleDateString('en-US', {
                    timeZone: 'UTC', month: 'short', day: 'numeric'
                });
            } else if (!min) {
                // top of hour, display hour am/pm
                if (hour < 12) {
                    return hour + " am";
                } else if (hour == 12) {
                    return "Noon";
                } else {
                    return (hour-12) + " pm";
                }
            } else {
                // otherwise display HH:MM in 12-hour time
                hour %= 12;
                return (hour || 12) + ":" + (100+min).toString().substring(1) + "am";
            }
        }

        // generate times for current query report
        function genTimes() {
            const qr = $scope.qr;
            const tm = fixDate(new Date(qr.t));
            const endpointMs = tm.getTime() + qr.totalMs;
            // for now 1 hr increments, later compute this based on zoom factor
            const timeBumpMs = 60*60*1000;
            const timeHeight = timeBumpMs / $scope.msPerPx;
            $scope.times.splice(0);
            let h = 0;
            while (tm.getTime() < endpointMs) {
                $scope.times.push(dateToShortString(tm));
                tm.setTime(tm.getTime() + timeBumpMs);
                h += timeHeight;
            }
            $scope.timeHeight = timeHeight + "px";
            $scope.totTimeHeight = h + "px";
            $scope.totPanelHeight = h+100 + "px";
        }
    }
]);
