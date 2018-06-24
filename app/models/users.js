import update from 'react-addons-update'
import _ from 'lodash'
import { createAction } from '../utils'
import { get, post, destroy } from '../utils/RESTUtils'

export default {
  namespace: 'users',
  state: {
    records: [],
    activeRecord: {},
  },
  reducers: {
    loadUsers(state, { payload }) {
      return update(state, {
        records: {
          $set: payload,
        },
      })
    },
    loadUser(state, { payload }) {
      return update(state, {
        activeRecord: {
          $set: payload,
        },
      })
    },
  },
  effects: {
    getUsers: [
      function*({ callback = null },{ call, put }) {
        try {
          const data = yield get('/api/v1/users/exceptme')

          if (!_.isEmpty(data)) {
            yield put(createAction('loadUsers')(data.data))
          }
        } catch (e) {
          console.log('Error found ', e)
        }
      },

      { type: 'takeLatest' },
    ],
    getUser: [
      function*({ payload, callback = null },{ call, put }) {
        try {
          const data = yield get('/api/v1/user/' + payload.id)
          if (!_.isEmpty(data)) {
            
            yield put(createAction('loadUser')(data.data))
            
            if(callback)
              callback(data.data)
          }
        } catch (e) {
          console.log('Error found ', e)
        }
      },

      { type: 'takeLatest' },
    ],
    addUser: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield post('/api/v1/event', payload)

          if (!_.isEmpty(data)) {
            if (callback) {
              callback(true)
            }
          }
          yield put(createAction('loadUsers')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ]
  },
}
