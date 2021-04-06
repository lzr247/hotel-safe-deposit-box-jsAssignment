import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    btnValues: [9, 8, 7, 6, 5, 4, 3, 2, 1, '*', 0, 'L'],
    screenBacklight: '#7fffff',
    idleScreenTimeout: null,
    idleInputTimeout: null,
    stateOfLock: 'Unlocked',
    stateOfProcessArray: ['Ready', 'Error', 'Locking...', 'Unlocking...', 'Service', 'Validating...'],
    stateOfProcess: 'Ready',
    prePassword: '',
    password: '',
  },
  mutations: {
    idleScreen(state, value) {
      state.screenBacklight = value;
    },
    inputValue(state, value) {
      clearTimeout(this.idleScreenTimeout);
      state.screenBacklight = '#7fffff';
      if(value != 'L'){
        if(state.stateOfProcessArray.includes(state.stateOfProcess)) {
          state.stateOfProcess = '';
        }
        if(state.stateOfProcess.length < 6) {
          state.stateOfProcess += value;
          state.prePassword += value;
        }
      }
    },
    inputTimeout(state) {
      //provera unosa 
      setTimeout(() => {
        state.stateOfProcess = 'Validating...';
      }, 500);
      setTimeout(() => {
        // tacan unos
        if(state.prePassword.length == 6) {
          console.log('pass je 6');
          //ako je tacan unos onda pitam da li password postoji
          if(!state.password) {
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
            // password postoji
            // tacan password
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
        } else {
          setTimeout(() => {
            state.stateOfProcess = 'Error';
          }, 1000);
          setTimeout(() => {
            state.stateOfProcess = 'Ready';
          }, 2500);
          state.prePassword = '';
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
    inputValue({ dispatch, commit }, value) {
      if(this.idleInputTimeout) {
        clearTimeout(this.idleInputTimeout);
      }
      commit('inputValue', value);
      dispatch('inputTimeout', value);
      dispatch('idleScreen');
    },
    inputTimeout({ commit }, value) {
      if(value == 'L') {
        commit('inputTimeout');
      } else {
        this.idleInputTimeout = setTimeout(() => {
          commit('inputTimeout');
        }, 1200);
      }
    }
  },
  getters: {
  },
  modules: {
  }
})
