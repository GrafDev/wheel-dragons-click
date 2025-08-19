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
            modalBg: "modal_bg.webp"
        },
        
        auto: {
            spins: {
                first: {
                    winText: '<span class="big-text">1500$</span>\n<span class="plus-text">+</span>\n<span class="small-text">100FS</span>'
                }
            },
            wheelText: "text_wheel.png",
            modalBg: "modal_bg.webp",
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
            modalBg: "modal_bg-canada.webp"
        },
        
        auto: {
            spins: {
                first: {
                    winText: '<span class="big-text">2250CA$</span>\n<span class="plus-text">+</span>\n<span class="small-text">100FS</span>'
                }
            },
            wheelText: "text_wheel-canada.png",
            modalBg: "modal_bg-canada.webp",
            autoSpinDelay: 2000
        }
    },
    
    common: {
        modalWinAmount: "Your Prize!",
        logos: {
            standard: {
                part1: "logo1-part1.png",
                part2: "logo1-part2.png"
            },
            canada: {
                part1: "logo1-canada-part1.webp", 
                part2: "logo1-canada-part2.webp"
            }
        }
    }
};