// same as UNESCAPE_MD_RE plus a space
import type MarkdownIt from 'markdown-it';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';

const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function subscript(state: StateInline, silent: boolean) {
    let found, token;

    const max = state.posMax,
        start = state.pos;

    if (state.src.charCodeAt(start) !== 0x7e /* ~ */) {
        return false;
    }
    if (silent) {
        return false;
    } // don't run any pairs in validation mode
    if (start + 2 >= max) {
        return false;
    }

    state.pos = start + 1;

    while (state.pos < max) {
        if (state.src.charCodeAt(state.pos) === 0x7e /* ~ */) {
            found = true;
            break;
        }

        state.md.inline.skipToken(state);
    }

    if (!found || start + 1 === state.pos) {
        state.pos = start;
        return false;
    }

    const content = state.src.slice(start + 1, state.pos);

    // don't allow unescaped spaces/newlines inside
    if (content.match(/(^|[^\\])(\\\\)*\s/)) {
        state.pos = start;
        return false;
    }

    // found!
    state.posMax = state.pos;
    state.pos = start + 1;

    // Earlier we checked !silent, but this implementation does not need it
    token = state.push('sub_open', 'sub', 1);
    token.markup = '~';

    token = state.push('text', '', 0);
    token.content = content.replace(UNESCAPE_RE, '$1');

    token = state.push('sub_close', 'sub', -1);
    token.markup = '~';

    state.pos = state.posMax + 1;
    state.posMax = max;
    return true;
}

export default function sub_plugin(md: MarkdownIt) {
    md.inline.ruler.after('emphasis', 'sub', subscript);
}
