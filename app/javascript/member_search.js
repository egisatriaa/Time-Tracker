document.addEventListener("DOMContentLoaded", function() {
    const searchUserInput = document.getElementById("searchUser");
    const userDropdown = document.getElementById("userDropdown");
    const selectedMembersList = document.getElementById("selectedMembers");
    const existingMembersList = document.getElementById("existingMembers");
    let currentProjectId = null; // Deklarasi variabel di luar fungsi
  
    // Ketika modal dibuka, ambil anggota yang ada
    document.getElementById("members").addEventListener("show.bs.modal", function(event) {
        const button = event.relatedTarget; // Tombol yang memicu modal
        currentProjectId = button.getAttribute('data-project-id'); // Ambil projectId dari tombol
  
        console.log("Project ID:", currentProjectId); // Log untuk memeriksa nilai
  
        if (!currentProjectId) {
            console.error("Project ID is missing!"); // Log error
            return; // Keluar dari fungsi jika ID tidak valid
        }
  
        // Mengambil anggota proyek
        fetch(`/projects/${currentProjectId}/members`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(members => {
                existingMembersList.innerHTML = ''; // Kosongkan daftar anggota yang ada
                members.forEach(member => {
                    const listItem = document.createElement('li');
                    listItem.className = "list-group-item";
                    listItem.textContent = `${member.username} (${member.email})`;
  
                    // Tambahkan tombol remove untuk setiap anggota
                    const removeButton = document.createElement('button');
                    removeButton.className = "btn btn-sm btn-danger float-end remove-member";
                    removeButton.setAttribute("data-user-id", member.id);
                    removeButton.textContent = "Remove";
                    removeButton.addEventListener('click', function() {
                        removeMember(member.id); // Panggil fungsi untuk menghapus anggota
                    });
  
                    listItem.appendChild(removeButton);
                    existingMembersList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error("Error fetching members:", error);
            });
    });
  
    // Logika untuk pencarian pengguna
    searchUserInput.addEventListener("input", function() {
        const query = searchUserInput.value.trim();
        if (query) {
            fetch(`/users/search?query=${query}`)
                .then(response => response.json())
                .then(users => {
                    userDropdown.innerHTML = '';
                    users.forEach(user => {
                        const userItem = document.createElement('li');
                        userItem.className = "dropdown-item user-item";
                        userItem.setAttribute("data-user-id", user.id);
                        userItem.setAttribute("data-username", user.username);
                        userItem.setAttribute("data-email", user.email);
                        userItem.innerHTML = `
                            <div class="d-flex align-items-center">
                                <div class="rounded-circle bg-light d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;">
                                    <span class="fw-bold text-dark">${user.username[0].toUpperCase()}</span>
                                </div>
                                <div class="ms-3">
                                    <p class="mb-0 fw-bold">${user.username}</p>
                                    <p class="mb-0 text-muted" style="font-size: 0.9rem;">${user.email}</p>
                                </div>
                            </div>
                        `;
                        userItem.addEventListener('click', function() {
                            addUserToSelected(user);
                        });
                        userDropdown.appendChild(userItem);
                    });
                    userDropdown.style.display = 'block';
                });
        } else {
            userDropdown.style.display = 'none';
        }
    });
  
    function addUserToSelected(user) {
        const existingItems = selectedMembersList.querySelectorAll('.user-item');
        const alreadySelected = Array.from(existingItems).some(item => item.dataset.userId === user.id.toString());
        if (!alreadySelected) {
            const listItem = document.createElement('li');
            listItem.className = "list-group-item user-item";
            listItem.dataset.userId = user.id;
            listItem.innerHTML = `${user.username} <button class="btn btn-sm btn-danger remove-member" data-user-id="${user.id}">Remove</button>`;
            selectedMembersList.appendChild(listItem);
            userDropdown.style.display = 'none';
            attachRemoveEvent(listItem);
        }
    }
  
    function attachRemoveEvent(listItem) {
        listItem.querySelector('.remove-member').addEventListener('click', function() {
            listItem.remove();
        });
    }
  
    // Fungsi untuk menghapus anggota
    function removeMember(userId) {
        fetch(`/projects/${currentProjectId}/delete_member`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ user_id: userId }) // Kirim user_id sebagai bagian dari body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                alert(data.message);
                // Refresh the existing members list
                const event = new Event('show.bs.modal', { relatedTarget: { getAttribute: () => currentProjectId } });
                document.getElementById("members").dispatchEvent(event); // Re-fetch members after deletion
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error("Error removing member:", error);
        });
    }
  
    // Simpan anggota yang dipilih
    document.getElementById("saveMembersBtn").addEventListener("click", function() {
        console.log("Saving members for Project ID:", currentProjectId); // Log untuk memeriksa projectId yang akan digunakan
  
        if (!currentProjectId) {
            alert("Project ID is missing!"); // Tampilkan alert jika projectId tidak ada
            return; // Hentikan eksekusi jika projectId tidak valid
        }
  
        const selectedUserIds = Array.from(selectedMembersList.querySelectorAll('.user-item'))
            .map(item => item.dataset.userId);
  
        if (selectedUserIds.length === 0) {
            alert("Please select at least one member."); // Tampilkan alert jika tidak ada anggota yang dipilih
            return; // Hentikan eksekusi jika tidak ada anggota yang dipilih
        }
  
        fetch(`/projects/${currentProjectId}/add_members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ user_ids: selectedUserIds.join(',') })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                alert(data.message);
                $('#members').modal('hide'); // Tutup modal setelah sukses
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error("Error saving members:", error);
        });
    });
  });
  