import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');

const machine = createMachine({
  // Create your state machine here
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        MOUSE_DOWN: 'active'
      }
    },
    active: {
      on: {
        mouseup: 'inactive'
      }
    }
  }
});

// 1) Create a service using interpret(...) 
// 2) Listen to state transitions and set
// 3) elBox.dataset.state` to the state value as before.
// 4) and start it
const service = interpret(machine).onTransition(state => {
  elBox.dataset.state = state.value;
}).start();;

//2 ways: 1) use your events in upper case; 2) use DOM events in lower case
elBox.addEventListener('mousedown', (event) => {
  // Send a mousedown event
  service.send({ type: 'MOUSE_DOWN' });
});

elBox.addEventListener('mouseup', (event) => {
  console.log('event: ', event) //event.type = mouseup
  // Send a mouseup event
  service.send(event);
});

/*
Difference between createMachine and interpret.

createMachine essentially creates a blueprint for how your machine is supposed to behave. You could think about it as creating a really, really fancy transition function that's pure.

It doesn't keep any internal state and you could share it in multiple locations without fear of having its internal state changed because it doesn't have any internal states. Now, a service is an instance of that machine. So a service will keep track of its own internal state as you send events to it.

So another way you could think of a service, like a singleton, with that machine's behavior.
*/
