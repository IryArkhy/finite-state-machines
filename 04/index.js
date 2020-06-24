import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');

const setPoint = (context, event) => {
  const { clientX, clientY } = event;
  // Set the data-point attribute of `elBox`
  elBox.dataset.point = `{"clientX": ${clientX}, "clientY" ${clientY}}`;
};

const clearPoint = (context, event) => {
  // Set the data-point attribute of `elBox`
  elBox.dataset.point = "Element inactive";
};

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        mousedown: {
          // Add your action here
          target: 'dragging',
          //Execution of the functions in the array is almost immidiate and not always in that order. {context: undefined, event: MouseDown}
          actions: [setPoint, (context, event) => console.log('context:', context, "event: ", event)],
        },
      },
    },
    dragging: {
      on: {
        mouseup: {
          target: 'idle',
          actions: clearPoint
        },
      },
    },
  },
},
  {
    // actions: {
    //   setPoint: () => console.log(`Overrided setPoint`)
    // }
  });
/*
object with actions in the end

Now one other thing too, since we could customize this action, this is especially good for testing.

[00:02:48]
If we want to say that this action side effect is not really going to help us out much when we're unit testing or integration testing this machine, we could say, actions. And then, we could specify that same setPoint action, remember it has to have the same name. And then, we could override this any way we want.

So we could say console.log, overrided setPoint and then you'll see that it no longer shows up here. But we have this overridden however you say it setpoints over here in the console. And so when you're testing, it's a good idea to have these named to actions so that you could replace them with test implementations of your actions instead.
*/

const service = interpret(machine);

service.onTransition((state) => {
  // console.log(state);

  elBox.dataset.state = state.value;
});

service.start();

elBox.addEventListener('mousedown', (event) => {
  service.send(event);
});
// shoerthand for the function above
elBox.addEventListener('mouseup', service.send);
