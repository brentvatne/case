import React from 'react'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'

import ChannelHeader from './ChannelHeader'
import ChannelContents from './ChannelContents'

import withLoadingAndErrors from '../../../hocs/withLoadingAndErrors'

import navigationService from '../../../utilities/navigationService'

import channelQuery from '../queries/channel'

class ChannelContainer extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['CHANNEL', 'BLOCK', 'CONNECTION']).isRequired,
    page: PropTypes.number.isRequired,
    channelData: PropTypes.object.isRequired,
    navigation: PropTypes.shape({
      state: PropTypes.object.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    page: 1,
  }

  constructor(props) {
    super(props)

    this.state = {
      page: props.page,
      type: props.type,
    }
  }

  shouldComponentUpdate({ navigation: { state } }) {
    // Determine if the current route is onscreen and only render if it is active.
    return navigationService.isStateCurrentState(state)
  }

  onToggleChange = (type) => {
    this.setState({ page: 1, type })
  }

  render() {
    const { channelData, channelData: { channel } } = this.props
    const { type, page } = this.state

    const Header = (
      <ChannelHeader
        type={type}
        channel={channel}
        onToggle={this.onToggleChange}
      />
    )

    return (
      <ChannelContents
        id={channel.id}
        channel={channel}
        channelData={channelData}
        type={type}
        page={page}
        header={Header}
      />
    )
  }
}

const DecoratedChannelContainer = withLoadingAndErrors(ChannelContainer, {
  dataKeys: ['channelData'],
  errorMessage: 'Error getting this channel',
  showRefresh: true,
})

const ChannelContainerWithData = compose(
  graphql(channelQuery, {
    name: 'channelData',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
)(DecoratedChannelContainer)

export default ChannelContainerWithData
