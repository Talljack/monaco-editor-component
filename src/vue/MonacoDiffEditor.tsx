import type { MonacoCodeDiffEditor, MonacoDiffEditorProps } from '@/type'
import * as monaco from 'monaco-editor'
import type { PropType } from 'vue'
import { computed, defineComponent, defineExpose, h, nextTick, onUnmounted, ref, watch, watchEffect } from 'vue'
import { formatWidth } from '../utils'
const props = {
  value: {
    type: String as PropType<MonacoDiffEditorProps['value']>,
    default: null,
  },
  class: {
    type: String as PropType<MonacoDiffEditorProps['className']>,
    default: '',
  },
  options: {
    type: Object as PropType<MonacoDiffEditorProps['options']>,
    default: {},
  },
  width: {
    type: [String, Number] as PropType<MonacoDiffEditorProps['width']>,
    default: '100%',
  },
  height: {
    type: [String, Number] as PropType<MonacoDiffEditorProps['height']>,
    default: '100%',
  },
  language: {
    type: String as PropType<MonacoDiffEditorProps['language']>,
    default: 'javascript',
  },
  theme: {
    type: String as PropType<MonacoDiffEditorProps['theme']>,
    default: 'vs-dark',
  },
  style: {
    type: Object as PropType<MonacoDiffEditorProps['style']>,
    default: {},
  },
  defaultValue: {
    type: String as PropType<MonacoDiffEditorProps['defaultValue']>,
    default: '',
  },
  onEditorDidMount: {
    type: Function as PropType<MonacoDiffEditorProps['onEditorDidMount']>,
    default: () => () => ({}),
  },
  onEditorWillUnmount: {
    type: Function as PropType<MonacoDiffEditorProps['onEditorWillUnmount']>,
    default: () => () => ({}),
  },
  onEditorWillMount: {
    type: Function as PropType<MonacoDiffEditorProps['onEditorWillMount']>,
    default: () => () => ({}),
  },
  originalValue: {
    type: String as PropType<MonacoDiffEditorProps['originalValue']>,
    default: '',
  },
  originalUri: {
    type: Object as PropType<MonacoDiffEditorProps['originalUri']>,
    default: undefined,
  },
  modifiedUri: {
    type: Object as PropType<MonacoDiffEditorProps['modifiedUri']>,
    default: undefined,
  },
  onUpdateValue: {
    type: Function as PropType<(value: string, e: monaco.editor.IModelContentChangedEvent) => void>,
    default: () => () => ({}),
  },
}

const MonacoDiffEditor = defineComponent({
  name: 'MonacoDiffEditor',
  props,
  emits: ['update:value'],
  setup(props, { emit }) {
    const containerRef = ref(null)
    let editor: MonacoCodeDiffEditor | null = null
    const handleMonacoEditorMounted = (editor: MonacoCodeDiffEditor) => {
      props.onEditorDidMount?.(editor, monaco)
      const modifiedModel = editor.getModel()?.modified
      if (!modifiedModel) return
      modifiedModel.onDidChangeContent(e => {
        const newValue = modifiedModel.getValue()
        emit('update:value', newValue, e)
        props.onUpdateValue(newValue, e)
      })
    }

    const stop = watchEffect(() => {
      if (containerRef.value) {
        // editor will mount hook
        const userOptions = props.onEditorWillMount?.(monaco)
        // modelUri
        const originalModelUri = props.originalUri?.(monaco)
        const modifiedModelUri = props.modifiedUri?.(monaco)
        let originalModel = originalModelUri ? monaco.editor.getModel(originalModelUri) : null
        if (!originalModel) {
          originalModel = monaco.editor.createModel(
            props.originalValue ?? props.defaultValue,
            props.language,
            originalModelUri,
          )
        } else {
          originalModel.setValue(props.originalValue ?? props.defaultValue)
          monaco.editor.setModelLanguage(originalModel, props.language ?? 'javascript')
        }
        let modifiedModel = modifiedModelUri ? monaco.editor.getModel(modifiedModelUri) : null
        if (!modifiedModel) {
          modifiedModel = monaco.editor.createModel(
            props.value ?? props.defaultValue ?? '',
            props.language,
            originalModelUri,
          )
        } else {
          modifiedModel.setValue(props.value ?? props.defaultValue ?? '')
          monaco.editor.setModelLanguage(modifiedModel, props.language ?? 'javascript')
        }
        editor = monaco.editor.createDiffEditor(containerRef.value!, {
          ...{ ...props.options, ...userOptions },
          theme: props.theme,
        })
        editor.setModel({
          original: originalModel,
          modified: modifiedModel,
        })
        handleMonacoEditorMounted(editor)
      }
      return () => {
        props.onEditorWillUnmount?.(editor!, monaco)
        editor?.dispose()
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
          const originalModel = editor.getModel()?.original
          const modifiedModel = editor.getModel()?.modified
          if (originalModel) {
            monaco.editor.setModelLanguage(originalModel, newLanguage)
          }
          if (modifiedModel) {
            monaco.editor.setModelLanguage(modifiedModel, newLanguage)
          }
        }
      },
    )

    watch(
      () => props.originalValue,
      newOriginalValue => {
        if (editor) {
          const originalModel = editor.getModel()?.original
          if (newOriginalValue === originalModel?.getValue()) return
          if (originalModel) {
            originalModel.setValue(newOriginalValue ?? '')
          }
        }
      },
    )

    watch(
      () => props.value,
      newValue => {
        if (editor) {
          const model = editor.getModel()?.modified
          if (newValue === model?.getValue()) return
          if (model) {
            model.setValue(newValue ?? '')
          }
        }
      },
    )

    defineExpose({
      editor,
    })

    onUnmounted(() => {
      stop()
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

export default MonacoDiffEditor
