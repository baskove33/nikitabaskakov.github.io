/**
 * АВТОМАТИЗАЦИЯ
 * Скрипт заходит на страницу со всеми кейсами, считывает оттуда проекты
 * и показывает их в блоке "Смотрите также".
 */

// !!! ВАЖНО: Впиши сюда точное имя файла твоей страницы "Все кейсы" !!!
// Если файл называется "cases.html", напиши 'cases.html'
const CASES_PAGE_URL = 'all_cases.html'; // <-- Поменяй это, если файл называется иначе

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('related-projects');
    
    // Если на странице нет контейнера (мы не внутри кейса), ничего не делаем
    if (!container) return;

    // 1. Загружаем HTML-код страницы со всеми кейсами
    fetch(CASES_PAGE_URL)
        .then(response => {
            if (!response.ok) throw new Error('Не удалось найти файл со списком кейсов');
            return response.text();
        })
        .then(html => {
            // 2. Превращаем текст в DOM (виртуальную страницу)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 3. Ищем все карточки проектов (.project-tile) на той странице
            const tiles = doc.querySelectorAll('.project-tile');
            const projects = [];

            tiles.forEach(tile => {
                // Вытаскиваем данные прямо из твоей верстки
                const link = tile.getAttribute('href');
                const img = tile.querySelector('img')?.src;
                
                // Ищем заголовок и категорию по твоим классам
                const title = tile.querySelector('.text-xl')?.innerText.trim();
                const category = tile.querySelector('.text-xs')?.innerText.trim();

                if (link && title) {
                    projects.push({ title, category, link, img });
                }
            });

            // 4. Отрисовываем полученные данные
            renderRelatedProjects(projects, container);
        })
        .catch(err => {
            console.warn('Автоматическая подгрузка не сработала (нужен локальный сервер или GitHub):', err);
            container.innerHTML = '<p class="text-white/30 text-xs">Загрузка проектов...</p>';
        });
});

function renderRelatedProjects(allProjects, container) {
    // Определяем текущую страницу
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || currentPath;

    // Фильтруем: убираем текущий проект из списка
    const projectsToShow = allProjects.filter(p => !currentFile.includes(p.link));

    // Берем первые 5 штук
    const limit = 5;
    const finalProjects = projectsToShow.slice(0, limit);

    container.innerHTML = ''; // Очищаем

    if (finalProjects.length === 0) {
        container.innerHTML = '<p class="text-white/50 text-sm">Нет других проектов.</p>';
        return;
    }

    finalProjects.forEach(project => {
        const html = `
            <a href="${project.link}" class="nav-link related-project-card block bg-[#111] overflow-hidden shadow-lg transition hover:bg-[#1a1a1a] group h-full border border-white/5 hover:border-white/20">
                <div class="overflow-hidden h-[150px] w-full relative">
                    <img src="${project.img}" alt="${project.title}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100">
                </div>
                <div class="p-4 text-left">
                    <span class="text-lg font-medium tracking-custom-tight text-white block mb-1 group-hover:text-white transition">${project.title}</span>
                    <p class="text-xs text-white/50 uppercase tracking-widest text-[10px]">${project.category}</p>
                </div>
            </a>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

    // Анимация появления
    setTimeout(() => {
        container.querySelectorAll('.related-project-card').forEach(el => el.classList.add('opacity-100'));
    }, 100);
}
