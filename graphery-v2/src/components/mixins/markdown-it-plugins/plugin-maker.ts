import type MarkdownIt from 'markdown-it';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';

export function makeDoubleDelimiterPlugin(
    delimiterMarker: number,
    delimiter: string,
    ruleName: string,
    tagName: string
) {
    const startType = `${ruleName}_start`;
    const closeType = `${ruleName}_close`;

    return function plugin(md: MarkdownIt) {
        function tokenize(state: StateInline, silent: boolean) {
            let i, len, token;

            const start = state.pos,
                marker = state.src.charCodeAt(start);

            if (silent) {
                return false;
            }

            if (marker !== delimiterMarker) {
                return false;
            }

            const scanned = state.scanDelims(state.pos, true);
            len = scanned.length;
            const ch = String.fromCharCode(marker);

            if (len < 2) {
                return false;
            }

            if (len % 2) {
                token = state.push('text', '', 0);
                token.content = ch;
                len--;
            }

            for (i = 0; i < len; i += 2) {
                token = state.push('text', '', 0);
                token.content = ch + ch;

                if (!scanned.can_open && !scanned.can_close) {
                    continue;
                }

                state.delimiters.push({
                    marker: marker,
                    length: 0, // disable "rule of 3" length checks meant for emphasis
                    jump: i / 2, // 1 delimiter = 2 characters
                    token: state.tokens.length - 1,
                    end: -1,
                    open: scanned.can_open,
                    close: scanned.can_close,
                });
            }

            state.pos += scanned.length;

            return true;
        }

        // Walk through delimiter list and replace text tokens with tags
        //
        function postProcess(
            state: StateInline,
            delimiters: StateInline.Delimiter[]
        ) {
            let i, j, startDelim, endDelim, token;
            const loneMarkers = [],
                max = delimiters.length;

            for (i = 0; i < max; i++) {
                startDelim = delimiters[i];

                if (startDelim.marker !== delimiterMarker /* = */) {
                    continue;
                }

                if (startDelim.end === -1) {
                    continue;
                }

                endDelim = delimiters[startDelim.end];

                token = state.tokens[startDelim.token];
                token.type = startType;
                token.tag = tagName;
                token.nesting = 1;
                token.markup = `${delimiter}${delimiter}`;
                token.content = '';

                token = state.tokens[endDelim.token];
                token.type = closeType;
                token.tag = tagName;
                token.nesting = -1;
                token.markup = `${delimiter}${delimiter}`;
                token.content = '';

                if (
                    state.tokens[endDelim.token - 1].type === 'text' &&
                    state.tokens[endDelim.token - 1].content === delimiter
                ) {
                    loneMarkers.push(endDelim.token - 1);
                }
            }

            // If a marker sequence has an odd number of characters, it's splitted
            // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
            // start of the sequence.
            //
            // So, we have to move all those markers after subsequent s_close tags.
            //
            while (loneMarkers.length) {
                i = loneMarkers.pop() as number;
                j = i + 1;

                while (
                    j < state.tokens.length &&
                    state.tokens[j].type === closeType
                ) {
                    j++;
                }

                j--;

                if (i !== j) {
                    token = state.tokens[j];
                    state.tokens[j] = state.tokens[i];
                    state.tokens[i] = token;
                }
            }
        }

        md.inline.ruler.before('emphasis', ruleName, tokenize);
        md.inline.ruler2.before(
            'emphasis',
            ruleName,
            function (state: StateInline) {
                let curr;
                const tokens_meta = state.tokens_meta,
                    max = (state.tokens_meta || []).length;

                postProcess(state, state.delimiters);

                for (curr = 0; curr < max; curr++) {
                    const tokenMeta = tokens_meta[curr];
                    if (tokenMeta && tokenMeta.delimiters) {
                        postProcess(state, tokenMeta.delimiters);
                    }
                }

                return true;
            }
        );
    };
}
