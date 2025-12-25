/**
 * ЕДИНЫЙ ЦЕНТР УПРАВЛЕНИЯ (Dynamic Loader)
 * 1. Загружает проекты.
 * 2. Управляет кнопкой "Назад".
 * 3. Чинит зависание прелоадера (черного экрана).
 */

const CONFIG = {
    sourceFile: 'all_cases.html', // Имя файла с твоими кейсами
    backButtonText: '← Назад',
    useBrowserBack: true,         // Кнопка работает как "Назад" в браузере
    backButtonLink: 'index.html'  // Куда идти, если истории нет
};

// === 1. ГЛАВНЫЙ ФИКС ЗАВИСАНИЯ (ЛЕКАРСТВО) ===
// Этот код срабатывает КАЖДЫЙ раз, когда страница показывается пользователю
// (даже если вытащена из "истории" кнопкой Назад)
function forceHidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.zIndex = '-1';
            preloader.style.pointerEvents = 'none';
        }, 500); // Тайминг как в CSS
    }
}

// Слушаем событие "pageshow" - это самый надежный способ поймать возврат назад
window.addEventListener('pageshow', (event) => {
    // Если страница загружена из кэша (bfcache) ИЛИ просто загружена
    forceHidePreloader();
});

// На всякий случай запускаем и при обычной загрузке
window.addEventListener('load', forceHidePreloader);


document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, где мы находимся
    const isCasePage = document.getElementById('related-projects');

    if (isCasePage) {
        setupHeaderNavigation(); // Кнопка "Назад" только внутри кейсов
        initRelatedProjects();   // Проекты только внутри кейсов
    }
});

// === ЛОГИКА КНОПКИ "НАЗАД" С АНИМАЦИЕЙ ===
function setupHeaderNavigation() {
    const navLink = document.querySelector('header nav a');
    
    if (navLink) {
        // Клонируем, чтобы убрать старые обработчики (чистый лист)
        const newLink = navLink.cloneNode(true);
        navLink.parentNode.replaceChild(newLink, navLink);
        
        newLink.textContent = CONFIG.backButtonText;
        newLink.href = '#'; // Чтобы не было дефолтного перехода
        
        // Добавляем красивый переход с прелоадером
        newLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Показываем прелоадер (Анимация ухода)
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.opacity = '1';
                preloader.style.zIndex = '9999';
                preloader.style.pointerEvents = 'all';
            }

            // 2. Ждем и переходим назад
            setTimeout(() => {
                if (CONFIG.useBrowserBack && window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = CONFIG.backButtonLink;
                }
            }, 500); // Ждем пока экран станет черным
        });
    }
}

// === ЛОГИКА ПОДГРУЗКИ ПРОЕКТОВ ===
function initRelatedProjects() {
    const container = document.getElementById('related-projects');
    
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
                const title = tile.querySelector('.text-xl')?.innerText.trim();
                const category = tile.querySelector('.text-xs')?.innerText.trim();

                if (link && title) {
                    projects.push({ title, category, link, img });
                }
            });

            renderProjects(projects, container);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = `<div class="col-span-full text-red-500 text-xs border border-red-500/30 p-4 rounded">
                Не удалось загрузить проекты. Проверь файл <b>${CONFIG.sourceFile}</b>.
            </div>`;
        });
}

function renderProjects(allProjects, container) {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || currentPath;

    const projectsToShow = allProjects.filter(p => !currentFile.includes(p.link));
    const finalProjects = projectsToShow.slice(0, 5);

    container.innerHTML = ''; 

    if (finalProjects.length === 0) {
        container.innerHTML = '<div class="col-span-full text-white/30 text-sm">Нет других проектов.</div>';
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

    // Добавляем слушатели клика на новые карточки для анимации
    container.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Если это не открытие в новой вкладке
            if (link.target !== '_blank') {
                e.preventDefault();
                const href = link.getAttribute('href');
                const preloader = document.getElementById('preloader');
                
                if (preloader) {
                    preloader.style.opacity = '1';
                    preloader.style.zIndex = '9999';
                    preloader.style.pointerEvents = 'all';
                }

                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });

    setTimeout(() => {
        container.querySelectorAll('.related-project-card').forEach(el => el.classList.add('opacity-100'));
    }, 100);
}
