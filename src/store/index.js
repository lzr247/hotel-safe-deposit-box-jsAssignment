import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    btnValues: [9, 8, 7, 6, 5, 4, 3, 2, 1, '*', 0, 'L'],
    screenBacklight: '#7fffff',
    idleScreenTimeout: null,
    idleInputTimeout: null,
    stateOfLock: 'Unlocked',
    stateOfProcessArray: ['Ready', 'Error', 'Locking...', 'Unlocking...', 'Service', 'Validating...'],
    stateOfProcessNoInput: ['Error', 'Locking...', 'Unlocking...', 'Validating...'],
    stateOfProcess: 'Ready',
    serviceStatus: false,
    prePassword: '',
    password: '',
    responseCode: '',
    snCode: '4815162342',
  },
  mutations: {
    idleScreen(state, value) {
      state.screenBacklight = value;
    },
    inputValue(state, value) {
      // clearing idle screen timeout and setting backlight to active version
      clearTimeout(this.idleScreenTimeout);
      state.screenBacklight = '#7fffff';
      if(state.stateOfProcess == 'Service') {
        state.stateOfProcess = '';
        state.serviceStatus = true;
      } 
      if(state.serviceStatus == true) {
        state.prePassword += value;
        state.stateOfProcess += value;
      } 
      else if (value != 'L'){
        if(state.stateOfProcessArray.includes(state.stateOfProcess)) {
          state.stateOfProcess = '';
        }
        // max input length is 6 for normal mode
        if(state.stateOfProcess.length < 6) {
          state.stateOfProcess += value;
          state.prePassword += value;
        }
      }
    },
    inputTimeout(state, value) {
      setTimeout(() => {
        state.stateOfProcess = 'Validating...';
      }, 500);
      setTimeout(() => {
        // if serviceStatus is active, then use value argument to check if it equals S/N code, if it does-UNLOCKED 
        // service mode can only be active while stateOfLock is LOCKED
        if(state.serviceStatus) {
          if(value == state.snCode) {
            setTimeout(() => {
              state.stateOfProcess = 'Unlocking...';
            }, 1500);
            setTimeout(() => {
              state.password = '';
              state.prePassword = '';
              state.stateOfProcess = 'Ready';
              state.stateOfLock = 'Unlocked';
              state.serviceStatus = false;
            }, 4500);
          } else {
            state.stateOfProcess = 'Error';
            setTimeout(() => {
              state.stateOfProcess = 'Service';
            }, 1000);
            state.serviceStatus = true;
          }
        } else {
          // NORMAL MODE
          // first we ask if input value length is 6
          if(state.prePassword.length == 6) {
            // if password doesn't exists and input value IS NOT 6x0 
            if(!state.password && state.prePassword != '000000') {
              setTimeout(() => {
                state.stateOfProcess = 'Locking...';
              }, 1500);
              setTimeout(() => {
                state.password = state.prePassword;
                state.prePassword = '';
                state.stateOfProcess = 'Ready';
                state.stateOfLock = 'Locked';
              }, 4500);
            } else{
              // password exists
              // if password exists + stateOfLock is LOCKED and we input Master code that is 6x0, we go into SERVICE MODE
              if(state.prePassword == '000000' && state.stateOfLock == 'Locked') {
                state.stateOfProcess = 'Service';
              } else {
                  if(state.password == state.prePassword) {
                    setTimeout(() => {
                      state.stateOfProcess = 'Unlocking...';
                    }, 1500);
                    setTimeout(() => {
                      state.password = '';
                      state.prePassword = '';
                      state.stateOfProcess = 'Ready';
                      state.stateOfLock = 'Unlocked';
                    }, 4500);
                  }
                  else {
                    setTimeout(() => {
                      state.stateOfProcess = 'Error';
                    }, 1000);
                    setTimeout(() => {
                      state.stateOfProcess = 'Ready';
                    }, 2500);
                    state.prePassword = '';
                  }
              }
            } 
          } else {
            // if input value length is not 6
            setTimeout(() => {
              state.stateOfProcess = 'Error';
            }, 1000);
            setTimeout(() => {
              state.stateOfProcess = 'Ready';
            }, 2500);
            state.prePassword = '';
          }
        }
      }, 1500);
    }
  },
  actions: {
    idleScreen({state, commit }) {
      this.idleScreenTimeout = setTimeout(() => {
        commit('idleScreen', '#47b2b2');
      }, 5000);
    },
    inputValue({ state, dispatch, commit }, value) {
      // processes in which we CAN'T input values
      if(!state.stateOfProcessNoInput.includes(state.stateOfProcess)) {
        if(this.idleInputTimeout) {
          clearTimeout(this.idleInputTimeout);
        }
        commit('inputValue', value);
        dispatch('inputTimeout', value);
        dispatch('idleScreen');
      }
    },
    inputTimeout({ state, commit }, value) {
      // if we input L char, the 1.2s timeout will not be applied
      if(value == 'L' && !state.serviceStatus) {
        commit('inputTimeout');
      } else {
        this.idleInputTimeout = setTimeout(() => {
          // action that will either commit call to api if the SERVICE mode is active, or commit mutation  
          if(state.serviceStatus == true) {
            axios.get(`https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=${state.prePassword}`)
                 .then( res => {
                    commit('inputTimeout', res.data);
                 })
                 .catch( err => {
                   console.log('error: ', err);
                 })
          } else {
            commit('inputTimeout');
          }
        }, 1200);
      }
    }
  },
  getters: {
  },
  modules: {
  }
})
