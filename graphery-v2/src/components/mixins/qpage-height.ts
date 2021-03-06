import { reactive } from 'vue';

export interface QPageStyle {
    height?: string;
}

const QPageStyle = reactive<QPageStyle>({});

export function useQPageStyle() {
    return QPageStyle;
}

export function QPageStyleFn(offset: number, height: number) {
    QPageStyle.height = `${height - offset}px`;
}
