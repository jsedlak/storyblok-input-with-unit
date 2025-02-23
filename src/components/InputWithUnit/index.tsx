import './example.css'
import { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import { ContentModel } from './ContentModel'

const UnitOptions = ['px', 'em', 'rem', '%', 'vw', 'vh']

function isValidNumber(str: any) {
  return !isNaN(str) && !isNaN(parseFloat(str))
}

const InputWithUnit: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin({
    enablePortalModal: false,
  })

  let units = UnitOptions
  if (data?.options) {
    const optionsKeys = Object.keys(data.options)

    if (optionsKeys && optionsKeys.length > 0) {
      units = optionsKeys
    }
  }

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
      unit: prop === 'unit' ? val : model.unit ?? units[0],
    }

    // if we're only changing a single value
    // load the prop right in
    if (prop !== 'unit') {
      if (!isValidNumber(val)) {
        return
      }

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
          className="sb-textfield__input sb-textfield__input--default"
          type="text"
          value={model.topValue}
          onChange={(e) => updateModel('top', e.target.value)}
          placeholder="auto"
        />
        <input
          className="sb-textfield__input sb-textfield__input--default"
          type="text"
          value={model.rightValue}
          onChange={(e) => updateModel('right', e.target.value)}
          placeholder="auto"
        />
        <input
          className="sb-textfield__input sb-textfield__input--default"
          type="text"
          value={model.bottomValue}
          onChange={(e) => updateModel('bottom', e.target.value)}
          placeholder="auto"
        />
        <input
          className="sb-textfield__input sb-textfield__input--default"
          type="text"
          value={model.leftValue}
          onChange={(e) => updateModel('left', e.target.value)}
          placeholder="auto"
        />
        <select onChange={(e) => updateModel('unit', e.target.value)}>
          {units.map((unit) => (
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

export default InputWithUnit
