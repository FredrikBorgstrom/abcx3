export function lowerCaseFirstChar(text: string) {
    if (text && text.length > 0) {
        return text.charAt(0).toLowerCase() + text.substring(1);
    } else {
        return null;
    }

}

export function typeToFileName(type: string) {
    return lowerCaseFirstChar(type) + '.dart';
}
