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
      clearTimeout(this.idleScreenTimeout);
      state.screenBacklight = '#7fffff';
      if(state.stateOfProcess == 'Service') {
        state.stateOfProcess = '';
        state.serviceStatus = true;
      } else if(state.serviceStatus == true) {
        state.prePassword += value;
        state.stateOfProcess += value;
      } 
      else if (value != 'L' && !state.serviceStatus){
        if(state.stateOfProcessArray.includes(state.stateOfProcess)) {
          state.stateOfProcess = '';
        }
        if(state.stateOfProcess.length < 6) {
          state.stateOfProcess += value;
          state.prePassword += value;
        }
      }
    },
    inputTimeout(state, value) {
      //provera unosa 
      setTimeout(() => {
        state.stateOfProcess = 'Validating...';
      }, 500);
      setTimeout(() => {
        // trebam da pitam is service true, ako jeste onda krajnji prePass saljem na api
        if(state.serviceStatus) {
          // poredim value koji sam vratio sa sn-om 
          // ako je tacan unlocked -> service status = false
          // ako nije tacan error => service
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
          // ako nije service status onda normalno proveravam sifru
          // tacan unos
          if(state.prePassword.length == 6) {
            //ako je tacan unos onda pitam da li password postoji
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
            } else {
              // 
              // password postoji
              // tacan password
              if(state.prePassword == '000000') {
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
                // netacan password
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
    idleScreen({ commit }) {
      this.idleScreenTimeout = setTimeout(() => {
        commit('idleScreen', '#47b2b2');
      }, 5000);
    },
    inputValue({ state, dispatch, commit }, value) {
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
      if(value == 'L' && !state.serviceStatus) {
        commit('inputTimeout');
      } else {
        this.idleInputTimeout = setTimeout(() => {
          if(state.serviceStatus == true) {
            axios.get(`https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=${state.prePassword}`)
                 .then( res => {
                    commit('inputTimeout', res.data);
                 })
                 .catch( err => {
                   console.log('greska');
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
