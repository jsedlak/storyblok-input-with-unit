import './example.css'
import React, { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import { ContentModel } from './ContentModel'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from '@mui/material'
import { LinkIcon } from '@storyblok/mui'

const UnitOptions = ['px', 'em', 'rem', '%', 'vw', 'vh']

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

  let units = UnitOptions
  if (data?.options) {
    const optionsKeys = Object.keys(data.options)

    if (optionsKeys && optionsKeys.length > 0) {
      units = optionsKeys
    }
  }

  const DefaultModel: ContentModel = {
    topValue: '',
    leftValue: '',
    rightValue: '',
    bottomValue: '',
    locked: true,
    unit: units.length > 0 ? units[0] : '',
  }

  const model = { ...DefaultModel, ...(data.content as ContentModel) }

  const updateModelProps = (newModel: ContentModel) => {
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
  }

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

      if (!model.locked) {
        newModel[prop + 'Value'] = val
      } else {
        newModel.leftValue = val
        newModel.topValue = val
        newModel.rightValue = val
        newModel.bottomValue = val
      }
    }

    updateModelProps(newModel)

    actions.setContent(newModel)
  }

  const handleSyncChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newModel = { ...model, locked: event.target.checked }

    if (!event.target.checked) {
      actions.setContent(newModel)
      return
    }

    console.log({ newModel, model })
    newModel.leftValue =
      newModel.rightValue =
      newModel.bottomValue =
        newModel.topValue
    updateModelProps(newModel)
    actions.setContent(newModel)
  }

  return (
    <div>
      <div className="form-group">
        <div className="input-group">
          <TextField
            size="small"
            type="text"
            value={model.topValue}
            onChange={(e) => updateModel('top', e.target.value)}
            placeholder="auto"
          />
          <TextField
            size="small"
            type="text"
            value={model.rightValue}
            onChange={(e) => updateModel('right', e.target.value)}
            placeholder="auto"
          />
          <TextField
            size="small"
            type="text"
            value={model.bottomValue}
            onChange={(e) => updateModel('bottom', e.target.value)}
            placeholder="auto"
          />
          <TextField
            size="small"
            type="text"
            value={model.leftValue}
            onChange={(e) => updateModel('left', e.target.value)}
            placeholder="auto"
          />
        </div>
      </div>
      <div
        className="form-group"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '5px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            gap: '5px',
          }}
        >
          <Switch
            aria-label="Synchronize Values"
            checked={model.locked}
            onChange={handleSyncChanged}
          />
          <LinkIcon />
        </div>
        <Select
          value={model.unit}
          size="small"
          onChange={(e: SelectChangeEvent) =>
            updateModel('unit', e.target.value as string)
          }
        >
          {units.map((unit) => (
            <MenuItem
              key={unit}
              value={unit}
            >
              {unit}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default InputWithUnit
