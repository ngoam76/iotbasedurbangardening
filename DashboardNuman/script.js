document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar');

    closeBtn.addEventListener('click', () => {
        sidebar.classList.toggle('minimized');
    });
});
