let timers = {};
let hourDay, minuteDay, secondDay;
document.body.addEventListener("click", function (event) {
    if (event.target.matches("#btn-timer")) {
        let log_id = event.target.getAttribute("value");
        let log_task_timer_element = document.getElementById("timer-" + log_id);
        let log_task = document.getElementById("log-task-" + log_id);

        let daysRow = document.getElementById("days");
        let dayElement = daysRow.getElementsByClassName("text-dark")[0].getElementsByTagName("span")[0];
        let totalDay = dayElement.textContent.trim();

        let dayIndex = (currentDate.getDay() + 6) % 7;
        let test = dayElements[dayIndex].total;
        let test1 = test.textContent;

        let clockIcon = dayElements[dayIndex].clockIcon;
        console.log(timers);

        [hourDay, minuteDay, secondDay] = test1.split(':').map(Number);
        console.log(hourDay, minuteDay, secondDay);

        let totalWeek = document.getElementById("week-total");

        let [hourWeek, minuteWeek, secondWeek] = totalWeek.innerHTML.split(':').map(Number);

        // Stop any currently running timer except the one being toggled
        stopAllRunningTimers(log_id);

        if (!timers[log_id]) {
            let log_task_timer = log_task_timer_element.innerHTML.trim();
            let [hour, minute, second] = log_task_timer.split(':').map(Number);

            timers[log_id] = {
                logId: null,
                dayId: null,
                weekId: null,
                hour: hour,
                minute: minute,
                second: second || 0,
                hourDay: hourDay,
                minuteDay: minuteDay,
                secondDay: secondDay || 0,
                hourWeek: hourWeek,
                minuteWeek: minuteWeek,
                secondWeek: secondWeek || 0,
                running: false,
                date: currentDate,
                clockIcon: clockIcon,
                button: event.target,
            };
        }

        startTimer(timers, log_id, log_task, event.target);
    }
});

function stopAllRunningTimers(excludeLogId) {
    for (let key in timers) {
        if (key !== excludeLogId && timers[key].running) {
            clearInterval(timers[key].logId);
            clearInterval(timers[key].dayId);
            clearInterval(timers[key].weekId);
            timers[key].running = false;
            timers[key].clockIcon.style.display = "none";
            timers[key].button.classList.remove("bg-dark", "text-white");
            timers[key].button.innerHTML = `
                <i class="fa-regular fa-clock"></i>
                Start
            `;
            let log_task = document.getElementById("log-task-" + key);
            log_task.style.backgroundColor = "#fafafa";
            saveTimer(key, `${String(timers[key].hour).padStart(2, '0')}:${String(timers[key].minute).padStart(2, '0')}`);
        }
    }
}

function startTimer(timers, log_id, log_task, button) {
    if (timers[log_id].running) {
        clearInterval(timers[log_id].logId);
        clearInterval(timers[log_id].dayId);
        clearInterval(timers[log_id].weekId);
        timers[log_id].running = false;
        timers[log_id].clockIcon.style.display = "none";
        button.classList.remove("bg-dark", "text-white");
        button.innerHTML = `
            <i class="fa-regular fa-clock"></i>
            Start
        `;
        log_task.style.backgroundColor = "#fafafa";
        saveTimer(log_id, `${String(timers[log_id].hour).padStart(2, '0')}:${String(timers[log_id].minute).padStart(2, '0')}`);
    } else {
        updateTimer(log_id);

        timers[log_id].running = true;
        timers[log_id].clockIcon.style.display = "inline";
        button.classList.add("bg-dark", "text-white");
        button.innerHTML = `
            <i class="fa-regular fa-clock"></i>
            Stop
        `;
        log_task.style.backgroundColor = "#fff8f0";
    }
}

function updateTimer(log_id) {
    updateLogTimer(log_id);
    updateDayTimer(log_id);
    updateWeekTimer(log_id);
}

function updateLogTimer(log_id) {
    let timer = timers[log_id];
    timer.logId = setInterval(function () {
        let logTaskTimerElement = document.getElementById("timer-" + log_id);
        if (timer.second > 0) {
            timer.second--;
        } else {
            if (timer.minute > 0) {
                timer.second = 59;
                timer.minute--;
            } else {
                if (timer.hour > 0) {
                    timer.second = 59;
                    timer.minute = 59;
                    timer.hour--;
                } else {
                    clearInterval(timer.intervalId);
                    timer.running = false;
                    timer.button.textContent = "Start";
                    alert("Timer finished!");
                    return;
                }
            }
        }
        logTaskTimerElement.innerHTML = `${String(timer.hour).padStart(2, '0')}:${String(timer.minute).padStart(2, '0')}:${String(timer.second).padStart(2, '0')}`;
    }, 1000);
}

function updateDayTimer(log_id) {
    let timer = timers[log_id];
    let dayIndex = (timer.date.getDay() + 6) % 7;
    timer.dayId = setInterval(function () {
        let dayTimerElement = dayElements[dayIndex].total;
        let totalDayLogsElement = document.getElementById("day-total-" + dayIndex);
        if (timer.secondDay > 0) {
            timer.secondDay--;
        } else {
            if (timer.minuteDay > 0) {
                timer.secondDay = 59;
                timer.minuteDay--;
            } else {
                if (timer.hourDay > 0) {
                    timer.secondDay = 59;
                    timer.minuteDay = 59;
                    timer.hourDay--;
                } else {
                    resetDayTimer(log_id);
                }
            }
        }
        dayTimerElement.innerHTML = `${String(timer.hourDay).padStart(2, '0')}:${String(timer.minuteDay).padStart(2, '0')}:${String(timer.secondDay).padStart(2, '0')}`;
        totalDayLogsElement.innerHTML = `${String(timer.hourDay).padStart(2, '0')}:${String(timer.minuteDay).padStart(2, '0')}:${String(timer.secondDay).padStart(2, '0')}`;
    }, 1000);
}

function updateWeekTimer(log_id) {
    let timer = timers[log_id];
    timer.weekId = setInterval(function () {
        let totalWeekTimerElement = document.getElementById("week-total");
        if (timer.secondWeek > 0) {
            timer.secondWeek--;
        } else {
            if (timer.minuteWeek > 0) {
                timer.secondWeek = 59;
                timer.minuteWeek--;
            } else {
                if (timer.hourWeek > 0) {
                    timer.secondWeek = 59;
                    timer.minuteWeek = 59;
                    timer.hourWeek--;
                } else {
                    timer.hourWeek = 0;
                    timer.minuteWeek = 0;
                    timer.secondWeek = 0;
                }
            }
        }
        totalWeekTimerElement.innerHTML = `${String(timer.hourWeek).padStart(2, '0')}:${String(timer.minuteWeek).padStart(2, '0')}:${String(timer.secondWeek).padStart(2, '0')}`;
    }, 1000);
}

function resetDayTimer(log_id) {
    let timer = timers[log_id];
    timer.hourDay = 0;
    timer.minuteDay = 0;
    timer.secondDay = 0;
    timer.dayElements.innerHTML = `00:00:00`;
    timer.dayLogElement.innerHTML = `00:00:00`;
}

function saveTimer(log_id, timer) {
    fetch(`/log_tasks/${log_id}/update_timer`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ timer: timer })
    })
    .then(response => response.json())
    .catch(error => console.error('Error updating timer:', error));
}
