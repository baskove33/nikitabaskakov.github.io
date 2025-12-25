/**
 * АВТОМАТИЗАЦИЯ
 * Скрипт заходит на страницу со всеми кейсами, считывает оттуда проекты
 * и показывает их в блоке "Смотрите также".
 */

// !!! ВАЖНО: Убедись, что имя файла совпадает БУКВА В БУКВУ.
// Если файл называется "All Cases.html", то писать нужно 'All%20Cases.html' или переименовать файл без пробелов.
const CASES_PAGE_URL = 'all_cases.html'; 

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('related-projects');
    
    // Если на странице нет контейнера (мы не внутри кейса), ничего не делаем
    if (!container) return;

    // 1. Показываем статус загрузки, чтобы понимать, работает ли скрипт вообще
    container.innerHTML = '<p class="text-white/50 text-xs animate-pulse">Поиск проектов в файле ' + CASES_PAGE_URL + '...</p>';

    fetch(CASES_PAGE_URL)
        .then(response => {
            if (!response.ok) {
                // Если файл не найден, выбрасываем ошибку, чтобы показать её в catch
                throw new Error(`Файл "${CASES_PAGE_URL}" не найден (Ошибка ${response.status}). Проверь название файла.`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Ищем карточки.
            const tiles = doc.querySelectorAll('.project-tile');
            
            // 2. Если файл есть, но карточек нет — пишем об этом явно
            if (tiles.length === 0) {
                container.innerHTML = `
                    <div class="text-red-400 text-sm border border-red-500/50 p-4 rounded bg-red-900/10">
                        <p class="font-bold">Ошибка: Проекты не найдены.</p>
                        <p class="mt-2 text-xs text-white/70">Скрипт успешно открыл файл <b>${CASES_PAGE_URL}</b>, но не нашел в нем ни одного элемента с классом <code>.project-tile</code>.</p>
                        <p class="mt-1 text-xs text-white/70">Убедись, что в файле <b>${CASES_PAGE_URL}</b> у карточек (ссылок &lt;a&gt;) есть класс <code>class="project-tile"</code>.</p>
                    </div>
                `;
                console.warn('Скрипт загрузил файл, но не нашел элементов .project-tile');
                return;
            }

            const projects = [];

            tiles.forEach(tile => {
                const link = tile.getAttribute('href');
                const img = tile.querySelector('img')?.src;
                
                // Проверяем, есть ли заголовок с нужным классом
                const titleEl = tile.querySelector('.text-xl'); 
                const categoryEl = tile.querySelector('.text-xs');

                if (link && titleEl) {
                    projects.push({ 
                        title: titleEl.innerText.trim(), 
                        category: categoryEl ? categoryEl.innerText.trim() : 'Design', 
                        link, 
                        img 
                    });
                }
            });

            renderRelatedProjects(projects, container);
        })
        .catch(err => {
            console.error(err);
            // 3. Показываем любую ошибку (например, 404 или CORS)
            container.innerHTML = `
                <div class="text-red-400 text-sm border border-red-500/50 p-4 rounded bg-red-900/10">
                    <p class="font-bold">Ошибка загрузки:</p>
                    <p>${err.message}</p>
                    <p class="mt-2 text-xs text-white/50">Убедись, что файл <b>${CASES_PAGE_URL}</b> лежит в той же папке и название написано правильно.</p>
                </div>
            `;
        });
});

function renderRelatedProjects(allProjects, container) {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || currentPath;

    // Фильтруем: убираем текущий проект
    const projectsToShow = allProjects.filter(p => !currentFile.includes(p.link));

    const limit = 5;
    const finalProjects = projectsToShow.slice(0, limit);

    container.innerHTML = ''; 

    if (finalProjects.length === 0) {
        container.innerHTML = '<p class="text-white/30 text-sm">Проекты найдены, но все они были отфильтрованы (возможно, ссылки совпадают).</p>';
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

    setTimeout(() => {
        container.querySelectorAll('.related-project-card').forEach(el => el.classList.add('opacity-100'));
    }, 100);
}
