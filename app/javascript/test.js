let timers = {};
document.body.addEventListener("click", function (event) {
    if (event.target.matches("#btn-timer")) {
        let log_id = event.target.getAttribute("value");
        let log_task_timer_element = document.getElementById("timer-" + log_id);
        let log_task = document.getElementById("log-task-" + log_id);

        let daysRow = document.getElementById("days");
        let dayElement = daysRow.getElementsByClassName("text-dark")[0].getElementsByTagName("span")[0];
        let totalDay = dayElement.textContent.trim();

        let test = dayElements[(currentDate.getDay() + 6) % 7].total;
        let test1 = test.textContent;

        let [hourDay, minuteDay, secondDay] = test1.split(':').map(Number);
        console.log(hourDay, minuteDay, secondDay);

        let totalDayLogs = document.getElementById("day-total");

        let totalWeek = document.getElementById("week-total");

        let [hourWeek, minuteWeek, secondWeek] = totalWeek.innerHTML.split(':').map(Number);

        if (!timers[log_id]) {
            let log_task_timer = log_task_timer_element.innerHTML.trim();
            let [hour, minute, second] = log_task_timer.split(':').map(Number);

            timers[log_id] = {
                intervalId: null,
                dayIntervalId: null,
                weekIntervalId: null,
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
                log_timer: log_task_timer_element,
                dayElements: test,
                dayLogElement: totalDayLogs,
                weekElement: totalWeek,
                button: null,
            };
        }
        
        startTimer(timers, log_id, log_task, event.target);
    }
});

function startTimer(timers, log_id, log_task, button) {
    if (!timers[log_id].running) {
        // Start or resume the timer
        timers[log_id].intervalId = setInterval(() => {
            updateLogTimer(timers, log_id, log_task, button);
        }, 1000);

        timers[log_id].dayIntervalId = setInterval(() => {
            updateDayTimer(timers, log_id);
        }, 1000);

        timers[log_id].weekIntervalId = setInterval(() => {
            updateWeekTimer(timers, log_id);
        }, 1000);

        // Update the button to "Stop"
        button.classList.add("bg-dark", "text-white");
        button.innerHTML = `
            <i class="fa-solid fa-stop"></i>
            Stop
        `;
        log_task.style.backgroundColor = "#fff8f0";
        timers[log_id].running = true;

        // Save timer state to localStorage
        saveTimerState(log_id);
    } else {
        // Pause the timer
        clearInterval(timers[log_id].intervalId);
        clearInterval(timers[log_id].dayIntervalId);
        clearInterval(timers[log_id].weekIntervalId);

        // Update the button to "Start"
        button.classList.remove("bg-dark", "text-white");
        button.innerHTML = `
            <i class="fa-solid fa-play"></i>
            Start
        `;
        log_task.style.backgroundColor = "#fafafa";
        timers[log_id].running = false;

        // Remove timer state from localStorage
        removeTimerState(log_id);

        // Update database with current timer value
        updateDatabaseTimer(log_id, `${timers[log_id].hour.toString().padStart(2, '0')}:${timers[log_id].minute.toString().padStart(2, '0')}`);
    }
    button[log_id] = button.innerHTML;
}

function updateLogTimer(timers, log_id, log_task, button) {
    if (timers[log_id].second === 0) {
        if (timers[log_id].minute === 0) {
            if (timers[log_id].hour === 0) {
                button.classList.remove("bg-dark", "text-white");
                button.innerHTML = `
                    <i class="fa-solid fa-play"></i>
                    Start
                `;
                log_task.style.backgroundColor = "#fafafa";
                clearInterval(timers[log_id].intervalId);
                updateDatabaseTimer(log_id, '00:00');
                return;
            } else {
                timers[log_id].hour--;
                timers[log_id].minute = 59;
            }
        } else {
            timers[log_id].minute--;
        }
        timers[log_id].second = 59;
    } else {
        timers[log_id].second--;
    }

    // Format output untuk selalu menampilkan dua digit
    let formattedHour = timers[log_id].hour.toString().padStart(2, '0');
    let formattedMinute = timers[log_id].minute.toString().padStart(2, '0');
    let formattedSecond = timers[log_id].second.toString().padStart(2, '0');
    timers[log_id].log_timer.innerHTML = `${formattedHour}:${formattedMinute}:${formattedSecond}`;

    // Save timer state to localStorage
    saveTimerState(log_id);
}

function updateDayTimer(timers, log_id) {
    if (timers[log_id].secondDay === 0) {
        if (timers[log_id].minuteDay === 0) {
            if (timers[log_id].hourDay === 0) {
                clearInterval(timers[log_id].dayIntervalId);
                return;
            } else {
                timers[log_id].hourDay--;
                timers[log_id].minuteDay = 59;
            }
        } else {
            timers[log_id].minuteDay--;
        }
        timers[log_id].secondDay = 59;
    } else {
        timers[log_id].secondDay--;
    }

    let formattedHourDay = timers[log_id].hourDay.toString().padStart(2, '0');
    let formattedMinuteDay = timers[log_id].minuteDay.toString().padStart(2, '0');
    let formattedSecondDay = timers[log_id].secondDay.toString().padStart(2, '0');
    timers[log_id].dayElements.innerHTML = `${formattedHourDay}:${formattedMinuteDay}:${formattedSecondDay}`;
    timers[log_id].dayLogElement.innerHTML = `${formattedHourDay}:${formattedMinuteDay}:${formattedSecondDay}`;
}

function updateWeekTimer(timers, log_id) {
    if (timers[log_id].secondWeek === 0) {
        if (timers[log_id].minuteWeek === 0) {
            if (timers[log_id].hourWeek === 0) {
                clearInterval(timers[log_id].weekIntervalId);
                return;
            } else {
                timers[log_id].hourWeek--;
                timers[log_id].minuteWeek = 59;
            }
        } else {
            timers[log_id].minuteWeek--;
        }
        timers[log_id].secondWeek = 59;
    } else {
        timers[log_id].secondWeek--;
    }

    let formattedHourWeek = timers[log_id].hourWeek.toString().padStart(2, '0');
    let formattedMinuteWeek = timers[log_id].minuteWeek.toString().padStart(2, '0');
    let formattedSecondWeek = timers[log_id].secondWeek.toString().padStart(2, '0');
    timers[log_id].weekElement.innerHTML = `${formattedHourWeek}:${formattedMinuteWeek}:${formattedSecondWeek}`;
}

function saveTimerState(log_id) {
    const timerState = {
        hour: timers[log_id].hour,
        minute: timers[log_id].minute,
        second: timers[log_id].second,
        hourDay: timers[log_id].hourDay,
        minuteDay: timers[log_id].minuteDay,
        secondDay: timers[log_id].secondDay,
        hourWeek: timers[log_id].hourWeek,
        minuteWeek: timers[log_id].minuteWeek,
        secondWeek: timers[log_id].secondWeek,
        running: timers[log_id].running,
        log_timer: timers[log_id].log_timer.innerHTML,
        dayElements: timers[log_id].dayElements,
        dayLogElement: timers[log_id].dayLogElement.innerHTML,
        weekElement: timers[log_id].weekElement,
        button: timers[log_id].button
    };
    localStorage.setItem(`timer-${log_id}`, JSON.stringify(timerState));
}

function removeTimerState(log_id) {
    localStorage.removeItem(`timer-${log_id}`);
}

function updateDatabaseTimer(log_id, timer) {
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

function restoreTimers(logList) {
    logList.forEach(log => {
        const log_id = log.id;
        const savedState = JSON.parse(localStorage.getItem(`timer-${log_id}`));
        const log_task_timer_element = document.getElementById("timer-" + log_id);
        if (savedState) {
            timers[log_id] = {
                intervalId: null,
                dayIntervalId: null,
                weekIntervalId: null,
                hour: savedState.hour,
                minute: savedState.minute,
                second: savedState.second,
                hourDay: savedState.hourDay,
                minuteDay: savedState.minuteDay,
                secondDay: savedState.secondDay,
                hourWeek: savedState.hourWeek,
                minuteWeek: savedState.minuteWeek,
                secondWeek: savedState.secondWeek,
                running: savedState.running,
                log_timer: log_task_timer_element, 
                dayElements: document.querySelector(`#timer-${log_id} .total-day span`),
                dayLogElement: document.querySelector(`#day-total`),
                weekElement: document.querySelector(`#week-total`),
                button: savedState.button
            };
            
            if (savedState.running) {
                const log_task = document.getElementById("log-task-" + log_id);
                const button = document.querySelector(`#btn-timer[value="${log_id}"]`);
                startTimer(timers, log_id, log_task, button);
            }
        }
    });
}
