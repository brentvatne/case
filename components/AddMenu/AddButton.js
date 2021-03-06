import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { BlurView } from 'expo'

import MenuButton from '../Menu/MenuButton'

import { Border, Units } from '../../constants/Style'

const HitArea = styled(MenuButton.HitArea).attrs({
  activeOpacity: 0.6,
})`
  width: 100%;
`

const VisibleArea = styled(BlurView).attrs({
  intensity: 100,
})`
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${Units.scale[3]};
  border-width: 1;
  border-radius: ${Border.borderRadius};
  border-color: rgba(0, 0, 0, 0.25);
`

const addIcon = require('./icons/add.png')

export default class AddButton extends React.Component {
  static height = MenuButton.height

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    title: 'Are.na',
  }

  render() {
    const { title, onPress, ...rest } = this.props

    return (
      <HitArea onPress={onPress} {...rest}>
        <VisibleArea>
          <MenuButton.Icon source={addIcon} />
          <MenuButton.Label
            style={{
              // Since the bg here is semi-transparent
              // make this color semi-transparent
              // TODO: Icon transparency
              color: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            Add to {title}
          </MenuButton.Label>
        </VisibleArea>
      </HitArea>
    )
  }
}
