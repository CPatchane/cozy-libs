import CozyRealtime from 'cozy-realtime'
import accounts from '../../helpers/accounts'

const ACCOUNT_DOCTYPE = 'io.cozy.accounts'

export class KonnectorAccountWatcher {
  constructor(client, account, options) {
    this.realtime = new CozyRealtime({ cozyClient: client })
    this.account = account
    this.options = options
    this.handleAccountUpdated = this.handleAccountUpdated.bind(this)
  }

  handleAccountUpdated(account) {
    this.account = account
    const { state } = this.account
    if (accounts.isTwoFANeeded(state) || accounts.isTwoFARetry(state)) {
      const { onTwoFACodeAsked } = this.options
      onTwoFACodeAsked(state)
    }
  }

  async watch() {
<<<<<<< HEAD
    const {
      onTwoFACodeAsked,
      onLoginSuccessHandled,
      onLoginSuccess
    } = this.options
    const accountSubscription = await subscribe(
      {
        // Token structure differs between web and mobile
        token:
          this.client.stackClient.token.token ||
          this.client.stackClient.token.accessToken,
        url: this.client.options.uri
      },
=======
    this.realtime.subscribe(
      'updated',
>>>>>>> 80a3f8d... feat(Harvest): Upgrade cozy-realtime
      ACCOUNT_DOCTYPE,
      this.account._id,
      this.handleAccountUpdated
    )
<<<<<<< HEAD

    accountSubscription.onUpdate(updatedAccount => {
      this.account = updatedAccount
      const { state } = this.account
      if (accounts.isTwoFANeeded(state) || accounts.isTwoFARetry(state)) {
        onTwoFACodeAsked(state)
      } else if (accounts.isLoginSuccessHandled(state)) {
        onLoginSuccessHandled(state)
      } else if (accounts.isLoginSuccess(state)) {
        onLoginSuccess(state)
      }
    })
=======
>>>>>>> 80a3f8d... feat(Harvest): Upgrade cozy-realtime
  }
}

export default KonnectorAccountWatcher
