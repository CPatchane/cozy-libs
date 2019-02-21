/* eslint-env jest */
import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TriggerManager } from 'components/TriggerManager'

configure({ adapter: new Adapter() })

const triggersHelper = require('helpers/triggers')

const fixtures = {
  data: {
    username: 'foo',
    passphrase: 'bar'
  },
  konnector: {
    slug: 'konnectest'
  },
  triggerAttributes: {
    arguments: '0 0 0 * * 0',
    type: '@cron',
    worker: 'konnector',
    message: {
      account: 'a87f9a8bd3884479a48811e7b7deec75',
      konnector: 'konnectest'
    }
  },
  account: {
    _id: 'a87f9a8bd3884479a48811e7b7deec75',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    }
  },
  updatedAccount: {
    _id: 'a87f9a8bd3884479a48811e7b7deec75',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'fuz'
    }
  },
  createdTrigger: {
    id: '669e9a7cc3064a97bc0aa20feef71cb2',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'a87f9a8bd3884479a48811e7b7deec75',
        konnector: 'konnectest'
      }
    }
  },
  launchedJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  },
  runningJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  },
  doneJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'done',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  }
}

const createTriggerMock = jest.fn().mockResolvedValue(fixtures.createdTrigger)
const launchTriggerMock = jest.fn().mockResolvedValue(fixtures.launchedJob)
const waitForLoginSuccessMock = jest.fn().mockResolvedValue(fixtures.runningJob)

const onDoneSpy = jest.fn()
const onLoginSuccessSpy = jest.fn()

const shallowAccountCreator = () =>
  shallow(
    <TriggerManager
      konnector={fixtures.konnector}
      createTrigger={createTriggerMock}
      launchTrigger={launchTriggerMock}
      onDone={onDoneSpy}
      onLoginSuccess={onLoginSuccessSpy}
      waitForLoginSuccess={waitForLoginSuccessMock}
    />
  )

const shallowAccountEditor = () =>
  shallow(
    <TriggerManager
      account={fixtures.account}
      createTrigger={createTriggerMock}
      konnector={fixtures.konnector}
      launchTrigger={launchTriggerMock}
      onDone={onDoneSpy}
      onLoginSuccess={onLoginSuccessSpy}
      trigger={fixtures.createdTrigger}
      waitForLoginSuccess={waitForLoginSuccessMock}
    />
  )

describe('TriggerManager', () => {
  afterEach(() => {
    createTriggerMock.mockClear()
    launchTriggerMock.mockClear()
    onDoneSpy.mockClear()
    onLoginSuccessSpy.mockClear()
    waitForLoginSuccessMock.mockClear()
  })

  it('should render AccountCreator', () => {
    const component = shallowAccountCreator().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render AccountEditor', () => {
    const component = shallowAccountEditor().getElement()
    expect(component).toMatchSnapshot()
  })

  describe('handleAccountMutation', () => {
    it('should render AccountCreator as submitting', () => {
      const wrapper = shallowAccountCreator()
      wrapper.instance().handleAccountMutation()
      expect(wrapper.props().submitting).toEqual(true)
    })

    it('should render AccountCreator as submitting', () => {
      const wrapper = shallowAccountEditor()
      wrapper.instance().handleAccountMutation()
      expect(wrapper.props().submitting).toEqual(true)
    })
  })

  describe('handleAccountCreationSuccess', () => {
    beforeAll(() => {
      jest
        .spyOn(triggersHelper, 'buildKonnectorCron')
        .mockReturnValue('0 0 0 * * 0')
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should create trigger', async () => {
      const wrapper = shallowAccountCreator()
      await wrapper.instance().handleAccountCreationSuccess(fixtures.account)
      expect(createTriggerMock).toHaveBeenCalledTimes(1)
      expect(createTriggerMock).toHaveBeenCalledWith(fixtures.triggerAttributes)
    })

    it('should launch trigger', async () => {
      const wrapper = shallowAccountCreator()
      await wrapper.instance().handleAccountCreationSuccess(fixtures.account)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    it('should render TriggerSuccessMessage', async () => {
      const wrapper = shallowAccountCreator()
      await wrapper.instance().handleAccountCreationSuccess(fixtures.account)
      const component = wrapper.getElement()
      expect(component).toMatchSnapshot()
    })
  })

  describe('handleAccountUpdateSuccess', () => {
    it('should launch trigger', async () => {
      const wrapper = shallowAccountEditor()
      await wrapper
        .instance()
        .handleAccountUpdateSuccess(fixtures.updatedAccount)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    it('should render AccountEditor with updated account', async () => {
      const wrapper = shallowAccountEditor()
      await wrapper
        .instance()
        .handleAccountUpdateSuccess(fixtures.updatedAccount)
      expect(wrapper.props().account).toEqual(fixtures.updatedAccount)
    })
  })

  describe('launch', () => {
    it('should launch trigger', async () => {
      const wrapper = shallowAccountCreator()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    it('should wait for successful login', async () => {
      const wrapper = shallowAccountCreator()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(waitForLoginSuccessMock).toHaveBeenCalledTimes(1)
      expect(waitForLoginSuccessMock).toHaveBeenCalledWith(fixtures.launchedJob)
    })

    it('should call onLoginSuccess', async () => {
      const wrapper = shallowAccountCreator()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(onLoginSuccessSpy).toHaveBeenCalledTimes(1)
      expect(onLoginSuccessSpy).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    it('should not call onLoginSucces if job is done', async () => {
      waitForLoginSuccessMock.mockResolvedValue(fixtures.doneJob)
      const wrapper = shallowAccountCreator()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(onLoginSuccessSpy).not.toHaveBeenCalled()
      waitForLoginSuccessMock.mockResolvedValue(fixtures.runningJob)
    })
  })
})