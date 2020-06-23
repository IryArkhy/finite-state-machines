const elBox = document.querySelector('#box');

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  switch (
  state
  // Add your state/event transitions here
  // to determine and return the next state
  ) {
    case 'inactive':
      switch (event) {
        case 'CLICK':
          return 'active';
        default:
          return state;
      };
    case 'active':
      switch (event) {
        case 'CLICK':
          return 'inactive';
        default:
          return state;
      };
    default:
      return state;
  }
}

// Keep track of your current state
let currentState = 'inactive';

function send(event) {
  // Determine the next value of `currentState`

  nextState = transition(currentState, event);
  currentState = nextState;
  //[data-set="currentState"]
  elBox.dataset.state = currentState;
}

elBox.addEventListener('click', () => {
  send('CLICK');
});

//--- 2 same with object syntax--------
/*
const machine = {
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        CLICK: 'active'
      }
    },
    active: {
      on: {
        CLICK: 'inactive'
      }
    }
  }
}

const transition = (state, event) => {
  return machine.states[state]
    ?.on?.[event] || state;
}
*/



