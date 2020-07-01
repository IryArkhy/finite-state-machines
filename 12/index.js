//http://localhost:1234/12/index.html
import { createMachine, assign, interpret, send } from 'xstate';

const elBox = document.querySelector('#box');

const randomFetch = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej('Fetch failed!');
      } else {
        res('Fetch succeeded!');
      }
    }, 2000);
  });
};

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'pending'
      },
    },
    pending: {
      on: {
        I_AM_DONE: 'resolved',
        CANCEL: 'idle',
        SEND_IT_ALREADY: {
          actions: send({
            type: 'SEND_IT_ALREADY'
          }, {
            to: 'child'
          })
        }
      },
      invoke: {
        id: 'child',
        //invoking callbacks - callback source
        src: (context, event) => (sendBack, receive) => {
          //1---sendBack
          // setTimeout(() => {
          //   sendBack({
          //     type: "I_AM_DONE"
          //   })
          // }, 2000)

          //2---receive
          receive((event) => {
            if (event.type === 'SEND_IT_ALREADY')
              sendBack({
                type: "I_AM_DONE"
              })
          })
        },
      },
    },
    resolved: {
      on: {
        FETCH: 'pending'
      }
    },
    rejected: {
      on: {
        FETCH: 'pending'
      }
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(' ');

  console.log(state);
});

service.start();

elBox.addEventListener('click', (event) => {
  service.send('FETCH');
});

const elCancel = document.querySelector('#cancel');
elCancel.addEventListener('click', (event) => {
  service.send('SEND_IT_ALREADY');
});
