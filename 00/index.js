//http://localhost:1234/00/index.html
import { createMachine } from 'xstate';

//Just an example

const feedbackMachine = createMachine({
  initial: 'question',
  //in the presentation you'll see the shorthand. This is a full version
  states: {
    question: {
      on: {
        CLICK_GOOD: {
          target: 'thanks'
        }
      }
    },
    form: {},
    thanks: {},
    closed: {}
  }
})
console.log('feedbackMachine', feedbackMachine)
//We will see the StateNode - a huge object with different properties

console.log('initialState: ', feedbackMachine.initialState);

//We have the state "value": what state we're currently on.
//We have events. This is a special internal event (xstate.init) that says the machine just started. Any event that you pass in will appear in the events property of your state object.

//so in events, something that we sent in the machine, can either be a plain string which represents the events type or it could be an event object. If you've come from Redux or NgRx or ViewX, this might seem very familiar to you. An event is an object with a type and the type represents the type or name of that event.

//Let's make an event

const clickGoodEvent = {
  type: 'CLICK_GOOD',
  time: Date.now()
}

//Let's transit to the next state

const nextState = feedbackMachine.transition(feedbackMachine.initialState, clickGoodEvent);
console.log("Next state: ", nextState);//transition to "thanks" happend if you look at "value"

