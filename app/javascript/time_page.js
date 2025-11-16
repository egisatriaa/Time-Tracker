let fetchedDays = {};
let dayElements, currentDate, modalDate;
let totalWeekFormatted = ""; // Global variable to store the formatted total week minutes

document.addEventListener("turbo:load", function () {
    const currentDateElement = document.getElementById("current-date");
    const arrowLeft = document.getElementById("arrow-left");
    const arrowRight = document.getElementById("arrow-right");
    const returnToday = document.getElementById("return");
    const openModal = document.getElementById("open-modal-create");
    const modalLabel = document.getElementById("exampleModalLabel");
    const logTaskDateInput = document.getElementById("log_task_date");
    const logTaskForm = document.getElementById("log-task-form");
    const logTaskSubmit = document.getElementById("log-task-submit");
    const logTaskList = document.getElementById("tasks");

    currentDate = new Date();
    modalDate = "";
    const today = new Date();

    dayElements = {
        0: { day: document.getElementById("day-mon"), total: document.getElementById("total-mon"), clockIcon: document.getElementById("clock-mon") },
        1: { day: document.getElementById("day-tue"), total: document.getElementById("total-tue"), clockIcon: document.getElementById("clock-tue") },
        2: { day: document.getElementById("day-wed"), total: document.getElementById("total-wed"), clockIcon: document.getElementById("clock-wed") },
        3: { day: document.getElementById("day-thu"), total: document.getElementById("total-thu"), clockIcon: document.getElementById("clock-thu") },
        4: { day: document.getElementById("day-fri"), total: document.getElementById("total-fri"), clockIcon: document.getElementById("clock-fri") },
        5: { day: document.getElementById("day-sat"), total: document.getElementById("total-sat"), clockIcon: document.getElementById("clock-sat") },
        6: { day: document.getElementById("day-sun"), total: document.getElementById("total-sun"), clockIcon: document.getElementById("clock-sun") }
    };

    function updateDateDisplay() {
        const options = { weekday: 'long', day: '2-digit', month: 'short' };
        let displayDate = currentDate.toLocaleDateString('en-US', options);
        
        // Reorder date format to "weekday, day month"
        const [weekday, month, day] = displayDate.split(' ');
        displayDate = `${weekday} ${day} ${month}`;
        modalDate = displayDate;

        if (currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth()) {
            displayDate = `<strong>Today:</strong> ${displayDate}`;
            returnToday.style.display = "none";
        } else {
            returnToday.style.display = "inline";
        }

        currentDateElement.innerHTML = displayDate;
    }

    function updateDayHighlight() {
        if (!timers) {
            Object.keys(timers).forEach(timerKey => {
                const timer = timers[timerKey];
                Object.keys(dayElements).forEach(dayKey => {
                    if ((timer.date.getDay() + 6) % 7 === parseInt(dayKey)) {
                        dayElements[dayKey].day.classList.add('border-bottom', 'border-warning', 'text-dark');
                    } else {
                        dayElements[dayKey].day.classList.remove('border-bottom', 'border-warning', 'text-dark');
                        element.day.classList.add('text-muted');
                    }
                });
            });
        } else {
            Object.values(dayElements).forEach(element => {
                element.day.classList.remove('border-bottom', 'border-warning', 'text-dark');
                element.day.classList.add('text-muted');
            });
        }

        const currentDay = (currentDate.getDay() + 6) % 7;
        if (dayElements[currentDay]) {
            dayElements[currentDay].day.classList.add('border-bottom', 'border-warning', 'text-dark');
            dayElements[currentDay].day.classList.remove('text-muted');
        }
    }

    function convertTimeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function convertMinutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    function showLogs() {
        const dateKey = currentDate.toISOString().split('T')[0];

        if (fetchedDays[dateKey]) {
            renderLogs(fetchedDays[dateKey]);
            return;
        } else {
            fetch(`log_tasks/${dateKey}/log_list`)
                .then(response => response.json())
                .then(data => {
                    fetchedDays[dateKey] = data.logList;
                    renderLogs(data.logList);
                })
                .catch(error => console.error('Error fetching tasks:', error));
        }
    }

    function renderLogs(logList) {
        let logListHtml = '';
        let totalTimeDay = 0;

        if (logList.length > 0) {
            logList.forEach(log => {
                let projectDisplay = log.task.project.name;
                if (log.task.project.code) {
                    projectDisplay = `[${log.task.project.code}] ${log.task.project.name}`;
                }

                if (timers[log.id] && timers[log.id].running) {
                    logListHtml += `
                        <div id="log-task-${log.id}" class="border-bottom border-top border-muted container py-3" style="background-color: #fff8f0;">
                            <div id="log-task-list" class="row">
                                <div class="col-8">
                                    <div>
                                        <span class="fw-bold">
                                            ${projectDisplay}
                                        </span>
                                        (${log.user.username})
                                    </div>
                                    <div>${log.task.name}</div>
                                    <small class="text-muted">${log.notes}</small>
                                </div>
                                <div id="timer-${log.id}" class="col-1 d-flex justify-content-end align-items-center fw-bold">
                                    ${String(timers[log.id].hour).padStart(2, '0')}:${String(timers[log.id].minute).padStart(2, '0')}:${String(timers[log.id].second).padStart(2, '0')}
                                </div>
                                <div class="col-2 d-flex justify-content-center align-items-center gap-1">
                                    <div id="btn-timer" class="bg-dark text-white border rounded-3 py-2 px-4 fs-5" value="${log.id}" style="cursor: pointer; background-color: ##fff8f0;">
                                        <i class="fa-regular fa-clock"></i>
                                        Stop
                                    </div>
                                </div>
                                <div class="col-1 d-flex align-items-center">
                                    <div id="open-modal-${log.id}" data-bs-toggle="modal" data-bs-target="#exampleModal" class="border rounded-3 py-1 px-2" style="background-color: #fafafa; cursor: pointer;">Edit</div>
                                </div>
                            </div>
                        </div>`;
                } else if (timers[log.id] && !timers[log.id].running) {
                    logListHtml += `
                    <div id="log-task-${log.id}" class="border-bottom border-top border-muted container py-3">
                        <div id="log-task-list" class="row">
                            <div class="col-8">
                                <div>
                                    <span class="fw-bold">
                                        ${projectDisplay}
                                    </span>
                                    (${log.user.username})
                                </div>
                                <div>${log.task.name}</div>
                                <small class="text-muted">${log.notes}</small>
                            </div>
                            <div id="timer-${log.id}" class="col-1 d-flex justify-content-end align-items-center fw-bold">
                                ${String(timers[log.id].hour).padStart(2, '0')}:${String(timers[log.id].minute).padStart(2, '0')}:${String(timers[log.id].second).padStart(2, '0')}
                            </div>
                            <div class="col-2 d-flex justify-content-center align-items-center gap-1">
                                <div id="btn-timer" class="border rounded-3 py-2 px-4 fs-5" value="${log.id}" style="cursor: pointer;">
                                    <i class="fa-regular fa-clock"></i>
                                    Start
                                </div>
                            </div>
                            <div class="col-1 d-flex align-items-center">
                                <div id="open-modal-edit" value="${log.id}" data-bs-toggle="modal" data-bs-target="#exampleModal" class="border rounded-3 py-1 px-2" style="background-color: #fafafa; cursor: pointer;">Edit</div>
                            </div>
                        </div>
                    </div>`;
                } else {
                    logListHtml += `
                    <div id="log-task-${log.id}" class="border-bottom border-top border-muted container py-3">
                        <div id="log-task-list" class="row">
                            <div class="col-8">
                                <div>
                                    <span class="fw-bold">
                                        ${projectDisplay}
                                    </span>
                                    (${log.user.username})
                                </div>
                                <div>${log.task.name}</div>
                                <small class="text-muted">${log.notes}</small>
                            </div>
                            <div id="timer-${log.id}" class="col-1 d-flex justify-content-end align-items-center fw-bold">
                                ${log.timer}
                            </div>
                            <div class="col-2 d-flex justify-content-center align-items-center gap-1">
                                <div id="btn-timer" class="border rounded-3 py-2 px-4 fs-5" value="${log.id}" style="cursor: pointer;">
                                    <i class="fa-regular fa-clock"></i>
                                    Start
                                </div>
                            </div>
                            <div class="col-1 d-flex align-items-center">
                                <div id="open-modal-edit" value="${log.id}" data-bs-toggle="modal" data-bs-target="#exampleModal" class="border rounded-3 py-1 px-2" style="background-color: #fafafa; cursor: pointer;">Edit</div>
                            </div>
                        </div>
                    </div>`;
                }

                totalTimeDay += convertTimeToMinutes(log.timer);
            });
            const totalFormatted = dayElements[(currentDate.getDay() + 6) % 7].total.textContent;

            logListHtml += `
                <div class="container py-3 fw-bold">
                    <div class="row">
                        <div class="col-8 d-flex justify-content-end">
                            Total:
                        </div>
                        <div id="day-total-${(currentDate.getDay() + 6) % 7}" class="col-1 d-flex justify-content-end align-items-center">
                            ${totalFormatted}
                        </div>
                    </div>
                </div>`;
        } else {
            logListHtml += `
                <div class="col-12 d-flex justify-content-center align-items-center flex-column" style="height: 300px; background-color: #efefef">
                    <div class="text-center">"It always seems impossible until it's done"</div>
                    <div class="mt-2 text-center">- Nelson Mandela</div>
                </div>`;
        }
        logTaskList.innerHTML = logListHtml;
    }

    function showWeeklyLogs() {
        const startOfWeek = new Date();
        startOfWeek.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
        let totalWeekMinutes = 0;
        const promises = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateKey = date.toISOString().split('T')[0];

            if (fetchedDays[dateKey]) {
                renderWeeklyLog(date, fetchedDays[dateKey]);
                totalWeekMinutes += calculateTotalMinutes(fetchedDays[dateKey]);
            } else {
                const promise = fetch(`log_tasks/${dateKey}/log_list`)
                    .then(response => response.json())
                    .then(data => {
                        fetchedDays[dateKey] = data.logList;
                        renderWeeklyLog(date, data.logList);
                        totalWeekMinutes += calculateTotalMinutes(data.logList);
                    })
                    .catch(error => console.error('Error fetching tasks:', error));

                promises.push(promise);
            }
        }

        Promise.all(promises)
            .then(() => {
                totalWeekFormatted = convertMinutesToTime(totalWeekMinutes); // Update the global variable
                document.getElementById("week-total").textContent = totalWeekFormatted;
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    function renderWeeklyLog(date, logList) {
        let totalTimeDay = calculateTotalMinutes(logList);
        const totalFormatted = convertMinutesToTime(totalTimeDay);
        dayElements[(date.getDay() + 6) % 7].total.textContent = totalFormatted;
    }

    function calculateTotalMinutes(logList) {
        return logList.reduce((total, log) => total + convertTimeToMinutes(log.timer), 0);
    }

    function loadLogsForSpecificDay(date) {
        currentDate = new Date(date);
        updateDateDisplay();
        updateDayHighlight();
        showLogs();
    }

    // Tambahkan event listener untuk setiap dayElement agar dapat ditekan
    Object.values(dayElements).forEach((element, index) => {
        element.day.addEventListener("click", function () {
            const dayOffset = (currentDate.getDay() + 6) % 7 - index;
            const specificDate = new Date(currentDate);
            specificDate.setDate(currentDate.getDate() - dayOffset);
            loadLogsForSpecificDay(specificDate);
        });
        element.day.style.cursor = "pointer";
    });

    arrowLeft.addEventListener("click", function () {
        // Pindah ke minggu sebelumnya
        currentDate.setDate(currentDate.getDate() - 7);
        updateDateDisplay();
        updateDayHighlight();
        showWeeklyLogs(); // Panggil untuk memperbarui log mingguan
    });

    arrowRight.addEventListener("click", function () {
        // Pindah ke minggu berikutnya
        currentDate.setDate(currentDate.getDate() + 7);
        updateDateDisplay();
        updateDayHighlight();
        showWeeklyLogs(); // Panggil untuk memperbarui log mingguan
    });

    returnToday.addEventListener("click", function () {
        currentDate = new Date();
        updateDateDisplay();
        updateDayHighlight();
        showWeeklyLogs();
    });

    openModal.addEventListener("click", function () {
        modalLabel.innerHTML = `New time entry for ${modalDate}`;
        logTaskDateInput.value = currentDate.toISOString().split('T')[0];
        logTaskForm.action = "/create_log_task"; // Reset form action to create
        logTaskForm.method = "POST";
        document.getElementById("project-select").value = '';
        document.getElementById("task-select").value = '';
        document.getElementById("task-select").innerHTML = '<option value="">Select Task</option>';
        document.getElementById("log_task_notes").value = '';
        document.getElementById("log_task_timer").value = '';
        logTaskSubmit.value = "Start timer";
        logTaskSubmit.addEventListener("click", function () {
            window.location.reload();
        });
        if (document.getElementById("log-task-delete")) {
            document.getElementById("log-task-delete").remove();
        }
    });

    updateDateDisplay();
    updateDayHighlight();
    showWeeklyLogs();
    showLogs();
});
