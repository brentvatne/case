import React from 'react'
import { FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { gql, graphql } from 'react-apollo'

import SearchResult from './SearchResult'
import { RelativeFill } from '../../../components/UI/Layout'
import LoadingScreen from '../../../components/LoadingScreen'
import ErrorScreen from '../../../components/ErrorScreen'
import { GenericMessage } from '../../../components/UI/Alerts'

import { Units } from '../../../constants/Style'

class SearchContents extends React.Component {
  static propTypes = {
    q: PropTypes.string,
    data: PropTypes.object,
  }

  static defaultProps = {
    q: null,
    data: {},
  }

  keyExtractor = (item, index) =>
    `${item.klass}-${item.id}-${index}`

  renderItem = ({ item }) =>
    <SearchResult item={item} />

  render() {
    const { q } = this.props

    if (!q) {
      return (
        <RelativeFill>
          <GenericMessage>
            Start typing
          </GenericMessage>
        </RelativeFill>
      )
    }

    const { data: { loading, error, networkStatus, search } } = this.props

    // Handle our own loading/errors since we need to account for empty queries
    if (loading) {
      return <LoadingScreen />
    }

    if (error) {
      return (
        <ErrorScreen
          error={error}
        />
      )
    }

    if (search.length === 0) {
      return (
        <RelativeFill>
          <GenericMessage>
            No results found
          </GenericMessage>
        </RelativeFill>
      )
    }

    return (
      <FlatList
        contentContainerStyle={{
          backgroundColor: 'white',
          paddingHorizontal: Units.scale[3],
        }}
        data={search}
        refreshing={networkStatus === 4}
        onRefresh={this.onRefresh}
        keyboardShouldPersistTaps="always"
        keyExtractor={this.keyExtractor}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.9}
        renderItem={this.renderItem}
      />
    )
  }
}

const SearchQuery = gql`
  query SearchQuery($q: String!, $type: SearchType) {
    search(q: $q, per: 15, type: $type) {
      ... on User {
        ...UserItem
      }
      ... on Connectable {
        ...ConnectableItem
      }
      ... on Channel {
        ...ChannelItem
      }
    }
  }
  ${SearchResult.fragments.connectable}
  ${SearchResult.fragments.user}
  ${SearchResult.fragments.channel}
`

export default graphql(SearchQuery, {
  // Execute query only if there is a query to execute
  skip: ({ q }) => isEmpty(q),
  options: { fetchPolicy: 'network-only' },
})(SearchContents)
