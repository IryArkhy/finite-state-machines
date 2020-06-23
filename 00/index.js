//http://localhost:1234/00/index.html
import { createMachine, interpret } from 'xstate';

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
//------ Interpreting Machines& Creating......
//Event = "" || {}. If it doesn't have any payload we just could pass in CLICK_GOOD - it's still working

/*
const nextState = feedbackMachine.transition(feedbackMachine.initialState, "CLICK_GOOD");
*/

/*
but keeping track of the state like we saw, it's hard. It's a little bit fragile because now you have this floating mutable value, and you're not really even cleaning up that service that's keeping track of the state all the time.

So, that's why Xstate provides an interpret function. And this interpret function creates what's called a service. So, in Xstate lingo, a service is a running instance of a machine. You could consider the machine like a blueprint for how your logic is supposed to look. And the service is just a single instance of that machine.

So when you create a machine, this is essentially a stateless pure object, it doesn't do anything. It doesn't hold any current state. That's what the service does. And so that's why you could pass this machine back and forth between many things. It is not a mutable object. It's just a blueprint.

It's a very, very fancy JSON object. So, this service is gonna be what we want. In order to create a service, you pass in the machine to interpret. And then you you could listen to state changes on that service by registering a state listener in the onTransition method.


And so whenever you get a new state, including the first state, you could do whatever you want with it. So in this case we're just logging it to the console. And then you have to start a service. Services don't start immediately, and that's good because you don't want anything unexpected to happen like weird timing issues.
*/

const feedbackService = interpret(feedbackMachine);

feedbackService.onTransition(state => {
  console.log('state.value: ', state.value)
});
//Remember that the state.value is the current finite state value of that state object. 
feedbackService.start();
//And then we start the service. So you can see immediately we get the "question" state and that's because it's going to give us the the first state immediately.

//And if you start listening later, it will give you the latest state. So remember, a service is a live instance. It's keeping its internal state and it's internally mutating it. So it's going to give you whatever it's instance of a status. You could also think of this sort of like a singleton.

//we want to send events to the feedback service
//-------1 -------
/*
window.send = feedbackService.send;
*/


//Put in the browser console send('CLICK_GOOD'). You'll see transition to the state 'thanks'.

//--------or 2 -----------

feedbackService.send({
  type: 'CLICK_GOOD'
});// it's automaticaly logs 'thanks' in the console.

/*
ow when you're not using a service anymore, for example, if this service represents something that you only wants to exist for a moment in time, and then you're done using the service.

It's smart to call service.stop. What this is going to do, is it's going to dispose of all the listeners registered to the service, as well as any ongoing activities or actions or invoked services. Or anything else that we're gonna cover later in this workshop. So, it's smart to call service.stop to clean up everything when you're no longer using it.

*/