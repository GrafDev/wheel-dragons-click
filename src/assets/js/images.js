// Import all possible images
import textWheelImg from '../images/text_wheel.png';
import textWheelCanadaImg from '../images/text_wheel-canada.png';
import modalBgImg from '../images/modal_bg.png';
import modalBgCanadaButtonImg from '../images/modal_bg-canada-button.png';
import modalBgCanadaAutoImg from '../images/modal_bg-canada-auto.png';

const imageMap = {
    'text_wheel.png': textWheelImg,
    'text_wheel-canada.png': textWheelCanadaImg,
    'modal_bg.png': modalBgImg,
    'modal_bg-canada-button.png': modalBgCanadaButtonImg,
    'modal_bg-canada-auto.png': modalBgCanadaAutoImg
};

export function getImagePath(filename) {
    return imageMap[filename] || new URL(`../images/${filename}`, import.meta.url).href;
}