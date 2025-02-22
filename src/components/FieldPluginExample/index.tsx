import './example.css'
import { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'

const UnitOptions = ['px', 'em', 'rem', '%', 'vw', 'vh']

interface ContentModel {
  top?: string | undefined
  topValue?: string | undefined
  right?: string | undefined
  rightValue?: string | undefined
  bottom?: string | undefined
  bottomValue?: string | undefined
  left?: string | undefined
  leftValue?: string | undefined
  unit: string
  [key: string]: string | undefined
}

const FieldPlugin: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin({
    enablePortalModal: false,
  })

  // data.content
  // actions.setContent
  // read options via actions.options

  if (type !== 'loaded') {
    return null
  }

  const model = data.content as ContentModel

  const updateModel = (
    prop: 'top' | 'right' | 'left' | 'bottom' | 'unit',
    val: string,
  ) => {
    // setup the new model
    const newModel: ContentModel = {
      ...model,
      unit: prop === 'unit' ? val : model.unit,
    }

    // if we're only changing a single value
    // load the prop right in
    if (prop !== 'unit') {
      newModel[prop + 'Value'] = val
    }

    newModel.top =
      newModel.topValue && newModel.topValue.length > 0
        ? `${newModel.topValue}${newModel.unit}`
        : undefined

    newModel.left =
      newModel.leftValue && newModel.leftValue.length > 0
        ? `${newModel.leftValue}${newModel.unit}`
        : undefined

    newModel.right =
      newModel.rightValue && newModel.rightValue.length > 0
        ? `${newModel.rightValue}${newModel.unit}`
        : undefined

    newModel.bottom =
      newModel.bottomValue && newModel.bottomValue.length > 0
        ? `${newModel.bottomValue}${newModel.unit}`
        : undefined

    actions.setContent(newModel)
  }

  return (
    <div>
      <div className="input-group">
        <input
          type="text"
          value={model.topValue}
          onChange={(e) => updateModel('top', e.target.value)}
          placeholder="auto"
        />
        <input
          type="text"
          value={model.rightValue}
          onChange={(e) => updateModel('right', e.target.value)}
          placeholder="auto"
        />
        <input
          type="text"
          value={model.bottomValue}
          onChange={(e) => updateModel('bottom', e.target.value)}
          placeholder="auto"
        />
        <input
          type="text"
          value={model.leftValue}
          onChange={(e) => updateModel('left', e.target.value)}
          placeholder="auto"
        />
        <select onChange={(e) => updateModel('unit', e.target.value)}>
          {UnitOptions.map((unit) => (
            <option
              key={unit}
              value={unit}
              selected={model.unit === unit}
            >
              {unit}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FieldPlugin
