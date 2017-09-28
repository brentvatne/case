import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { View } from 'react-native'
import navigationService from '../../utilities/navigationService'
import { HeaderButton, HeaderButtonLabel, Caret } from './HeaderButton'
import ToggleCheck from './ToggleCheck'
import { ToggleSelect, ToggleSelectOption } from './ToggleSelect'
import { HorizontalRule } from '../UI/Layout'
import { Units } from '../../constants/Style'

const HeaderDrawer = styled.View`
  position: absolute;
  top: ${Units.statusBarHeight};
  width: 100%;
`

export default class HeaderPullDown extends Component {
  render() {
    const {
      primary,
      secondary,
      onPress,
      isExpanded,
      isHeaderTitleVisible,
    } = this.props

    return (
      <HeaderDrawer>
        {!isExpanded &&
          <HeaderButton onPress={onPress}>
            <HeaderButtonLabel style={{ color: primary.color }} active>
              {isHeaderTitleVisible &&
                (primary.title)
              }
              <Caret style={{ color: primary.color }} />
            </HeaderButtonLabel>
          </HeaderButton>
        }

        {isExpanded &&
          <ToggleSelect>
            <ToggleSelectOption>
              <HeaderButtonLabel active>
                {primary.title}
              </HeaderButtonLabel>
              <ToggleCheck />
            </ToggleSelectOption>

            {secondary.map(option => (
              <View key={option.key}>
                <HorizontalRule />
                <ToggleSelectOption
                  onPress={() => {
                    onPress()
                    if (option.onPress) return option.onPress()
                    return navigationService.reset(option.key)
                  }}
                >
                  <HeaderButtonLabel>
                    {option.title}
                  </HeaderButtonLabel>
                </ToggleSelectOption>
              </View>
            ))}
          </ToggleSelect>
        }
      </HeaderDrawer>
    )
  }
}

HeaderPullDown.propTypes = {
  onPress: PropTypes.func,
  isExpanded: PropTypes.bool,
  primary: PropTypes.shape({
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
  }).isRequired,
  secondary: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  })).isRequired,
  isHeaderTitleVisible: PropTypes.bool,
}

HeaderPullDown.defaultProps = {
  title: '—',
  color: null,
  onPress: (() => {}),
  isExpanded: false,
  isHeaderTitleVisible: true,
}
