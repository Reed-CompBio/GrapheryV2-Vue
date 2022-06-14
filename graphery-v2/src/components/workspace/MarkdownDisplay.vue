<template>
    <div id="markdown-display" :class="markdownStyle" v-html="marked"></div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import type MDT from 'markdown-it';

import MarkdownIt from 'markdown-it';
import MDSub from '../mixins/markdown-it-plugins/markdown-it-sub';
import MDSup from '../mixins/markdown-it-plugins/markdown-it-sup';
import MDFootnote from '../mixins/markdown-it-plugins/markdown-it-footnote';
import MDKatex from '../mixins/markdown-it-plugins/markdown-it-katex';
import MDIns from '../mixins/markdown-it-plugins/markdown-it-ins';
import MDMark from '../mixins/markdown-it-plugins/markdown-it-mark';

import hljs from 'highlight.js/lib/core';
import PythonLang from 'highlight.js/lib/languages/python';
import MarkdownLang from 'highlight.js/lib/languages/markdown';

import { useQuasar } from 'quasar';

const DEFAULT_OPTIONS: MDT.Options = {
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />).
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
    linkify: true, //Auto-convert URL-like text to links
    typographer: true,
    quotes: '“”‘’',
};

function initMarkdown(options: MDT.Options) {
    hljs.registerLanguage('python', PythonLang);
    hljs.registerLanguage('markdown', MarkdownLang);

    options.highlight = function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${
                    hljs.highlight(code, {
                        language: lang,
                        ignoreIllegals: false,
                    }).value
                }</code></pre>`;
            } catch (e) {
                return `<pre class="hljs"><code>Cannot Load Code: ${e}</code></pre>`;
            }
        } else {
            return `<pre class="hljs"><code>${md.utils.escapeHtml(
                code
            )}</code></pre>`;
        }
    };

    const md = MarkdownIt(options);
    return md
        .use(MDSub)
        .use(MDSup)
        .use(MDFootnote)
        .use(MDKatex)
        .use(MDIns)
        .use(MDMark);
}

const DEFAULT_CONTENT =
    '# h1 Heading 8-)\n' +
    '## h2 Heading\n' +
    '### h3 Heading\n' +
    '#### h4 hhh\n' +
    '##### h5 hhhhh\n' +
    '<h2> h2 Heading by HTML</h2>\n' +
    '\n' +
    '## Math \n' +
    'inline: $\\sqrt{2}$ 1\n' +
    '$$\n' +
    '\\mathbb{R}^3\n' +
    '$$\n' +
    '## Horizontal Rules\n' +
    '\n' +
    '___\n' +
    '\n' +
    '---\n' +
    '\n' +
    '***\n' +
    '\n' +
    '## Typographic replacements\n' +
    '\n' +
    'Enable typographer option to see result.\n' +
    '\n' +
    '(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n' +
    '\n' +
    'test.. test... test..... test?..... test!....\n' +
    '\n' +
    '!!!!!! ???? ,,  -- ---\n' +
    '\n' +
    '"Smartypants, double quotes" and \'single quotes\'\n' +
    '\n' +
    '\n' +
    '## Emphasis\n' +
    '\n' +
    '**This is bold text**\n' +
    '\n' +
    '__This is bold text__\n' +
    '\n' +
    '*This is italic text*\n' +
    '\n' +
    '_This is italic text_\n' +
    '\n' +
    '~~Strikethrough~~\n' +
    '\n' +
    '\n' +
    '## Blockquotes\n' +
    '\n' +
    '\n' +
    '> Blockquotes can also be nested...\n' +
    '>> ...by using additional greater-than signs right next to each other...\n' +
    '> > > ...or with spaces between arrows.\n' +
    '\n' +
    '\n' +
    '## Lists\n' +
    '\n' +
    'Unordered\n' +
    '\n' +
    '+ Create a list by starting a line with `+`, `-`, or `*`\n' +
    '+ Sub-lists are made by indenting 2 spaces:\n' +
    '  - Marker character change forces new list start:\n' +
    '    * Ac tristique libero volutpat at\n' +
    '    + Facilisis in pretium nisl aliquet\n' +
    '    - Nulla volutpat aliquam velit\n' +
    '+ Very easy!\n' +
    '\n' +
    'Ordered\n' +
    '\n' +
    '1. Lorem ipsum dolor sit amet\n' +
    '2. Consectetur adipiscing elit\n' +
    '3. Integer molestie lorem at massa\n' +
    '\n' +
    '\n' +
    '1. You can use sequential numbers...\n' +
    '1. ...or keep all the numbers as `1.`\n' +
    '\n' +
    'Start numbering with offset:\n' +
    '\n' +
    '57. foo\n' +
    '1. bar\n' +
    '\n' +
    '\n' +
    '## Code\n' +
    '\n' +
    'Inline `code`\n' +
    '\n' +
    'Indented code\n' +
    '\n' +
    '    // Some comments\n' +
    '    line 1 of code\n' +
    '    line 2 of code\n' +
    '    line 3 of code\n' +
    '\n' +
    '\n' +
    'Block code "fences"\n' +
    '\n' +
    '```\n' +
    'Sample text here...\n' +
    '```\n' +
    'Syntax highlighting\n' +
    '\n' +
    '```python\n' +
    'a = lambda x: x * x\n' +
    'def test(n):\n' +
    '   return a(n)\n' +
    '\n' +
    '```\n' +
    '\n' +
    '```markdown\n' +
    '# title h1\n' +
    '\n' +
    '- l1\n' +
    '- l2\n' +
    '- l3\n' +
    '- l4\n' +
    'some text with `code` and __bold__ \n' +
    '\n' +
    '```\n' +
    '```typescript' +
    'const a = 1\n' +
    '```\n' +
    '\n' +
    '## Tables\n' +
    '\n' +
    '| Option | Description |\n' +
    '| ------ | ----------- |\n' +
    '| data   | path to data files to supply the data that will be passed into templates. |\n' +
    '| engine | engine to be used for processing templates. Handlebars is the default. |\n' +
    '| ext    | extension to be used for dest files. |\n' +
    '\n' +
    'Right aligned columns\n' +
    '\n' +
    '| Option | Description |\n' +
    '| ------:| -----------:|\n' +
    '| data   | path to data files to supply the data that will be passed into templates. |\n' +
    '| engine | engine to be used for processing templates. Handlebars is the default. |\n' +
    '| ext    | extension to be used for dest files. |\n' +
    '\n' +
    '## Links\n' +
    '\n' +
    '[vue-markdown](https://github.com/miaolz123/vue-markdown)\n' +
    '\n' +
    '[link with title](https://github.com/miaolz123/vue-markdown "VueMarkdown")\n' +
    '\n' +
    'Autoconverted link https://github.com/miaolz123/vue-markdown (enable linkify to see)\n' +
    '\n' +
    '\n' +
    '## Images\n' +
    '\n' +
    '![Minion](https://icatcare.org/app/uploads/2018/06/Layer-1704-1200x630.jpg)\n' +
    '\n' +
    'Like links, Images also have a footnote style syntax\n' +
    '\n' +
    '![Alt text][id]\n' +
    '\n' +
    'With a reference later in the document defining the URL location:\n' +
    '\n' +
    '[id]: https://icatcare.org/app/uploads/2018/06/Layer-1704-1200x630.jpg  "The Dojocat"\n' +
    '\n' +
    '\n' +
    '### Emojies\n' +
    '\n' +
    '> Classic markup: :wink: :cry: :laughing: :yum:\n' +
    '>\n' +
    '> Shortcuts (emoticons): :-) :-( 8-) ;)\n' +
    '\n' +
    '\n' +
    '### Subscript / Superscript\n' +
    '\n' +
    '- 19^th^\n' +
    '- H~2~O\n' +
    '\n' +
    '\n' +
    '### \\<ins>\n' +
    '\n' +
    '++Inserted text++\n' +
    '\n' +
    '\n' +
    '### \\<mark>\n' +
    '\n' +
    '==Marked text==\n' +
    '\n' +
    '\n' +
    '### Footnotes\n' +
    '\n' +
    'Footnote 1 link[^first].\n' +
    '\n' +
    'Footnote 2 link[^second].\n' +
    '\n' +
    'Inline footnote^[Text of inline footnote] definition.\n' +
    '\n' +
    'Duplicated footnote reference[^second].\n' +
    '\n' +
    '[^first]: Footnote **can have markup**\n' +
    '\n' +
    '    and multiple paragraphs.\n' +
    '\n' +
    '[^second]: Footnote text.\n' +
    '\n' +
    '\n' +
    '### Definition lists\n' +
    '\n' +
    'Term 1\n' +
    '\n' +
    ':   Definition 1\n' +
    'with lazy continuation.\n' +
    '\n' +
    'Term 2 with *inline markup*\n' +
    '\n' +
    ':   Definition 2\n' +
    '\n' +
    '        { some code, part of Definition 2 }\n' +
    '\n' +
    '    Third paragraph of definition 2.\n' +
    '\n' +
    '_Compact style:_\n' +
    '\n' +
    'Term 1\n' +
    '  ~ Definition 1\n' +
    '\n' +
    'Term 2\n' +
    '  ~ Definition 2a\n' +
    '  ~ Definition 2b\n' +
    '\n' +
    '\n' +
    '### Abbreviations\n' +
    '\n' +
    'This is HTML abbreviation example.\n' +
    '\n' +
    'It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.\n' +
    '\n' +
    '*[HTML]: Hyper Text Markup Language';

export default defineComponent({
    props: {
        docId: {
            type: String,
            default: '',
        },
        markdownContent: {
            type: String,
            default: '',
        },
        options: {
            type: Object as PropType<MDT.Options>,
        },
    },
    setup(props) {
        const md = ref<MDT>(
            initMarkdown({ ...DEFAULT_OPTIONS, ...props.options })
        );

        const { dark } = useQuasar();
        const markdownStyle = computed(() => {
            return {
                'markdown-body-dark': dark.isActive,
                'markdown-body-light': !dark.isActive,
            };
        });

        const marked = computed(() => {
            return md.value?.render(props.markdownContent || DEFAULT_CONTENT, {
                docId: props.docId,
            });
        });
        return { marked, markdownStyle };
    },
});
</script>

<style lang="sass">
@import 'src/css/github-markdown-light'
@import 'src/css/github-markdown-dark'

.footnote-backref
    display: inline-block
    margin: 2px
</style>

<style lang="scss">
.markdown-body-light {
    @import 'highlight.js/scss/github';
}

.markdown-body-dark {
    @import 'highlight.js/scss/github-dark';
}
</style>

<style>
@import 'katex/dist/katex.min.css';
</style>
