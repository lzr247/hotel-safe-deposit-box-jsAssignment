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
    password: '',
  },
  mutations: {
    idleScreen(state, value) {
      state.screenBacklight = value;
    },
    inputValue(state, inputValue) {
      if(!state.password) {
        if(state.stateOfProcessArray.includes(state.stateOfProcess)) {
          state.stateOfProcess = '';
        }
        if(state.stateOfProcess.length < 6) {
          state.stateOfProcess += inputValue;
        }
        state.screenBacklight = '#7fffff';
        clearTimeout(this.idleScreenTimeout)
      } else {
        // password exists - validation
        if(state.stateOfProcessArray.includes(state.stateOfProcess)) {
          state.stateOfProcess = '';
        }
        if(state.stateOfProcess.length < 6) {
          state.stateOfProcess += inputValue;
        } 
        if(state.stateOfProcess.length == 6) {
          if(state.password == state.stateOfProcess) {
            // validacija bla bla
            state.stateOfProcess = 'Validating...';
            this.idleInputTimeout = setTimeout(() => {
              state.stateOfProcess = 'Unlocking...';
            }, 2000);
            setTimeout(() => {
              state.stateOfProcess = 'Ready';
              state.password = '';
              state.stateOfLock = 'Unlocked';
            }, 4000);

          } else {
            state.stateOfProcess = 'Validating...';
            this.idleInputTimeout = setTimeout(() => {
              state.stateOfProcess = 'Error';
            }, 2000);
          }
        }
      
        console.log('state of processes', state.stateOfProcess);
        state.screenBacklight = '#7fffff';
        clearTimeout(this.idleScreenTimeout)
      }
    },
    inputTimeout(state) {
      if(state.stateOfProcess.length == 6 && state.password.length == 0) {
        state.password = state.stateOfProcess;
        state.stateOfProcess = 'Locking...';
        this.idleInputTimeout = setTimeout(() => {
          state.stateOfLock = 'Locked';
          state.stateOfProcess = 'Ready'
        }, 3000);
      } else if(state.password.length < 6){
        //ne treba error, treba da li je tacan
        state.stateOfProcess = 'Error';
      }
    }
  },
  actions: {
    idleScreen({ commit }) {
      this.idleScreenTimeout = setTimeout(() => {
        commit('idleScreen','#47b2b2');
      }, 5000)
    },
    inputValue({ dispatch, commit }, value) { 
      if(this.idleInputTimeout) {
        clearTimeout(this.idleInputTimeout);
      }
      commit('inputValue', value);
      dispatch('idleScreen');
      dispatch('inputTimeout');
    },
    inputTimeout({ commit }) {
      this.idleInputTimeout = setTimeout(() => {
        commit('inputTimeout');
      }, 1200);
    }
  },
  getters: {
  },
  modules: {
  }
})
