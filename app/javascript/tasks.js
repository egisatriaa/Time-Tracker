document.addEventListener('turbo:load', function() {
  let taskIndex = document.querySelectorAll('#tasks .input-group').length;
  const tasksDiv = document.getElementById('tasks');
  const newTaskName = document.getElementById('new-task-name');
  const userId = document.querySelector('.container').dataset.userId; // Get the current user's ID from the data attribute

  newTaskName.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newTaskName.value.trim() !== "") {
        const taskTemplate = `
          <div class="input-group py-3 border-bottom">
            <div class="input-group-prepend">
              <button class="btn btn-outline-danger remove-task" type="button">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="form-control task-name">${newTaskName.value}</div>
            <input type="hidden" name="project[tasks_attributes][${taskIndex}][name]" id="project_tasks_attributes_${taskIndex}_name" value="${newTaskName.value}">
            <input type="hidden" name="project[tasks_attributes][${taskIndex}][user_id]" id="project_tasks_attributes_${taskIndex}_user_id" value="${userId}">
            <input type="hidden" name="project[tasks_attributes][${taskIndex}][_destroy]" id="project_tasks_attributes_${taskIndex}__destroy" value="false">
          </div>
        `;
        tasksDiv.insertAdjacentHTML('beforeend', taskTemplate);
        taskIndex++;
        newTaskName.value = "";
      }
    }
  });

  tasksDiv.addEventListener('click', function(e) {
    if (e.target && e.target.matches('button.remove-task, button.remove-task i')) {
      e.preventDefault();
      const taskDiv = e.target.closest('.input-group');
      taskDiv.querySelector('input[type="hidden"][name*="_destroy"]').value = '1';
      taskDiv.style.display = 'none';
    }
  });
});
