document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const alertBox = document.querySelector('header .alert');
    const closeAlertBtn = document.getElementById('close-alert');
    const openAlertBtn = document.getElementById('open-alert');
    const header = document.querySelector('header');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('minimized');
    });

    closeAlertBtn.addEventListener('click', () => {
        alertBox.classList.add('hide');
        header.classList.add('hide');
        openAlertBtn.style.display = 'block';
    });

    openAlertBtn.addEventListener('click', () => {
        alertBox.classList.remove('hide');
        header.classList.remove('hide');
        openAlertBtn.style.display = 'none';
    });
});
