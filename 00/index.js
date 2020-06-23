//http://localhost:1234/00/index.html
import { createMachine } from 'xstate';

const elOutput = document.querySelector('#output');

function output(object) {
  elOutput.innerHTML = JSON.stringify(object, null, 2);
}

console.log('Welcome to the XState workshop!');

const user = {
  name: 'David Khourshid',
  company: 'Microsoft',
  interests: ['piano', 'state machines'],
};

output(user);

//Started coding: Create State Machine

const machine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'pending'
      }
    },
    pending: {
      on: {
        RESOLVE: 'resolved',
        REJECT: 'rejected'
      }
    },
    resolved: {},
    rejected: {}
  }
}

const transition = (state, event) => {
  return machine.states[state]
    ?.on?.[event] || state;
  //question mark - ES6 syntax: if that property machine.states[state] exists - returns it if not - gives undefined.
  //this return state should give us next state but in case the machine does not accept this event in the current state that it's in, we just wnat to return the state.
}
//-------1 Possible transition -------
// Let's see the result of our function

/*
output({
  state: transition('idle', 'FETCH')
});
*/
//We see in the browser: {state: pending}. It means that transition from 'idle' to 'pending' happend.

// ------- 2 Impossible transition -----
//Let's try imposible transition:

/*
output({ state: transition('pending', 'FETCH') })
*/

//We see in the browser: {state: pending}. We still in the 'pending' state. Nothing happend there because there is no 'FETCH' event in the pending state.

//--------- 3 Possible transition ------

output({ state: transition('pending', 'RESOLVE') })
// We see in the browser: {"state": "resolved"}. Transition happend "pending" --> "resolved".

//Limitations of this approach:
/*
Doing this pure functions is fine, but we need some sort of way of keeping track of the current state.

And obviously, that's a little bit side effecty, ie we can't really use pure functions. And in fact, any application that you work on is not going to be 100% pure, because after all, you need to output things on the screen or you need to do some sort of side effect or something.

And so that's where we get into interpreting state machines.
*/

//Create an INTERPRETER
let currentState = machine.initial;
const send = (event) => {
  const nextState = transition(currentState, event)
  console.log('nextState: ', nextState);
  currentState = nextState;
}

// What's it doing? Whenever we send an event, it's going to mutate this current state so that we keep track of what the currentState is. And then it's going to log out that nextState.

//To check it
window.send = send;
//so put in the console in the browser: send("FETCH")---> enter---> "pending" --> send("REJECT") --> enter -> "rejected".

//So it's internally keeping track and we're outputting the nextState based on the currentState in the events that was just sent.