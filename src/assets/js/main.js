import '../css/main.css';
import { setupI18n } from './i18n.js';
import { game1 } from './game1.js';
import i18next from "i18next";
import { Animations1 } from './animations1.js';
import { DragonAnimations } from './dragon-animations.js';
import { FireSpriteManager } from './fire-sprite-manager.js';
import { initializeApp } from 'firebase/app';
import { gameConfig } from './config.js';
import { DevPanel } from './dev-panel.js';
import { getImagePath } from './images.js';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

function updateTexts() {
    const elements = {
        'action-text': 'press_spin'
    };

    for (const [id, key] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = i18next.t(key);
        }
    }
}

function preloadImages(images) {
    const preloadPromises = images.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    });

    return Promise.all(preloadPromises);
}

function showContent() {
    const preloader = document.getElementById('preloader');
    const hiddenElements = document.querySelectorAll('.content-hidden');

    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.remove();

        window.scrollTo(0, 1);

        document.querySelectorAll('.wheel-section, .counter, .spin-button-image').forEach(el => {
            if (el) {
                const display = el.style.display;
                el.style.display = 'none';
                setTimeout(() => { el.style.display = display || ''; }, 10);
            }
        });
    }, 300);

    hiddenElements.forEach(el => {
        el.classList.remove('content-hidden');
    });
}

function setIOSLandscapeVh() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
        document.documentElement.style.setProperty('--ios-landscape-vh', `${window.innerHeight * 0.01}px`);

        if (window.innerWidth > window.innerHeight) {
            document.body.classList.add('ios-landscape');
        } else {
            document.body.classList.remove('ios-landscape');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    setIOSLandscapeVh();

    // ПОЛНАЯ блокировка масштабирования
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });
    document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });
    document.addEventListener('gestureend', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });
    
    // Блокировка всех touch событий для зума
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });
    
    // Блокировка wheel события для зума
    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });
    
    // Блокировка клавиш зума
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) ||
            (e.ctrlKey && e.shiftKey && e.key === '+')) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });
    
    // Отключение двойного тапа для зума
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
            event.stopPropagation();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Блокировка context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    window.addEventListener('resize', setIOSLandscapeVh);
    window.addEventListener('orientationchange', setIOSLandscapeVh);

    const urlSettings = DevPanel.getSettingsFromURL();
    const gameMode = urlSettings.mode;
    const country = urlSettings.country;
    const config = gameConfig[country][gameMode];
    const logos = gameConfig.common.logos[country];
    
    const images = [
        getImagePath(logos.part1),
        getImagePath(logos.part2),
        new URL('../images/logo02.webp', import.meta.url).href,
        new URL('../images/logo02_dragons.webp', import.meta.url).href,
        new URL('../images/arrow.png', import.meta.url).href,
        new URL('../images/wheel.png', import.meta.url).href,
        getImagePath(config.wheelText),
        new URL('../images/button_spin.png', import.meta.url).href,
        new URL('../images/button_spin_hover.webp', import.meta.url).href,
        new URL('../images/sector.webp', import.meta.url).href,
        new URL('../images/counter.png', import.meta.url).href,
        new URL('../images/globs.png', import.meta.url).href,
        getImagePath(config.modalBg),
        new URL('../images/modal_button_bg.webp', import.meta.url).href,
        new URL('../images/bg_desktop.webp', import.meta.url).href,
        new URL('../images/bg_mobile.webp', import.meta.url).href,
        new URL('../images/man.webp', import.meta.url).href,
        new URL('../sprites/wheel-light/sprite_light_sheet.png', import.meta.url).href,
        new URL('../sprites/fire/sprite_sheet.png', import.meta.url).href
    ];

    try {
        await preloadImages(images);

        showContent();

        const i18n = await setupI18n();

        Animations1.fixLogoPositions();

        window.addEventListener('resize', () => {
            Animations1.fixLogoPositions();
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                Animations1.fixLogoPositions();
            }, 300);
        });

        Animations1.initializePageElements();

        const fireSpriteManager = new FireSpriteManager();
        fireSpriteManager.initialize();
        fireSpriteManager.play(2);

        const wheelElement = document.querySelector('.wheel-image');
        if (wheelElement) {
            Animations1.wheelSpin(wheelElement, 0, 0).then(() => {
                const spinButton = document.getElementById('spin-button');
                if (spinButton) {
                    Animations1.buttonGlow(spinButton);
                }
            });
        }

        document.body.classList.add(`game-mode-${gameMode}`);
        document.body.setAttribute('data-country', country);
        
        const wheelTextImage = document.getElementById('wheel-text-image');
        if (wheelTextImage && config.wheelText) {
            wheelTextImage.src = getImagePath(config.wheelText);
        }

        // Update logo images based on country
        const logoImages = document.querySelectorAll('.logo01:not(.letters-o)');
        logoImages.forEach(img => {
            img.src = getImagePath(logos.part1);
        });

        const logoLettersImages = document.querySelectorAll('.logo01.letters-o');
        logoLettersImages.forEach(img => {
            img.src = getImagePath(logos.part2);
        });

        const counterTextElement = document.querySelector('.counter-text');
        if (counterTextElement) {
            counterTextElement.textContent = gameMode === 'auto' ? '1' : '2';
            counterTextElement.classList.remove('content-hidden');
        }

        const dragonsElement = document.querySelector('.logo02.dragons');
        if (dragonsElement) {
            dragonsElement.style.animation = 'none';
            DragonAnimations.startDragonsPulsation(dragonsElement);
        }

        const spinButton = document.getElementById('spin-button');
        const languageSelector = document.getElementById('language-selector');

        if (gameMode === 'auto') {
            setTimeout(() => {
                game1.spin();
            }, config.autoSpinDelay);
        }

        spinButton?.addEventListener('click', () => game1.spin());
        languageSelector?.addEventListener('change', (e) => {
            i18n.changeLanguage(e.target.value);
            updateTexts();
        });

        // Prevent wheel spin when clicking on language selector
        const languageSelectorContainer = document.querySelector('.language-selector-container');
        languageSelectorContainer?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        updateTexts();
        
        if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
            new DevPanel();
        }
    } catch (error) {
        console.error('Failed to initialize the game:', error);
    }
});
