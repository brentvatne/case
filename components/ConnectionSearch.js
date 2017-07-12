import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import ConnectionItem from './ConnectionItem'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

class ConnectionSearch extends Component {
  shouldComponentUpdate(newProps) {
    if (newProps.data && newProps.data.loading) { return false }
    return true
  }

  render() {
    const { q, onToggleConnection } = this.props

    if (this.props.data && this.props.data.error) {
      return (
        <View>
          <Text>
            No results found
          </Text>
        </View>
      )
    }

    if (this.props.data && this.props.data.loading) {
      return (
        <View>
          <Text>Searching for {q}</Text>
        </View>
      )
    }

    const connections = []

    this.props.data.me.connection_search.forEach(connection =>
      connections.push(
        <ConnectionItem
          connection={connection}
          onToggleConnection={onToggleConnection}
          key={connection.id}
        />,
      ),
    )

    return (
      <View style={styles.container}>
        {connections}
      </View>
    )
  }
}

const ConnectionSearchQuery = gql`
  query ConnectionSearchQuery($q: String!) {
    me {
      name
      connection_search(q: $q) {
        ...Connection
      }
    }
  }
  ${ConnectionItem.fragments.connection}
`

ConnectionSearch.propTypes = {
  data: PropTypes.any.isRequired,
  q: PropTypes.string.isRequired,
  onToggleConnection: PropTypes.func,
}

ConnectionSearch.defaultProps = {
  onToggleConnection: () => null,
}


const ConnectionSearchWithData = graphql(ConnectionSearchQuery)(ConnectionSearch)

export default ConnectionSearchWithData