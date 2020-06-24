import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');

//------ My solution ---- Ты сделала уже третье задание на самом деле, используя интерпретатор
//Solution from David in final.js
const machine = createMachine({
  // Add your object machine definition here
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
});


// Change this to the initial state
let currentState = machine.initial;

const machineServise = interpret(machine).onTransition(state => {
  // Determine and update the `currentState`
  currentState = state;
}).start();


elBox.addEventListener('click', () => {
  // Send a click event
  machineServise.send({ type: 'CLICK' });
  elBox.dataset.state = currentState.value;
});
