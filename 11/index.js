import { createMachine, interpret } from 'xstate';

const elApp = document.querySelector('#app');
const elOffButton = document.querySelector('#offButton');
const elOnButton = document.querySelector('#onButton');
const elModeButton = document.querySelector('#modeButton');

const displayMachine = createMachine({
  initial: 'hidden',
  states: {
    hidden: {
      on: {
        TURN_ON: 'visible.hist',
      },
    },
    visible: {
      // Add parallel states here for:
      // - mode (light or dark)
      // - brightness (bright or dim)
      // See the README for how the child states of each of those
      // parallel states should transition between each other.
      type: 'parallel',
      states: {
        //Shallow and Deep History(read below)
        hist: {
          type: 'history',
          history: 'deep'
        },
        mode: {
          initial: 'light',
          states: {
            light: {
              on: {
                SWITCH: 'dark'
              }
            },
            dark: {
              on: {
                SWITCH: 'light'
              }
            }
          }
        },
        brightness: {
          initial: 'bright',
          states: {
            bright: {
              after: {
                2000: 'dim'
              }
            },
            dim: {
              on: {
                SWITCH: 'bright'
              }
            }
          }
        }
      },
      on: {
        TURN_OFF: 'hidden'
      }
    },
  },
});

const displayService = interpret(displayMachine)
  .onTransition((state) => {
    console.log(state.value);
    elApp.dataset.state = state.toStrings().join(' ');
  })
  .start();

elOnButton.addEventListener('click', () => {
  displayService.send('TURN_ON');
});

elOffButton.addEventListener('click', () => {
  displayService.send('TURN_OFF');
});

elModeButton.addEventListener('click', () => {
  displayService.send('SWITCH');
});

//Shallow and Deep History

/*
There's shallow and deep history. Shallow remembers the immediate child (mode and brightness).

Deep remembers all descendants (light/dark, bright/dim). And so in this case, our immediate children are mode and brightness, which we know are both active anyway. So it doesn't help us too much. So if we say, history: 'deep', then we could specify this as a deep history node. And that way, when we turn it on, switch the mode, turn it off and turn it on again, we still have that dark mode.

*/