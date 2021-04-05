<template>
    <div class="safeDepositBox">
        <div class="backlitScreen" :style="{background: $store.state.screenBacklight}">
            <div id="stateOfLock">{{$store.state.stateOfLock}}</div>
            <div id="stateOfProcess">{{$store.state.stateOfProcess}}</div>
        </div>
        <div class="numKeypad">
            <button v-for="(value, index) in $store.state.btnValues" :key="index" @click="$store.dispatch('inputValue', value)"><p>{{value}}</p></button>
        </div>
        <span>S/N: 4815162342</span>
    </div>
</template>

<script>
export default {
    name: 'SafeDepositBox',
    mounted() {
        // start tajmera od 5s za gasenje ekrana
        this.$store.dispatch('idleScreen');
    }
};
</script>

<style lang="scss" scoped>
    .safeDepositBox {
        position: relative;
        background: #7d7d7f;
        width: 450px;
        height: 700px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        .backlitScreen {
            color: #434343;
            height: 120px;
            width: 85%;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            #stateOfProcess {
                text-align: right;
                font-size: 26px;
            }
        }
        .numKeypad {
            display: grid;
            grid-template-columns: 33% 33% 33%;
            button {
                width: 110px;
                height: 110px;
                margin: 5px;
                background: #63636e;
                color: #f3f3f3;
                border: 1px solid #000;
                border-radius: 5px;
                box-shadow: 0 0 2px #000;
                font-size: 5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &:focus {
                    outline: none;
                }
            }
        }
        span {
            position: absolute;
            bottom: 2px;
            right: 5px;
        }
    }
</style>