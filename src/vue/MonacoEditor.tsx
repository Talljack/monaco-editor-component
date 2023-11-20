import type { MonacoCodeEditor, MonacoEditorProps } from '@/type'
import * as monaco from 'monaco-editor'
import type { PropType } from 'vue'
import { computed, defineComponent, defineExpose, h, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { formatWidth } from '../utils'
const props = {
  value: {
    type: String as PropType<MonacoEditorProps['value']>,
    default: null,
  },
  class: {
    type: String as PropType<MonacoEditorProps['className']>,
    default: '',
  },
  options: {
    type: Object as PropType<MonacoEditorProps['options']>,
    default: {},
  },
  width: {
    type: [String, Number] as PropType<MonacoEditorProps['width']>,
    default: '100%',
  },
  height: {
    type: [String, Number] as PropType<MonacoEditorProps['height']>,
    default: '100%',
  },
  language: {
    type: String as PropType<MonacoEditorProps['language']>,
    default: 'javascript',
  },
  theme: {
    type: String as PropType<MonacoEditorProps['theme']>,
    default: 'vs-dark',
  },
  style: {
    type: Object as PropType<MonacoEditorProps['style']>,
    default: {},
  },
  defaultValue: {
    type: String as PropType<MonacoEditorProps['defaultValue']>,
    default: '',
  },
  onEditorDidMount: {
    type: Function as PropType<MonacoEditorProps['onEditorDidMount']>,
    default: () => () => ({}),
  },
  onEditorWillUnmount: {
    type: Function as PropType<MonacoEditorProps['onEditorWillUnmount']>,
    default: () => () => ({}),
  },
  onEditorWillMount: {
    type: Function as PropType<MonacoEditorProps['onEditorWillMount']>,
    default: () => () => ({}),
  },
  modelUri: {
    type: Object as PropType<MonacoEditorProps['modelUri']>,
    default: undefined,
  },
  onUpdateValue: {
    type: Function as PropType<(value: string, e: monaco.editor.IModelContentChangedEvent) => void>,
    default: () => () => ({}),
  },
}

const MonacoEditor = defineComponent({
  name: 'MonacoEditor',
  props,
  emits: ['update:value'],
  setup(props, { emit }) {
    const containerRef = ref(null)
    let editor: MonacoCodeEditor | null = null
    const handleMonacoEditorMounted = (editor: MonacoCodeEditor) => {
      props.onEditorDidMount?.(editor, monaco)
      editor.onDidChangeModelContent(e => {
        const newValue = editor.getValue()
        emit('update:value', newValue, e)
        props.onUpdateValue(newValue, e)
      })
    }

    onMounted(() => {
      if (containerRef.value) {
        // editor will mount hook
        const userOptions = props.onEditorWillMount?.(monaco)
        const uri = props.modelUri?.(monaco)
        let model = uri ? monaco.editor.getModel(uri) : null
        if (!model) {
          model = monaco.editor.createModel(props.value ?? props.defaultValue ?? '', props.language, uri)
        } else {
          // update value and language use same model
          model.setValue(props.value ?? props.defaultValue ?? '')
          monaco.editor.setModelLanguage(model, props.language!)
        }
        editor = monaco.editor.create(containerRef.value, {
          model,
          value: props.value ?? props.defaultValue,
          ...{ ...props.options, ...userOptions },
          language: props.language,
          theme: props.theme,
        })
        handleMonacoEditorMounted(editor)
      }
    })

    const formatedWidth = computed(() => formatWidth(props.width))
    const formatedHeight = computed(() => formatWidth(props.height))
    // style
    const defaultStyle = computed(() => {
      return {
        width: formatedWidth.value,
        height: formatedHeight.value,
      }
    })
    // watch theme
    watch(
      () => props.theme,
      newTheme => {
        if (editor && newTheme) {
          monaco.editor.setTheme(newTheme)
        }
      },
    )

    // watch options
    watch(
      () => props.options,
      newOptions => {
        if (editor) {
          editor.updateOptions(newOptions ?? {})
        }
      },
      {
        deep: true,
      },
    )

    // watch width & height -> editor re layout
    watch(
      () => [formatedWidth.value, formatedHeight.value],
      () => {
        if (editor) {
          nextTick(() => {
            editor?.layout()
          })
        }
      },
    )

    watch(
      () => props.language,
      newLanguage => {
        if (!newLanguage) return
        if (editor) {
          const model = editor.getModel()
          if (model) {
            monaco.editor.setModelLanguage(model, newLanguage)
          }
        }
      },
    )

    watch(
      () => props.value,
      newValue => {
        if (editor) {
          if (newValue === editor.getValue()) return
          const model = editor.getModel()
          if (model) {
            model.setValue(newValue ?? '')
          }
        }
      },
    )
    onUnmounted(() => {
      props?.onEditorWillUnmount?.(editor!, monaco)
      editor?.dispose()
    })
    defineExpose({
      container: containerRef,
    })
    return () => {
      return h('div', {
        class: `editor ${props.class}`,
        style: {
          ...defaultStyle.value,
          ...props.style,
        },
        ref: containerRef,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as unknown as any)
    }
  },
})

export default MonacoEditor
