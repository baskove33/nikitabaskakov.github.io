/**
 * ЕДИНЫЙ ЦЕНТР УПРАВЛЕНИЯ (Dynamic Loader)
 * 1. Загружает проекты в "Смотрите также" со страницы all_cases.html.
 * 2. Управляет кнопкой "Назад" в шапке (текст и действие).
 */

const CONFIG = {
    // 1. Настройки подгрузки проектов
    // Укажи здесь точное имя файла, где лежит список всех работ (all_cases.html, index.html и т.д.)
    sourceFile: 'all_cases.html', 
    
    // 2. Настройки кнопки в шапке
    backButtonText: '← Назад',    // Текст, который будет на кнопке
    
    // ВАЖНО: Если true, кнопка работает как "История браузера" (возвращает туда, откуда пришел).
    // Если false, она ведет на backButtonLink (например, index.html).
    useBrowserBack: true,         
    backButtonLink: 'index.html' // Игнорируется, если useBrowserBack: true
};

document.addEventListener('DOMContentLoaded', () => {
    // --- ЗАПУСК ФУНКЦИЙ ---
    setupHeaderNavigation(); // Настраиваем кнопку в шапке
    initRelatedProjects();   // Подгружаем проекты вниз
});

// === ЛОГИКА КНОПКИ В ШАПКЕ ===
function setupHeaderNavigation() {
    // Ищем ссылку внутри nav в header. 
    // Обычно это <nav><a href="...">...</a></nav>
    const navLink = document.querySelector('header nav a');
    
    if (navLink) {
        // Меняем текст кнопки
        navLink.textContent = CONFIG.backButtonText;

        if (CONFIG.useBrowserBack) {
            // Режим "Назад в браузере"
            navLink.href = '#'; // Чтобы не было перехода по умолчанию
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Если истории нет (человек открыл ссылку напрямую), можно отправлять на главную
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = CONFIG.backButtonLink;
                }
            });
        } else {
            // Режим "Ссылка на конкретную страницу"
            navLink.href = CONFIG.backButtonLink;
        }
    }
}

// === ЛОГИКА ПОДГРУЗКИ ПРОЕКТОВ ===
function initRelatedProjects() {
    const container = document.getElementById('related-projects');
    if (!container) return; // Если блока нет (мы не на странице кейса), выходим

    fetch(CONFIG.sourceFile)
        .then(response => {
            if (!response.ok) throw new Error(`Файл ${CONFIG.sourceFile} не найден`);
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const tiles = doc.querySelectorAll('.project-tile');
            const projects = [];

            tiles.forEach(tile => {
                const link = tile.getAttribute('href');
                const img = tile.querySelector('img')?.src;
                // Ищем данные по классам Tailwind (проверь, что они совпадают с all_cases.html)
                const title = tile.querySelector('.text-xl')?.innerText.trim();
                const category = tile.querySelector('.text-xs')?.innerText.trim();

                if (link && title) {
                    projects.push({ title, category, link, img });
                }
            });

            renderProjects(projects, container);
        })
        .catch(err => {
            console.error('DynamicLoader Error:', err);
            // Показываем ошибку на странице, чтобы было видно сразу
            container.innerHTML = `<div class="col-span-full text-red-500 text-xs border border-red-500/30 p-4 rounded bg-red-900/10">
                <p><b>Ошибка скрипта:</b> Не удалось загрузить проекты.</p>
                <p class="opacity-70 mt-1">1. Проверь, что файл называется точно <b>${CONFIG.sourceFile}</b>.</p>
                <p class="opacity-70">2. Если файл открыт просто так (file://), браузер блокирует это. Запусти через Live Server или залей на GitHub.</p>
            </div>`;
        });
}

function renderProjects(allProjects, container) {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || currentPath;

    // Фильтруем: исключаем текущий проект из списка
    const projectsToShow = allProjects.filter(p => !currentFile.includes(p.link));
    
    // Лимит: показываем первые 5 проектов
    const finalProjects = projectsToShow.slice(0, 5);

    container.innerHTML = ''; 

    if (finalProjects.length === 0) {
        container.innerHTML = '<div class="col-span-full text-white/30 text-sm">Нет других проектов для показа.</div>';
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

    // Анимация появления карточек
    setTimeout(() => {
        container.querySelectorAll('.related-project-card').forEach(el => el.classList.add('opacity-100'));
    }, 100);
}
