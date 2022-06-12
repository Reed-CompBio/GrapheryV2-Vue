<template>
    <div v-html="marked"></div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import type MDT from 'markdown-it';
import MarkdownIt from 'markdown-it';

const DEFAULT_OPTIONS: MDT.Options = {
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />).
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
    linkify: true, //Auto-convert URL-like text to links
    typographer: true,
    quotes: '“”‘’',
};

type MarkdownItPlugin = {
    default: MDT.PluginSimple;
};

import 'highlight.js/styles/intellij-light.css';

async function initMarkdown(options: MDT.Options) {
    const MarkdownIt = (await import('markdown-it')).default;

    const mdSub = (
        (await import(
            '../mixins/markdown-it-plugins/markdown-it-sub'
        )) as MarkdownItPlugin
    ).default;
    const mdSup = (
        (await import(
            '../mixins/markdown-it-plugins/markdown-it-sup'
        )) as MarkdownItPlugin
    ).default;

    const hljs = (await import('highlight.js/lib/core')).default;
    const hljsLangPy = (await import('highlight.js/lib/languages/python'))
        .default;
    hljs.registerLanguage('python', hljsLangPy);
    options.highlight = function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${
                    hljs.highlight(lang, str, true).value
                }</code></pre>`;
            } catch (e) {
                return `<pre class="hljs"><code>Cannot Load Code: ${e}</code></pre>`;
            }
        } else {
            return `<pre class="hljs"><code>${md.utils.escapeHtml(
                str
            )}</code></pre>`;
        }
    };

    const md = MarkdownIt(options);
    return md.use(mdSub).use(mdSup);
}

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
        const md = ref<MarkdownIt | undefined>();
        initMarkdown({ ...DEFAULT_OPTIONS, ...props.options }).then(
            (instance) => {
                md.value = instance;
            }
        );
        const marked = computed(() => {
            return md.value?.render(props.markdownContent, {
                docId: props.docId,
            });
        });
        return { marked };
    },
});
</script>
