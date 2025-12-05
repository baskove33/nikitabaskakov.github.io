// === УПРАВЛЕНИЕ ПРОЕКТАМИ ===
// status: 'open'        -> Проект открыт, ссылка работает.
// status: 'locked'      -> Проект закрыт, висит замок, блюр, открывается попап.
// status: 'coming_soon' -> Секретный проект, сильный блюр, надпись "Скоро".

const projectsData = [
    {
        id: 'dyor5',
        title: 'DYOR 5',
        category: 'UI Design / Web Design / Brand Design',
        image: 'https://res.cloudinary.com/dt79npeea/image/upload/v1764842242/Rectangle_39524_y5ycpn.png',
        link: 'dyor5.html',
        status: 'open' // <--- ПОМЕНЯЙ НА 'open', ЧТОБЫ ОТКРЫТЬ
    },
    {
        id: 'nuiche',
        title: 'Nu i Che',
        category: 'Web Design',
        image: 'https://res.cloudinary.com/dt79npeea/image/upload/v1764842241/Rectangle_39518_rwxdzz.png',
        link: 'nuiche.html',
        status: 'locked'
    },
    {
        id: 'nobee',
        title: 'Nobee',
        category: 'Web Design',
        image: 'https://res.cloudinary.com/dt79npeea/image/upload/v1764842241/Rectangle_39521_ck13rv.png',
        link: 'nobee.html',
        status: 'open'
    },
    {
        id: 'circles',
        title: '9 circles of Hell',
        category: 'Longread',
        image: 'https://res.cloudinary.com/dt79npeea/image/upload/v1764843389/%D1%8B%D0%B0%D0%B2%D0%B0%D0%B0_ik42xy.png',
        link: 'circles.html',
        status: 'open'
    },
    {
        id: 'dindrone',
        title: 'Din Drone',
        category: 'UI Design / 3D',
        image: 'https://res.cloudinary.com/dt79npeea/image/upload/v1764842241/Rectangle_39517_rwlir2.png',
        link: 'dindrone.html',
        status: 'locked'
    },
    {
        id: 'turbofish',
        title: 'Turbofish',
        category: 'UX Design / UI Design / E-commerce',
        image: 'https://res.cloudinary.com/dt79npeea/image/upload/v1764842241/Rectangle_39520_j4cgl1.png',
        link: 'turbofish.html',
        status: 'locked'
    }
];

// Секретные проекты (можно добавить сколько угодно)
const secretProjects = [
    {
        id: 'secret1',
        title: 'Секретный проект',
        category: 'Coming Soon',
        status: 'coming_soon'
    },
    {
        id: 'secret2',
        title: 'Секретный проект',
        category: 'Coming Soon',
        status: 'coming_soon'
    }
];
