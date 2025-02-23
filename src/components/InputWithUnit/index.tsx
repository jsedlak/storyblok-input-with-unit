import './styles.css'
import { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import { ContentModel } from './ContentModel'

const DefaultUnitOptions = ['px', 'em', 'rem', '%', 'vw', 'vh']

function isValidNumber(str: any) {
  return !isNaN(str) && !isNaN(parseFloat(str))
}

const InputWithUnit: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin({
    enablePortalModal: false,
  })

  // data.content
  // actions.setContent
  // read options via actions.options

  if (type !== 'loaded') {
    return null
  }

  // grab the unit options if they are provided
  let units = DefaultUnitOptions
  if (data?.options) {
    const optionsKeys = Object.keys(data.options)

    if (optionsKeys && optionsKeys.length > 0) {
      units = optionsKeys
    }
  }

  // build the default model
  const DefaultModel: ContentModel = {
    valueRaw: '',
    unit: units.length > 0 ? units[0] : '',
  }

  // build the model for display, combining default and provided data
  const model = { ...DefaultModel, ...(data.content as ContentModel) }

  // updates the model based on callbacks from the ui
  const updateModel = (prop: 'valueRaw' | 'unit', val: string) => {
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

      newModel[prop] = val
    }

    newModel.value =
      newModel.valueRaw && newModel.valueRaw.length > 0
        ? `${newModel.valueRaw}${newModel.unit}`
        : undefined

    actions.setContent(newModel)
  }

  return (
    <div className="input-with-unit--wrapper">
      <div className="form-group">
        <div className="input-group">
          <div>
            <input
              type="text"
              value={model.valueRaw}
              onChange={(e) => updateModel('valueRaw', e.target.value)}
              placeholder="auto"
            />
          </div>
        </div>
        <select onChange={(e) => updateModel('unit', e.target.value as string)}>
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
