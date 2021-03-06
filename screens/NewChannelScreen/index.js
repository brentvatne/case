import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import ChannelForm from '../../components/Form/ChannelForm'

import navigationService from '../../utilities/navigationService'
import alertErrors from '../../utilities/alertErrors'

import { Colors } from '../../constants/Style'

class NewChannelScreen extends Component {
  onSubmit = (variables) => {
    const { mutate } = this.props

    return mutate({ variables })
      .then(({ data }) => {
        const {
          create_channel: {
            channel: { id, title, visibility },
          },
        } = data

        navigationService.reset('channel', {
          id, title, color: Colors.channel[visibility],
        })
      })

      .catch(alertErrors)
  }

  render() {
    const { navigation } = this.props

    return (
      <ChannelForm
        mode="NEW"
        navigation={navigation}
        onSubmit={this.onSubmit}
      />
    )
  }
}

NewChannelScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
}

const createChannelMutation = gql`
  mutation createChannelMutation($title: String!, $description: String, $visibility: ChannelVisibility){
    create_channel(input: { title: $title, description: $description, visibility: $visibility }) {
      clientMutationId
      channel {
        ...ChannelForm
      }
    }
  }
  ${ChannelForm.fragments.channelForm}
`

const NewChannelScreenWithData = graphql(createChannelMutation)(NewChannelScreen)

export default NewChannelScreenWithData
