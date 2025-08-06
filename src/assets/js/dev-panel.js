export class DevPanel {
    constructor() {
        const urlSettings = this.constructor.getSettingsFromURL();
        this.currentMode = urlSettings.mode;
        this.currentCountry = urlSettings.country;
        this.isVisible = true;
        this.panel = null;
        
        this.init();
    }

    init() {
        this.createPanel();
        this.addEventListeners();
        
        if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
            this.addToggleKeyboard();
        }
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'dev-panel';
        this.panel.innerHTML = `
            <select id="dev-mode-selector">
                <option value="button" ${this.currentMode === 'button' ? 'selected' : ''}>Button</option>
                <option value="auto" ${this.currentMode === 'auto' ? 'selected' : ''}>Auto</option>
            </select>
            
            <select id="dev-country-selector">
                <option value="standard" ${this.currentCountry === 'standard' ? 'selected' : ''}>Standard</option>
                <option value="canada" ${this.currentCountry === 'canada' ? 'selected' : ''}>Canada</option>
            </select>
            
            <button id="dev-apply-changes" class="dev-apply-btn">Apply</button>
        `;
        
        document.body.appendChild(this.panel);
        
        if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
            this.show();
        }
    }

    addEventListeners() {
        const applyBtn = this.panel.querySelector('#dev-apply-changes');
        
        applyBtn.addEventListener('click', () => this.applyChanges());
    }

    addToggleKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'd') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    show() {
        this.isVisible = true;
        this.panel.style.display = 'flex';
    }

    hide() {
        this.isVisible = false;
        this.panel.style.display = 'none';
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    applyChanges() {
        const modeSelector = document.getElementById('dev-mode-selector');
        const countrySelector = document.getElementById('dev-country-selector');
        
        const newMode = modeSelector.value;
        const newCountry = countrySelector.value;
        
        if (newMode !== this.currentMode || newCountry !== this.currentCountry) {
            this.currentMode = newMode;
            this.currentCountry = newCountry;
            
            const url = new URL(window.location);
            url.searchParams.set('mode', newMode);
            url.searchParams.set('country', newCountry);
            
            window.location.href = url.toString();
        }
    }

    static getSettingsFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        const mode = params.get('mode') || import.meta.env.VITE_GAME_MODE || 'button';
        const country = params.get('country') || import.meta.env.VITE_COUNTRY || 'standard';
        
        console.log('Settings detection:', {
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