<template>
    <div class="safeDepositBox">
        <div class="backlitScreen" :style="{background: $store.state.screenBacklight}">
            <div id="stateOfLock">{{$store.state.stateOfLock}}</div>
            <div id="stateOfProcess">{{$store.state.stateOfProcess}}</div>
        </div>
        <div class="numKeypad">
            <button v-for="(value, index) in $store.state.btnValues" :key="index" @click="$store.dispatch('inputValue', value)">
                {{value}}
                <!-- <p v-if="(index+1)%2==0">{{btnIcons[index]}}</p> -->
                <p v-if="index == 1">&#129045;</p>
                <p v-if="index == 3">&#129044;</p>
                <p v-if="index == 5">&#129046;</p>
                <p v-if="index == 7">&#129047;</p>
                <p v-if="index == 9">B</p>
                <p v-if="index == 11">A</p>
            </button>
        </div>
        <span>S/N: 4815162342</span>
    </div>
</template>

<script>
export default {
    name: 'SafeDepositBox',
    data() {
        return {
            btnIcons: ['&#129045;', '&#129044;', '&#129046;', '&#129047;', 'B', 'A'],
        }
    },
    mounted() {
        this.$store.dispatch('idleScreen');
    }
};
</script>

<style lang="scss" scoped>
    .safeDepositBox {
        position: relative;
        background: #7d7d7f;
        width: 500px;
        height: 700px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        border: 2px solid #000;
        border-radius: 5px;
        box-shadow: 0 0 1px #000;
        .backlitScreen {
            color: #434343;
            height: 140px;
            width: 85%;
            border-radius: 5px;
            border: 1px solid #434343;
            box-shadow: 0 0 2px #434343;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            #stateOfProcess {
                text-align: right;
                font-size: 3rem;
                position: absolute;
                bottom: 5px;
                right: 10px;
            }
            #stateOfLock {
                font-size: 1.3rem;
                position: absolute;
                top: 5px;
                left: 10px;
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
                position: relative;
                &:focus {
                    outline: none;
                }
                p {
                    font-size: 20px;
                    font-weight: bold;
                    position: absolute;
                    bottom: 0;
                    right: 5px;
                    margin: 0;
                    color: #434343;
                }
            }
        }
        span {
            position: absolute;
            bottom: 3px;
            right: 5px;
        }
    }
</style>