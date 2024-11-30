function toggleView(id) {
    document.querySelectorAll('#content > div').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#content > div').forEach(el => el.classList.add('hidden'));
});
