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
      }, 300);
      setTimeout(() => {
        switch(state.stateOfLock) {
          // if stateOfLock is UNLOCKED then check if input is correct length and not 6x0 which we use to enter service mode
          case 'Unlocked':
            if(state.prePassword.length == 6 && state.prePassword != '000000') {
              setTimeout(() => {
                state.stateOfProcess = 'Locking...';
              }, 1300);
              setTimeout(() => {
                state.password = state.prePassword;
                state.prePassword = '';
                state.stateOfProcess = 'Ready';
                state.stateOfLock = 'Locked';
              }, 4300);
            } else {
              // if input value length is not 6 or input is 6x0
              setTimeout(() => {
                state.stateOfProcess = 'Error';
              }, 1000);
              setTimeout(() => {
                state.stateOfProcess = 'Ready';
              }, 2000);
              state.prePassword = '';
            }
            break;
          case 'Locked':
            // if locked ask if in service mode or not
            if(state.serviceStatus) {
              // service mode, use value to compare to serial number of box 
              if(value == state.snCode) {
                setTimeout(() => {
                  state.stateOfProcess = 'Unlocking...';
                }, 1300);
                setTimeout(() => {
                  state.password = '';
                  state.prePassword = '';
                  state.stateOfProcess = 'Ready';
                  state.stateOfLock = 'Unlocked';
                  state.serviceStatus = false;
                }, 4300);
              } else {
                state.stateOfProcess = 'Error';
                setTimeout(() => {
                  state.stateOfProcess = 'Service';
                }, 1000);
                state.serviceStatus = true;
              }
            } else {
              // not in service mode just compare passcode and input 
              // but if 6x0 then go into service mode
              if(state.prePassword == '000000') { 
                state.stateOfProcess = 'Service';
              } else {
                if(state.password == state.prePassword) {
                  setTimeout(() => {
                    state.stateOfProcess = 'Unlocking...';
                  }, 1300);
                  setTimeout(() => {
                    state.password = '';
                    state.prePassword = '';
                    state.stateOfProcess = 'Ready';
                    state.stateOfLock = 'Unlocked';
                  }, 4300);
                }
                else {
                  setTimeout(() => {
                    state.stateOfProcess = 'Error';
                  }, 1000);
                  setTimeout(() => {
                    state.stateOfProcess = 'Ready';
                  }, 2000);
                  state.prePassword = '';
                }
              }
            }
            break;
          default:
            break;
        }
      }, 1300);
    }
  },
  actions: {
    idleScreen({ commit }) {
      this.idleScreenTimeout = setTimeout(() => {
        commit('idleScreen', '#47b2b2');
      }, 5000);
    },
    inputValue({ state, dispatch, commit }, value) {
      // processes in which we CAN'T input values
      if(state.btnValues.toString().includes(value)) {
        if(!state.stateOfProcessNoInput.includes(state.stateOfProcess)) {
          if(this.idleInputTimeout) {
            clearTimeout(this.idleInputTimeout);
          }
          commit('inputValue', value);
          dispatch('inputTimeout', value);
          dispatch('idleScreen');
        }
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
