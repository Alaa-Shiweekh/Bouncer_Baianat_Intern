document.querySelectorAll('.page').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelector('.active')?.classList.remove('active');
        this.classList.add('active');
    });
});
