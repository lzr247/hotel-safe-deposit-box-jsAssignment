# hotel-safe-deposit-box

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Hotel Safe Deposit Box Simulator

### Locking

Simulator is implemented using VueJS and Sass/SCSS.
The simulation box can be LOCKED or UNLOCKED.
To lock the box, we need to input 6 digit passcode.
In UNLOCKED mode, 6 is the maximum length we can input, while if input has less than that, the box will return Error.
We have to input values in sequence, and the time between input should not exceed 1.2s, or it will process the input until the last one. We can also use 'L' button to lock the door right after our last input, without waiting for 1.2s to process the given input.
The box will validate input for 1s and if the input is correct, the box will do the 'Locking...' for 3s, and then the state will change to LOCKED.
We can only input value while 'Ready' is active, we cannot input anything while one of the following: 'Error', 'Locking...', 'Unlocking...', 'Validating...'.
In UNLOCKED mode we cannot use six zeros as a passcode, mainly because it is reserved to enter the Service mode when state is LOCKED.
If we do not input anything for 5s, the screen will get darker.

### Unlocking

To unlock the box we need to input the same passcode we used to lock it. Again, input should be length of 6, it cannnot be longer than that, and the shorter length of input will give Error.
If we input the passcode that was supposed to be the correct one, the system will spend 1s validating it, and if it is correct, it will spend 3s Unlocking the box. After that, the state of the box will be UNLOCKED, and the system will be ready to be locked again.

### Service mode

If we forget the passcode we used to lock the box, the hotel stuff can enter six zeros to enter Service mode. The Service mode can only be activated if the state of the box is LOCKED.
After entering Service mode, the stuff can enter master code of unknown length, so the previous limit to 6 characters is not valid anymore. When input is completed, master code is sent to validation endpoint and is waiting for response. The response should be Serial Number of the box, if the master code was the right one, and then the box should be UNLOCKED again. If the response doesn't match the serial number of the box, the error will be shown.
