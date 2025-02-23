export interface ContentModel {
  top?: string | undefined
  topValue?: string | undefined
  right?: string | undefined
  rightValue?: string | undefined
  bottom?: string | undefined
  bottomValue?: string | undefined
  left?: string | undefined
  leftValue?: string | undefined
  unit: string
  locked: boolean
  [key: string]: any
}
