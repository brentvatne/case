import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'

import FeedContainer from './components/FeedContainer'
import AddMenu from '../../components/AddMenu'
import HeaderAwareContainer from '../../components/UI/Layout/HeaderAwareContainer'
import { sendAlert } from '../../components/Alerts'

import alertsQuery from './queries/alerts'

class FeedScreen extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  componentDidUpdate() {
    const { data: { loading, error, alerts } } = this.props

    if (loading || error) return

    const {
      is_confirmed,
      unconfirmed_email,
      is_exceeding_private_connections_limit,
    } = alerts

    if (!is_confirmed) {
      sendAlert({
        id: 'feed:unconfirmed_account',
        type: 'confirmation',
        children: 'Please check your email to confirm your account.',
      })
    }

    if (unconfirmed_email) {
      sendAlert({
        id: 'feed:unconfirmed_email',
        type: 'confirmation',
        children: `Please check your email to confirm ${unconfirmed_email}`,
      })
    }

    if (is_exceeding_private_connections_limit) {
      sendAlert({
        id: 'feed:exceeded_private_connections_limit',
        type: 'alert',
        children: 'You’ve reached your limit of free private blocks. Upgrade to premium to remove this limit.',
      })
    }
  }

  render() {
    return (
      <HeaderAwareContainer>
        <FeedContainer limit={20} />
        <AddMenu />
      </HeaderAwareContainer>
    )
  }
}

const FeedScreenWithData = graphql(alertsQuery, {
  fetchPolicy: 'network-only',
})(FeedScreen)

export default FeedScreenWithData
