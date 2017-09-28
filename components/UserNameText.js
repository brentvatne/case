import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text } from 'react-native'

import NavigatorService from '../utilities/navigationService'

import layout from '../constants/Layout'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: layout.padding,
  },
  text: {
    fontWeight: 'bold',
  },
})

export default class UserNameText extends React.Component {
  constructor(props) {
    super(props)
    this.goToProfile = this.goToProfile.bind(this)
  }

  goToProfile() {
    this.props.onPress()
    NavigatorService.navigate('profile', {
      id: this.props.user.id,
      title: this.props.user.name,
    })
  }

  render() {
    const { style } = this.props

    return (
      <Text style={[styles.text, style]} onPress={this.goToProfile}>{this.props.user.name} </Text>
    )
  }
}

UserNameText.propTypes = {
  style: PropTypes.any,
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.any,
  }).isRequired,
  onPress: PropTypes.func,
}

UserNameText.defaultProps = {
  style: {},
  onPress: () => null,
}
