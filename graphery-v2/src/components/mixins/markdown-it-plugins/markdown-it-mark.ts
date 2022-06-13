import { makeDoubleDelimiterPlugin } from 'components/mixins/markdown-it-plugins/plugin-maker';

const MARK = {
    marker: 0x3d,
    delimiter: '=',
    ruleName: 'mark',
    tagName: 'mark',
};

export default makeDoubleDelimiterPlugin(
    MARK.marker,
    MARK.delimiter,
    MARK.ruleName,
    MARK.tagName
);
