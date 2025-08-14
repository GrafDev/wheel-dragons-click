// Import all possible images
import textWheelImg from '../images/text_wheel.png';
import textWheelCanadaImg from '../images/text_wheel-canada.png';
import modalBgImg from '../images/modal_bg.webp';
import modalBgCanadaButtonImg from '../images/modal_bg-canada.webp';
import modalBgCanadaAutoImg from '../images/modal_bg-canada.webp';

const imageMap = {
    'text_wheel.png': textWheelImg,
    'text_wheel-canada.png': textWheelCanadaImg,
    'modal_bg.webp': modalBgImg,
    'modal_bg-canada-button.webp': modalBgCanadaButtonImg,
    'modal_bg-canada-auto.webp': modalBgCanadaAutoImg
};

export function getImagePath(filename) {
    return imageMap[filename] || new URL(`../images/${filename}`, import.meta.url).href;
}