import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import ChannelHeader from './ChannelHeader'
import ChannelItem from '../../../components/ChannelItem'
import BlockItem from '../../../components/BlockItem'
import Empty from '../../../components/Empty'
import layout from '../../../constants/Layout'
import scrollHeaderVisibilitySensor from '../../../utilities/scrollHeaderVisibilitySensor'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    minHeight: 700,
    paddingBottom: layout.topbar * 2,
  },
  channelItem: {
    marginHorizontal: layout.padding,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.padding,
  },
  footer: {
    paddingVertical: layout.padding * 2,
  },
})

class ChannelContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: props.page,
      type: props.type,
    }
    this.onEndReached = this.onEndReached.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onToggleChange = this.onToggleChange.bind(this)
    this.renderLoader = this.renderLoader.bind(this)
  }

  componentDidMount() {
    scrollHeaderVisibilitySensor.dispatch(false)
  }

  onRefresh() {
    this.setState({ page: 1 })
    this.props.data.refetch({ notifyOnNetworkStatusChange: true })
  }

  onEndReached() {
    const { blocksData } = this.props
    if (!blocksData.channel || !blocksData.channel.blocks) return false

    const { loading, channel } = this.props.data
    const { channel: { blocks } } = this.props.blocksData
    const type = `${this.state.type.toLowerCase()}s`
    const total = channel.counts[type]

    if (loading) return false
    if (blocks.length >= total) return false
    const page = this.state.page + 1
    this.setState({ page })
    return this.props.loadMore(page)
  }

  onToggleChange(type) {
    this.setState({ page: 1, type }, () => {
      if (type !== 'CONNECTION') {
        this.props.blocksData.refetch({ page: 1, type })
      }
    })
  }

  renderLoader() {
    if (!this.props.blocksData.loading) return null
    return (
      <ActivityIndicator animating size="small" style={styles.footer} />
    )
  }

  render() {
    const { data, blocksData, connectionsData } = this.props
    const { error, loading, channel } = this.props.data
    const { type } = this.state

    if (error) {
      console.log('channel', channel, error)
      return (
        <View style={styles.loadingContainer} >
          <Text>
            Channel not found
          </Text>
        </View>
      )
    }

    if (loading) {
      return (
        <View style={styles.loadingContainer} >
          <ActivityIndicator />
        </View>
      )
    }

    const columnCount = type === 'CHANNEL' || type === 'CONNECTION' ? 1 : 2
    const columnStyle = columnCount > 1 ? { justifyContent: 'space-around' } : false

    const contentsData = type === 'CONNECTION' ? connectionsData : blocksData
    const contentsKey = type === 'CONNECTION' ? 'connections' : 'blocks'

    const contents = (
      contentsData.networkStatus !== 2 &&
      contentsData &&
      contentsData.channel &&
      contentsData.channel[contentsKey]
    ) || []

    const header = (
      <ChannelHeader
        channel={channel}
        onToggle={this.onToggleChange}
        type={type}
      />
    )
    const empty = (
      <Empty text={`No connected ${type.toLowerCase()}s`} />
    )

    const contentsLoading = contentsData.networkStatus === 2 || contentsData.networkStatus === 1

    if (contents.length === 0 && !contentsLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {header}
          {empty}
        </View>
      )
    }

    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.container}
        data={contents}
        columnWrapperStyle={columnStyle}
        refreshing={data.networkStatus === 4}
        numColumns={columnCount}
        keyExtractor={(item, index) => `${item.klass}-${item.id}-${index}`}
        key={type}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.9}
        scrollEventThrottle={50}
        onScroll={scrollHeaderVisibilitySensor}
        ListFooterComponent={this.renderLoader}
        ListHeaderComponent={header}
        renderItem={({ item }) => {
          if (item.klass === 'Block') {
            return <BlockItem block={item} />
          }
          return <ChannelItem channel={item} style={styles.channelItem} />
        }}
      />
    )
  }
}

const ChannelQuery = gql`
  query ChannelQuery($id: ID!){
    channel(id: $id) {
      __typename
      id
      slug
      title
      description(format: HTML)
      visibility
      can {
        follow
      }
      user {
        id
        name
        slug
      }
      visibility
      counts {
        blocks
        channels
        connections
      }
    }
  }
`

const ChannelBlocksQuery = gql`
  query ChannelBlocksQuery($id: ID!, $page: Int!, $type: ConnectableTypeEnum){
    channel(id: $id) {
      __typename
      id
      blocks(per: 10, page: $page, sort_by: POSITION, direction: DESC, type: $type) {
        ...BlockThumb
      }
    }
  }
  ${BlockItem.fragments.block}
`

const ChannelConnectionsQuery = gql`
  query ChannelBlocksQuery($id: ID!){
    channel(id: $id) {
      __typename
      id
      connections {
        ...ChannelThumb
      }
    }
  }
  ${ChannelItem.fragments.channel}
`

ChannelContainer.propTypes = {
  data: PropTypes.any.isRequired,
  blocksData: PropTypes.any.isRequired,
  connectionsData: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['CHANNEL', 'BLOCK']).isRequired,
  loadMore: PropTypes.any.isRequired,
  page: PropTypes.number,
}

ChannelContainer.defaultProps = {
  page: 1,
}

const ChannelContainerWithData = compose(
  graphql(ChannelQuery),
  graphql(ChannelConnectionsQuery, { name: 'connectionsData' }),
  graphql(ChannelBlocksQuery, {
    name: 'blocksData',
    options: ({ id, page, type }) => ({
      variables: { id, page, type },
      notifyOnNetworkStatusChange: true,
    }),
    props: (props) => {
      const { blocksData } = props
      const { id, type } = blocksData.variables
      return {
        blocksData,
        loadMore(page) {
          return props.blocksData.fetchMore({
            variables: {
              id,
              page,
              type,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult.channel.blocks.length) { return previousResult }
              const { __typename } = previousResult.channel
              const response = {
                channel: {
                  __typename,
                  id,
                  blocks: [...previousResult.channel.blocks, ...fetchMoreResult.channel.blocks],
                },
              }
              return response
            },
          })
        },
      }
    },
  }),
)(ChannelContainer)

export default ChannelContainerWithData
