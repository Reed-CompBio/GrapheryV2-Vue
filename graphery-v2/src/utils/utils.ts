import { SITE_NAME } from 'src/utils/vars';

export function formatPageMetaTitle(title: string): string {
    return `${title} | ${SITE_NAME}`;
}

export const toKebabCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
