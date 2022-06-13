import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import type MarkdownIt from 'markdown-it';
import type StateCore from 'markdown-it/lib/rules_core/state_core';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type { ParentType } from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import type Renderer from 'markdown-it/lib/renderer';
import type { RenderRuleRecord } from 'markdown-it/lib/renderer';

type CustomRenderRule = (
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: EnvType,
    self: FootnoteRenderer
) => string;

type FootnoteRenderer = Renderer & {
    rules: RenderRuleRecord & {
        footnote_ref: CustomRenderRule;
        footnote_block_open: CustomRenderRule;
        footnote_block_close: CustomRenderRule;
        footnote_open: CustomRenderRule;
        footnote_close: CustomRenderRule;
        footnote_anchor: CustomRenderRule;
        footnote_caption: CustomRenderRule;
        footnote_anchor_name: CustomRenderRule;
    };
};

type EnvType<T extends object = object> = T & { docId?: string };

type CustomParentType = ParentType | 'footnote';

type FootnoteStateBlock = Omit<StateBlock, 'parentType'> & {
    parentType: CustomParentType;
};

type FootnoteList = {
    content: string;
    tokens: Token[];
}[];

function render_footnote_anchor_name(
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: EnvType /*, slf*/
) {
    const n = Number(tokens[idx].meta.id + 1).toString();
    let result = '';

    if (typeof env.docId === 'string') {
        result = `-${env.docId}-`;
    }

    return result + n;
}

function formatFootnoteLink(id: number | string, href?: boolean) {
    if (href) {
        return `#fn-${id}`;
    } else {
        return `fn-${id}`;
    }
}

// TODO: href linking is not working
function formatSuperscriptLink(id: number | string, href?: boolean) {
    if (href) {
        return `#fn-ref-${id}`;
    } else {
        return `fn-ref-${id}`;
    }
}

function render_footnote_caption(
    tokens: Token[],
    idx: number /*, options, env, slf*/
) {
    let n = Number(tokens[idx].meta.id + 1).toString();

    if (tokens[idx].meta.subId > 0) {
        n += ':' + tokens[idx].meta.subId;
    }

    return '[' + n + ']';
}

function render_footnote_ref(
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: EnvType,
    slf: FootnoteRenderer
) {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
    let refId = id;

    if (tokens[idx].meta.subId > 0) {
        refId += ':' + tokens[idx].meta.subId;
    }

    return `<sup class="footnote-ref"><a href="${formatFootnoteLink(
        id,
        true
    )}" id="${formatSuperscriptLink(refId)}"> ${caption}</a></sup>`;
}

function render_footnote_block_open(
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options
) {
    return (
        (options.xhtmlOut
            ? '<hr class="footnotes-sep" />\n'
            : '<hr class="footnotes-sep">\n') +
        '<section class="footnotes">\n' +
        '<ol class="footnotes-list">\n'
    );
}

function render_footnote_block_close() {
    return '</ol>\n</section>\n';
}

function render_footnote_open(
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: EnvType,
    self: FootnoteRenderer
) {
    let id = self.rules.footnote_anchor_name(tokens, idx, options, env, self);

    if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
    }

    return `<li id="${formatFootnoteLink(id)}" class="footnote-item">`;
}

function render_footnote_close() {
    return '</li>\n';
}

function render_footnote_anchor(
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: EnvType,
    self: FootnoteRenderer
) {
    let id = self.rules.footnote_anchor_name(tokens, idx, options, env, self);

    if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
    }

    /* ↩ with escape code to prevent display as Apple Emoji on iOS */
    return `<a href="${formatSuperscriptLink(
        id,
        true
    )}" class="footnote-backref">\u21a9\uFE0E</a>`;
}

export default function footnote_plugin(md: MarkdownIt) {
    const parseLinkLabel = md.helpers.parseLinkLabel;
    const isSpace = md.utils.isSpace;

    const rendererRules = md.renderer.rules as FootnoteRenderer['rules'];
    rendererRules.footnote_ref = render_footnote_ref;
    rendererRules.footnote_block_open = render_footnote_block_open;
    rendererRules.footnote_block_close = render_footnote_block_close;
    rendererRules.footnote_open = render_footnote_open;
    rendererRules.footnote_close = render_footnote_close;
    rendererRules.footnote_anchor = render_footnote_anchor;

    // helpers (only used in other rules, no tokens are attached to those)
    rendererRules.footnote_caption = render_footnote_caption;
    rendererRules.footnote_anchor_name = render_footnote_anchor_name;

    // Process footnote block definition
    function footnote_def(
        state: FootnoteStateBlock,
        startLine: number,
        endLine: number,
        silent: boolean
    ) {
        let pos, token, offset, ch;

        const start = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];

        // line should be at least 5 chars - "[^x]:"
        if (start + 4 > max) {
            return false;
        }

        if (state.src.charCodeAt(start) !== 0x5b /* [ */) {
            return false;
        }
        if (state.src.charCodeAt(start + 1) !== 0x5e /* ^ */) {
            return false;
        }

        for (pos = start + 2; pos < max; pos++) {
            if (state.src.charCodeAt(pos) === 0x20) {
                return false;
            }
            if (state.src.charCodeAt(pos) === 0x5d /* ] */) {
                break;
            }
        }

        if (pos === start + 2) {
            return false;
        } // no empty footnote labels
        if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 0x3a /* : */) {
            return false;
        }
        if (silent) {
            return true;
        }
        pos++;

        if (!state.env.footnotes) {
            state.env.footnotes = {};
        }
        if (!state.env.footnotes.refs) {
            state.env.footnotes.refs = {};
        }
        const label = state.src.slice(start + 2, pos - 2);
        state.env.footnotes.refs[':' + label] = -1;

        token = new state.Token('footnote_reference_open', '', 1);
        token.meta = { label: label };
        token.level = state.level++;
        state.tokens.push(token);

        const oldBMark = state.bMarks[startLine];
        const oldTShift = state.tShift[startLine];
        const oldSCount = state.sCount[startLine];
        const oldParentType = state.parentType;

        const posAfterColon = pos;
        const initial = (offset =
            state.sCount[startLine] +
            pos -
            (state.bMarks[startLine] + state.tShift[startLine]));

        while (pos < max) {
            ch = state.src.charCodeAt(pos);

            if (isSpace(ch)) {
                if (ch === 0x09) {
                    offset += 4 - (offset % 4);
                } else {
                    offset++;
                }
            } else {
                break;
            }

            pos++;
        }

        state.tShift[startLine] = pos - posAfterColon;
        state.sCount[startLine] = offset - initial;

        state.bMarks[startLine] = posAfterColon;
        state.blkIndent += 4;
        state.parentType = 'footnote';

        if (state.sCount[startLine] < state.blkIndent) {
            state.sCount[startLine] += state.blkIndent;
        }

        // state.md.block.tokenize(state, startLine, endLine, true);
        state.md.block.tokenize(state as StateBlock, startLine, endLine);

        state.parentType = oldParentType;
        state.blkIndent -= 4;
        state.tShift[startLine] = oldTShift;
        state.sCount[startLine] = oldSCount;
        state.bMarks[startLine] = oldBMark;

        token = new state.Token('footnote_reference_close', '', -1);
        token.level = --state.level;
        state.tokens.push(token);

        return true;
    }

    // Process inline footnotes (^[...])
    function footnote_inline(state: StateInline, silent: boolean) {
        let footnoteId, token;

        const max = state.posMax,
            start = state.pos;

        let tokens: Token[];

        if (start + 2 >= max) {
            return false;
        }
        if (state.src.charCodeAt(start) !== 0x5e /* ^ */) {
            return false;
        }
        if (state.src.charCodeAt(start + 1) !== 0x5b /* [ */) {
            return false;
        }

        const labelStart = start + 2;
        const labelEnd = parseLinkLabel(state, start + 1);

        // parser failed to find ']', so it's not a valid note
        if (labelEnd < 0) {
            return false;
        }

        // We found the end of the link, and know for a fact it's a valid link;
        // so all that's left to do is to call tokenizer.
        //
        if (!silent) {
            if (!state.env.footnotes) {
                state.env.footnotes = {};
            }
            if (!state.env.footnotes.list) {
                state.env.footnotes.list = [] as FootnoteList;
            }
            footnoteId = state.env.footnotes.list.length;

            state.md.inline.parse(
                state.src.slice(labelStart, labelEnd),
                state.md,
                state.env,
                (tokens = [])
            );

            token = state.push('footnote_ref', '', 0);
            token.meta = { id: footnoteId };

            state.env.footnotes.list[footnoteId] = {
                content: state.src.slice(labelStart, labelEnd),
                tokens: tokens,
            };
        }

        state.pos = labelEnd + 1;
        state.posMax = max;
        return true;
    }

    // Process footnote references ([^...])
    function footnote_ref(state: StateInline, silent: boolean) {
        let pos, footnoteId, footnoteSubId, token;
        const max = state.posMax,
            start = state.pos;

        // should be at least 4 chars - "[^x]"
        if (start + 3 > max) {
            return false;
        }

        if (!state.env.footnotes || !state.env.footnotes.refs) {
            return false;
        }
        if (state.src.charCodeAt(start) !== 0x5b /* [ */) {
            return false;
        }
        if (state.src.charCodeAt(start + 1) !== 0x5e /* ^ */) {
            return false;
        }

        for (pos = start + 2; pos < max; pos++) {
            if (state.src.charCodeAt(pos) === 0x20) {
                return false;
            }
            if (state.src.charCodeAt(pos) === 0x0a) {
                return false;
            }
            if (state.src.charCodeAt(pos) === 0x5d /* ] */) {
                break;
            }
        }

        if (pos === start + 2) {
            return false;
        } // no empty footnote labels
        if (pos >= max) {
            return false;
        }
        pos++;

        const label = state.src.slice(start + 2, pos - 1);
        if (typeof state.env.footnotes.refs[':' + label] === 'undefined') {
            return false;
        }

        if (!silent) {
            if (!state.env.footnotes.list) {
                state.env.footnotes.list = [] as {
                    label: string;
                    count: number;
                }[];
            }

            if (state.env.footnotes.refs[':' + label] < 0) {
                footnoteId = state.env.footnotes.list.length;
                state.env.footnotes.list[footnoteId] = {
                    label: label,
                    count: 0,
                };
                state.env.footnotes.refs[':' + label] = footnoteId;
            } else {
                footnoteId = state.env.footnotes.refs[':' + label];
            }

            footnoteSubId = state.env.footnotes.list[footnoteId].count;
            state.env.footnotes.list[footnoteId].count++;

            token = state.push('footnote_ref', '', 0);
            token.meta = { id: footnoteId, subId: footnoteSubId, label: label };
        }

        state.pos = pos;
        state.posMax = max;
        return true;
    }

    // Glue footnote tokens to end of token stream
    function footnote_tail(state: StateCore) {
        let i,
            l,
            j,
            t,
            lastParagraph,
            token,
            tokens,
            insideRef = false;

        const refTokens = {} as Record<string, Token[]>;

        // noinspection JSMismatchedCollectionQueryUpdate
        let current: Token[];
        let currentLabel: string;

        if (!state.env.footnotes) {
            return;
        }

        state.tokens = state.tokens.filter(function (tok) {
            if (tok.type === 'footnote_reference_open') {
                insideRef = true;
                current = [];
                currentLabel = tok.meta.label;
                return false;
            }
            if (tok.type === 'footnote_reference_close') {
                insideRef = false;
                // prepend ':' to avoid conflict with Object.prototype members
                refTokens[':' + currentLabel] = current;
                return false;
            }
            if (insideRef) {
                current.push(tok);
            }
            return !insideRef;
        });

        if (!state.env.footnotes.list) {
            return;
        }
        const list = state.env.footnotes.list;

        token = new state.Token('footnote_block_open', '', 1);
        state.tokens.push(token);

        for (i = 0, l = list.length; i < l; i++) {
            token = new state.Token('footnote_open', '', 1);
            token.meta = { id: i, label: list[i].label };
            state.tokens.push(token);

            if (list[i].tokens) {
                tokens = [];

                token = new state.Token('paragraph_open', 'p', 1);
                token.block = true;
                tokens.push(token);

                token = new state.Token('inline', '', 0);
                token.children = list[i].tokens;
                token.content = list[i].content;
                tokens.push(token);

                token = new state.Token('paragraph_close', 'p', -1);
                token.block = true;
                tokens.push(token);
            } else if (list[i].label) {
                tokens = refTokens[':' + list[i].label];
            }

            if (tokens) state.tokens = state.tokens.concat(tokens);
            if (
                state.tokens[state.tokens.length - 1].type === 'paragraph_close'
            ) {
                lastParagraph = state.tokens.pop();
            } else {
                lastParagraph = null;
            }

            t = list[i].count > 0 ? list[i].count : 1;
            for (j = 0; j < t; j++) {
                token = new state.Token('footnote_anchor', '', 0);
                token.meta = { id: i, subId: j, label: list[i].label };
                state.tokens.push(token);
            }

            if (lastParagraph) {
                state.tokens.push(lastParagraph);
            }

            token = new state.Token('footnote_close', '', -1);
            state.tokens.push(token);
        }

        token = new state.Token('footnote_block_close', '', -1);
        state.tokens.push(token);
    }

    md.block.ruler.before('reference', 'footnote_def', footnote_def, {
        alt: ['paragraph', 'reference'],
    });
    md.inline.ruler.after('image', 'footnote_inline', footnote_inline);
    md.inline.ruler.after('footnote_inline', 'footnote_ref', footnote_ref);
    md.core.ruler.after('inline', 'footnote_tail', footnote_tail);
}
