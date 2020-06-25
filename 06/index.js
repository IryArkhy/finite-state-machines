import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});

const assignPosition = assign({
  x: (context, event) => {
    return context.x + context.dx;
  },
  y: (context, event) => {
    return context.y + context.dy;
  },
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const assignDelta = assign({
  dx: (context, event) => {
    return event.clientX - context.px;
  },
  dy: (context, event) => {
    return event.clientY - context.py;
  },
});

const resetPosition = assign({
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

// ME: Added this function
const incrementDragsCount = assign({
  drags: (context) => context.drags + 1,
});

//ME: condition for drags
const setLimitForDrags = (context, event) => context.drags < 5;

const machine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
    drags: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          // Don't select this transition unless
          // there are < 5 drags
          // ME: added condition
          cond: setLimitForDrags, // if true - it's alowed to happen
          //ME: Var1) added array of actions with last function to satisfy the requirement in the comment below after "dragging":
          // actions: [assignPoint, incrementDragsCount],
          //Var2: leave it as it is and change "entry" field in the "dragging state"
          actions: assignPoint,
          target: 'dragging',
        },

        //----------- Or It can be array to display more than 1 transition -----------
        // If the fist transition in the arr is not taken, then 2d will take place: !dragging ---> draggedOut
        // mousedown: [{
        //   cond: setLimitForDrags,
        //   actions: assignPoint,
        //   target: 'dragging',
        // }, {
        //   target: 'draggedOut'
        // }],
      },
    },
    draggedOut: {
      type: 'final'
    },
    dragging: {
      // Whenever we enter this state, we want to
      // increment the drags count.
      //ME: added entry function
      entry: incrementDragsCount,
      on: {
        mousemove: {
          actions: assignDelta,
        },
        mouseup: {
          actions: [assignPosition],
          target: 'idle',
        },
        'keyup.escape': {
          target: 'idle',
          actions: resetPosition,
        },
      },
    },
  },
}, {
  guards: {
    //if you want to test it, you could easily override the function here. But the function itself should be string above: cond: 'setLimitForDrags',
    setLimitForDrags: setLimitForDrags
  }
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context.drags);

    elBox.dataset.state = state.value;
    //display number of drags on the element
    elBox.dataset.drags = state.context.drags;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

elBox.addEventListener('mousedown', (event) => {
  service.send(event);
});

elBody.addEventListener('mousemove', (event) => {
  service.send(event);
});

elBody.addEventListener('mouseup', (event) => {
  service.send(event);
});

elBody.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    service.send('keyup.escape');
  }
});
