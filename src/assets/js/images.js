export function getImagePath(filename) {
    return new URL(`../images/${filename}`, import.meta.url).href;
}