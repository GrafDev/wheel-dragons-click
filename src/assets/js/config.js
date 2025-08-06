export const gameConfig = {
    standard: {
        button: {
            spins: {
                first: {
                    winText: "100FS"
                },
                second: {
                    winText: "300%"
                }
            },
            wheelText: "text_wheel.png",
            modalBg: "modal_bg.png"
        },
        
        auto: {
            spins: {
                first: {
                    winText: '<span class="big-text">1500$</span>\n<span class="plus-text">+</span>\n<span class="small-text">100FS</span>'
                }
            },
            wheelText: "text_wheel.png",
            modalBg: "modal_bg.png",
            autoSpinDelay: 1800
        }
    },
    
    canada: {
        button: {
            spins: {
                first: {
                    winText: "150FS"
                },
                second: {
                    winText: "2250CA$"
                }
            },
            wheelText: "text_wheel-canada.png",
            modalBg: "modal_bg-canada-button.png"
        },
        
        auto: {
            spins: {
                first: {
                    winText: '<span class="big-text">2250CA$</span>\n<span class="plus-text">.</span>'
                }
            },
            wheelText: "text_wheel-canada.png",
            modalBg: "modal_bg-canada-auto.png",
            autoSpinDelay: 2000
        }
    },
    
    common: {
        modalWinAmount: "Your Prize!"
    }
};