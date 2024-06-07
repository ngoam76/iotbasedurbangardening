document.addEventListener('DOMContentLoaded', () => {
    const toggleBtnLeft = document.getElementById('toggle-btn-left');
    const sidebarLeft = document.getElementById('sidebar-left');
    const toggleBtnRight = document.getElementById('toggle-btn-right');
    const sidebarRight = document.getElementById('sidebar-right');
    const alertBox = document.querySelector('header .alert');
    const closeAlertBtn = document.getElementById('close-alert');
    const openAlertBtn = document.getElementById('open-alert');
    const header = document.querySelector('header');

    toggleBtnLeft.addEventListener('click', () => {
        sidebarLeft.classList.toggle('minimized');
    });

    toggleBtnRight.addEventListener('click', () => {
        sidebarRight.classList.toggle('minimized');
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