<template>
    <div :id="docId" :class="markdownStyle" v-html="marked"></div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import type MDT from 'markdown-it';

import MarkdownIt from 'markdown-it';
import MDSub from '../../mixins/markdown-it-plugins/markdown-it-sub';
import MDSup from '../../mixins/markdown-it-plugins/markdown-it-sup';
import MDFootnote from '../../mixins/markdown-it-plugins/markdown-it-footnote';
import MDKatex from '../../mixins/markdown-it-plugins/markdown-it-katex';
import MDIns from '../../mixins/markdown-it-plugins/markdown-it-ins';
import MDMark from '../../mixins/markdown-it-plugins/markdown-it-mark';

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

export default defineComponent({
    props: {
        docId: {
            type: String,
            default: 'markdown-display',
        },
        markdownContent: {
            type: String,
            default: '# there will be text here :)',
        },
        options: {
            type: Object as PropType<MDT.Options>,
            default: () => ({}),
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
            return md.value?.render(props.markdownContent ?? '', {
                docId: props.docId,
            });
        });
        return { marked, markdownStyle };
    },
});
</script>

<style lang="sass">
@import '../../../css/github-markdown-light'
@import '../../../css/github-markdown-dark'

.footnote-backref
    display: inline-block
    margin: 2px
</style>

<style lang="scss">
.markdown-body-light {
    @import '../../../../node_modules/highlight.js/scss/github';
}

.markdown-body-dark {
    @import '../../../../node_modules/highlight.js/scss/github-dark';
}
</style>

<style>
@import '../../../../node_modules/katex/dist/katex.min.css';
</style>
