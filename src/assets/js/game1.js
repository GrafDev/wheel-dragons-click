import {gameState, resetState} from './state.js';
import {gsap} from 'gsap';
import {Animations1} from './animations1.js';
import {SpriteManager} from './sprite-manager.js';
import {FireSpriteManager} from './fire-sprite-manager.js';
import {DragonAnimations} from './dragon-animations.js';
import {gameConfig} from './config.js';
import {getImagePath} from './images.js';

import buttonSpin from '../images/button_spin.png';
import buttonSpinHover from '../images/button_spin_hover.png';

export class Game1 {
    constructor() {
        const urlSettings = this.getSettingsFromURL();
        this.gameMode = urlSettings.mode;
        this.country = urlSettings.country;
        this.config = gameConfig[this.country][this.gameMode];
        
        console.log('Game1 configuration:', {
            gameMode: this.gameMode,
            country: this.country,
            config: this.config,
            winTexts: this.config?.spins
        });
        this.wheelElement = document.querySelector('.wheel-image');
        this.spinButton = document.getElementById('spin-button');
        this.defaultButtonSrc = buttonSpin;
        this.hoverButtonSrc = buttonSpinHover;
        this.winTextElement = document.querySelector('.win-text');
        this.winSectorElement = document.querySelector('.win-sector');
        this.counterTextElement = document.querySelector('.counter-text');
        this.counterElement = document.querySelector('.counter');

        this.spriteManager = new SpriteManager();
        this.spriteManager.initialize();

        this.fireSpriteManager = new FireSpriteManager();
        this.fireSpriteManager.initialize();

        this.createModal();
        this.initEventListeners();
        this.initializeWheel();
        this.startButtonShake();
        this.updateCounterText();
    }

    createModal() {
        if (!document.querySelector('.modal-overlay')) {
            const modalHTML = `
               <div class="modal-overlay">
                   <div class="modal-content">
                       <div class="modal-win-amount"></div>
                       <a href="{offer_link}" target="_blank" class="modal-button"></a>
                   </div>
               </div>
           `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        this.modal = document.querySelector('.modal-overlay');
    }

    showWinText(text) {
        if (this.winTextElement) {
            this.winTextElement.textContent = text;
            this.winTextElement.classList.add('active');
        }
        if (this.winSectorElement) {
            this.winSectorElement.classList.add('active');
        }
    }

    hideWinText() {
        if (this.winTextElement) {
            this.winTextElement.classList.remove('active');
        }
        if (this.winSectorElement) {
            this.winSectorElement.classList.remove('active');
        }
    }

    startButtonShake() {
        if (this.spinButton && !gameState.isSpinning && !gameState.buttonBlocked) {
            this.spinButton.classList.add('shaking');
        }
    }

    stopButtonShake() {
        if (this.spinButton) {
            this.spinButton.classList.remove('shaking');
        }
    }

    initEventListeners() {
        if (this.spinButton) {
            this.spinButton.addEventListener('mousedown', () => {
                if (!gameState.buttonBlocked) {
                    this.spinButton.src = this.hoverButtonSrc;
                }
            });

            this.spinButton.addEventListener('click', () => {
                if (!gameState.buttonBlocked) {
                    this.triggerButtonPress();
                }
            });

            this.spinButton.addEventListener('mouseenter', () => {

                const wasShaking = this.spinButton.classList.contains('shaking');

                if (!gameState.buttonBlocked && !gameState.isSpinning) {
                    if (wasShaking) {
                        this.spinButton.classList.remove('shaking');
                    }

                    this.spinButton.style.transform = 'translateX(-50%) scale(1.05)';
                    this.spinButton.style.filter = 'drop-shadow(0 6px 8px rgba(0, 0, 0, 0.4)) brightness(1.05)';

                    this.buttonHoverState = {wasShaking};
                }
            });

            this.spinButton.addEventListener('mouseleave', () => {

                if (!gameState.buttonBlocked && !gameState.isSpinning) {
                    this.spinButton.style.transform = 'translateX(-50%)';
                    this.spinButton.style.filter = 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))';

                    if (this.buttonHoverState && this.buttonHoverState.wasShaking) {
                        this.spinButton.classList.add('shaking');
                    }
                }
            });
        }

        // Click anywhere on screen to spin
        document.addEventListener('click', (e) => {
            if (!gameState.buttonBlocked && !e.target.closest('.modal-content') && !e.target.closest('#language-selector')) {
                this.triggerButtonPress();
            }
        });

        // Keyboard events for space and enter
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && !gameState.buttonBlocked) {
                e.preventDefault();
                this.triggerButtonPress();
            }
        });

        const modalButton = document.querySelector('.modal-button');
        if (modalButton) {
            modalButton.addEventListener('click', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.spriteManager.stop();
                    this.hideWinText();
                    Animations1.hideModal(this.modal);
                    resetState();
                    this.spinButton.src = this.defaultButtonSrc;
                    Animations1.buttonGlow(this.spinButton);
                    this.startButtonShake();
                }
            });
        }
    }

    initializeWheel() {
        Animations1.wheelSpin(this.wheelElement, 0, 0).then(() => {
            Animations1.buttonGlow(this.spinButton);
        });
    }

    updateCounterText() {
        if (this.counterTextElement) {
            const totalSpins = this.gameMode === 'auto' ? 1 : 2;
            const remainingSpins = totalSpins - gameState.spinCount;
            this.counterTextElement.textContent = remainingSpins > 0 ? remainingSpins : 0;
        }
    }

    triggerButtonPress() {
        if (gameState.isSpinning || gameState.buttonBlocked) return;
        
        // Visual button press effect
        if (this.spinButton) {
            this.spinButton.style.transform = 'translateX(-50%) scale(0.9)';
            
            setTimeout(() => {
                this.spinButton.style.transform = 'translateX(-50%)';
            }, 100);
        }
        
        this.hideWinText();
        this.spin();
    }

    spin() {
        if (gameState.isSpinning || gameState.buttonBlocked) return;

        gameState.buttonBlocked = true;
        gameState.spinCount++;
        gameState.isSpinning = true;

        this.updateCounterText();

        this.spriteManager.reset();
        Animations1.stopButtonGlow(this.spinButton);
        this.stopButtonShake();
        this.spinButton.src = this.hoverButtonSrc;

        const dragonsElement = document.querySelector('.logo02.dragons');
        if (dragonsElement) {
            dragonsElement.style.animation = 'none';
        }

        const currentRotation = gsap.getProperty(this.wheelElement, "rotation") || 0;
        const effectiveSpinCount = this.gameMode === 'auto' ? 2 : gameState.spinCount;
        const spinPromise = Animations1.wheelSpin(this.wheelElement, currentRotation, effectiveSpinCount);

        let spinHandled = false;

        spinPromise.then(() => {
            if (spinHandled) return;
            spinHandled = true;

            gameState.isSpinning = false;

            const totalSpins = this.gameMode === 'auto' ? 1 : 2;
            if (gameState.spinCount === totalSpins) {
                gameState.buttonBlocked = true;
            }

            this.spriteManager.play(1, -1);

            this.fireSpriteManager.flash();

            if (dragonsElement) {
                DragonAnimations.startDragonsPulsation(dragonsElement);
            }

            if (this.gameMode === 'auto') {
                const winText = this.config.spins.first.winText;
                if (winText.includes('<span')) {
                    this.winTextElement.innerHTML = winText;
                } else {
                    this.showWinText(winText);
                }
                setTimeout(() => {
                    this.spriteManager.stop();
                    Animations1.showModal(this.modal);
                }, 1500);
            } else {
                if (gameState.spinCount === 1) {
                    this.showWinText(this.config.spins.first.winText);
                    setTimeout(() => {
                        gameState.buttonBlocked = false;
                        this.spinButton.src = this.defaultButtonSrc;
                        this.startButtonShake();
                    }, 1000);
                } else if (gameState.spinCount === 2) {
                    this.showWinText(this.config.spins.second.winText);
                    setTimeout(() => {
                        this.spriteManager.stop();
                        Animations1.showModal(this.modal);
                    }, 1500);
                }
            }
        });

        return spinPromise;
    }


    getSettingsFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        const mode = params.get('mode') || import.meta.env.VITE_GAME_MODE || 'button';
        const country = params.get('country') || import.meta.env.VITE_COUNTRY || 'standard';
        
        console.log('Game1 Settings detection:', {
            urlMode: params.get('mode'),
            urlCountry: params.get('country'),
            envMode: import.meta.env.VITE_GAME_MODE,
            envCountry: import.meta.env.VITE_COUNTRY,
            finalMode: mode,
            finalCountry: country
        });
        
        return { mode, country };
    }
}


export const game1 = new Game1();
