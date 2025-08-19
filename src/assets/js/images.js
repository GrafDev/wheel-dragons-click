// Import all possible images
import textWheelImg from '../images/text_wheel.png';
import textWheelCanadaImg from '../images/text_wheel-canada.png';
import modalBgImg from '../images/modal_bg.webp';
import modalBgCanadaButtonImg from '../images/modal_bg-canada.webp';
import modalBgCanadaAutoImg from '../images/modal_bg-canada.webp';
import logo1Part1Img from '../images/logo1-part1.png';
import logo1Part2Img from '../images/logo1-part2.png';
import logo1CanadaPart1Img from '../images/logo1-canada-part1.webp';
import logo1CanadaPart2Img from '../images/logo1-canada-part2.webp';

const imageMap = {
    'text_wheel.png': textWheelImg,
    'text_wheel-canada.png': textWheelCanadaImg,
    'modal_bg.webp': modalBgImg,
    'modal_bg-canada-button.webp': modalBgCanadaButtonImg,
    'modal_bg-canada-auto.webp': modalBgCanadaAutoImg,
    'logo1-part1.png': logo1Part1Img,
    'logo1-part2.png': logo1Part2Img,
    'logo1-canada-part1.webp': logo1CanadaPart1Img,
    'logo1-canada-part2.webp': logo1CanadaPart2Img
};

export function getImagePath(filename) {
    return imageMap[filename] || new URL(`../images/${filename}`, import.meta.url).href;
}