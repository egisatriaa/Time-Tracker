document.addEventListener('turbo:load', function() {
    const projectSelect = document.getElementById('project-select');
    const taskSelect = document.getElementById('task-select');

    const timerInput = document.querySelector('input[name="log_task[timer]"]');
    

    projectSelect.addEventListener('change', function() {
        const projectId = this.value;
        
        if (projectId) {
            fetch(`/projects/${projectId}/tasks`)
                .then(response => response.json())
                .then(data => {
                    let taskList = '<option value="">Select Task</option>';
                    data.tasks.forEach(task => {
                        taskList += `<option value="${task.id}">${task.name}</option>`;
                    });
                    taskSelect.innerHTML = taskList;
                })
                .catch(error => console.error('Error fetching tasks:', error));
        } else {
            taskSelect.innerHTML = '<option value="">Select Task</option>'; // Kosongkan task jika tidak ada project
        }
    });

    timerInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Hanya izinkan angka
    
        // Jika input lebih dari 4 karakter, batasi hingga 6 karakter termasuk ":"
        if (value.length > 5) {
            value = value.slice(0, 6);
        }
    
        // Menambahkan ":" setelah dua angka terakhir
        if (value.length > 2) {
            value = value.slice(0, value.length - 2) + ':' + value.slice(value.length - 2);
        }
    
        // Memastikan bagian menit tidak melebihi 59
        if (value.includes(':')) {
            let parts = value.split(':');
            if (parts[1] > 59) {
                parts[1] = '59';
                value = parts.join(':');
            }
        }
    
        e.target.value = value;
    });
})
