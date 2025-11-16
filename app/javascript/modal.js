document.addEventListener("turbo:load", function () {
    document.body.addEventListener("click", function (event) {
        const modalLabel = document.getElementById("exampleModalLabel");
        const logTaskDateInput = document.getElementById("log_task_date");
        const logTaskForm = document.getElementById("log-task-form");
        const logTaskSubmit = document.getElementById("log-task-submit");
        const modalDate = new Date().toISOString().split('T')[0]; // Define modalDate based on the current date

        if (event.target.matches("#open-modal-edit")) {
            let log_id = event.target.getAttribute("value");
            fetch(`log_tasks/${log_id}`)
                .then(response => response.json())
                .then(data => {
                    // Set project-select value
                    document.getElementById("project-select").value = data.logTask.task.project.id;

                    // Fetch tasks related to the selected project
                    if (data.logTask.task.project.id) {
                        fetch(`/projects/${data.logTask.task.project.id}/tasks`)
                            .then(response => response.json())
                            .then(tasksData => {
                                let taskList = '<option value="">Select Task</option>';
                                tasksData.tasks.forEach(task => {
                                    taskList += `<option value="${task.id}">${task.name}</option>`;
                                });
                                const taskSelect = document.getElementById("task-select");
                                taskSelect.innerHTML = taskList;

                                // After populating the task dropdown, set the selected task
                                taskSelect.value = data.logTask.task.id; // Set the selected task
                            })
                            .catch(error => console.error('Error fetching tasks:', error));
                    } else {
                        document.getElementById("task-select").innerHTML = '<option value=""></option>'; // Kosongkan task jika tidak ada project
                    }

                    // Set other form fields
                    document.getElementById("log_task_notes").value = data.logTask.notes;
                    document.getElementById("log_task_timer").value = data.logTask.timer;
                    logTaskSubmit.value = "Update";
                });

            modalLabel.innerHTML = `Edit time entry for ${modalDate}`;
            logTaskDateInput.value = modalDate;
            logTaskForm.action = `log_tasks/${log_id}`;
            logTaskForm.method = "PATCH";

            // Remove existing delete button if any to prevent duplication
            const existingDeleteButton = document.getElementById("log-task-delete");
            if (existingDeleteButton) {
                existingDeleteButton.remove();
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn btn-danger ";
            deleteButton.textContent = "Delete";
            deleteButton.id = "log-task-delete";
            deleteButton.addEventListener("click", function () {
                fetch(`log_tasks/${log_id}`, {
                    method: "DELETE",
                    headers: {
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                }).then(() => {
                    window.location.reload();
                });
            });

            const actionModalLogTask = document.getElementById("action-modal-logTask");
            actionModalLogTask.appendChild(deleteButton);

            logTaskSubmit.addEventListener("click", function () {
                window.location.reload();
            });
        }
    });
});
