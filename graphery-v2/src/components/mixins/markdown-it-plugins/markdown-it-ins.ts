import { makeDoubleDelimiterPlugin } from 'components/mixins/markdown-it-plugins/plugin-maker';

const MARK = {
    marker: 0x2b,
    delimiter: '+',
    ruleName: 'ins',
    tagName: 'ins',
};

export default makeDoubleDelimiterPlugin(
    MARK.marker,
    MARK.delimiter,
    MARK.ruleName,
    MARK.tagName
);
