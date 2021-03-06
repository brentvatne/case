import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pick } from 'lodash'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { TouchableOpacity, View } from 'react-native'

import currentUserService, { LoginFragment } from '../../utilities/currentUserService'
import formatErrors from '../../utilities/formatErrors'
import navigationService from '../../utilities/navigationService'
import wait from '../../utilities/wait'
import flagService from '../../utilities/flagService'

import Alerts, { sendAlert, dismissAllAlerts } from '../../components/Alerts'
import { StatusMessage } from '../../components/UI/Alerts'
import LargeButton from '../../components/UI/Buttons/LargeButton'
import { UnderlineInput } from '../../components/UI/Inputs'
import { Section, CenteringPane, CenterColumn } from '../../components/UI/Layout'
import { SmallLogo } from '../../components/UI/Logos'

import { Units } from '../../constants/Style'

class LoginScreen extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  state = {
    email: '',
    password: '',
    isLoggingIn: false,
  }

  onChangeText = key => (value) => {
    this.setState({
      [key]: value,
    })
  }

  onSubmit = async () => {
    dismissAllAlerts()

    const { login } = this.props
    const variables = pick(this.state, ['email', 'password'])

    this.setState({ isLoggingIn: true })

    await wait(250)

    return login({ variables })
      .then(({ data: { login: { me } } }) => {
        currentUserService.set(me)
      })

      .then(() => {
        // Changing this value will cause *all* users to see onboarding again
        const ONBOARDING_KEY = 'onboarding'

        return flagService
          .check(ONBOARDING_KEY)
          .then(isFlagged =>
            (isFlagged ? 'feed' : 'onboarding'),
          )
      })

      .then(routeName =>
        navigationService.reset(routeName),
      )

      .catch(async (err) => {
        const error = formatErrors(err)

        sendAlert({ children: error })

        this.setState({
          isLoggingIn: false,
        })
      })
  }

  render() {
    const { isLoggingIn, email } = this.state

    return (
      <CenteringPane>
        {isLoggingIn &&
          <View>
            <SmallLogo alignSelf="center" />
            <StatusMessage>
              Logging in…
            </StatusMessage>
          </View>
        }

        {!isLoggingIn &&
          <View width="100%">
            <Section space={3}>
              <TouchableOpacity onPress={() => navigationService.reset('loggedOut')}>
                <SmallLogo alignSelf="center" />
              </TouchableOpacity>
            </Section>

            <UnderlineInput
              autoCapitalize="none"
              placeholder="Email address"
              keyboardType="email-address"
              onChangeText={this.onChangeText('email')}
              autoCorrect={false}
              autoFocus={!email}
              value={email}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.PasswordInput.focus()
              }}
            />

            <UnderlineInput
              secureTextEntry
              placeholder="Password"
              autoCapitalize="none"
              onChangeText={this.onChangeText('password')}
              autoCorrect={false}
              autoFocus={!!email}
              returnKeyType="done"
              onSubmitEditing={this.onSubmit}
              ref={ref => this.PasswordInput = ref}
            />

            <Section space={4}>
              <CenterColumn>
                <LargeButton onPress={this.onSubmit}>
                  Log In
                </LargeButton>
              </CenterColumn>
            </Section>
          </View>
        }

        <Alerts style={{ top: Units.statusBarHeight }} />
      </CenteringPane>
    )
  }
}

const login = gql`
  mutation login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      clientMutationId
      me {
        ...Login
      }
    }
  }
  ${LoginFragment}
`

const LoginScreenWithData = graphql(login, { name: 'login' })(LoginScreen)

export default LoginScreenWithData
