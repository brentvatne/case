import headerNavigationOptions from '../../constants/Header'

import EditAccountNameScreen from './EditAccountNameScreen'
import EditAccountBioScreen from './EditAccountBioScreen'
import EditAccountEmailScreen from './EditAccountEmailScreen'
import EditEmailNotificationsScreen from './EditEmailNotificationsScreen'
import EditAccountReceiveNewsletter from './EditAccountReceiveNewsletter'

export default {
  editAccountName: {
    screen: EditAccountNameScreen,
    navigationOptions: {
      title: 'Name',
      ...headerNavigationOptions,
    },
  },

  editAccountBio: {
    screen: EditAccountBioScreen,
    navigationOptions: {
      title: 'Bio',
      ...headerNavigationOptions,
    },
  },

  editAccountEmail: {
    screen: EditAccountEmailScreen,
    navigationOptions: {
      title: 'Email',
      ...headerNavigationOptions,
    },
  },

  editEmailNotifications: {
    screen: EditEmailNotificationsScreen,
    navigationOptions: {
      title: 'Email Preferences',
      ...headerNavigationOptions,
    },
  },

  editAccountReceiveNewsletter: {
    screen: EditAccountReceiveNewsletter,
    navigationOptions: {
      title: 'Newsletter',
      ...headerNavigationOptions,
    },
  },
}
