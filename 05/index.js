import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const machine = createMachine({
  initial: 'idle',
  // Set the initial context
  // Clue: {
  // initial points
  //   x: 0,
  //   y: 0,
  //how far it's traveled
  //   dx: 0,
  //   dy: 0,
  //where it was originaly clicked
  //   px: 0,
  //   py: 0,
  // }
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0
  },
  states: {
    idle: {
      on: {
        mousedown: {
          target: 'dragging',
          // Assign the point
          actions: assign({
            px: (context, event) => event.clientX,
            py: (context, event) => event.clientY,
          })
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          // Assign the delta
          actions: assign({
            dx: (context, event) => event.clientX - context.px,
            dy: (context, event) => event.clientY - context.py,
          })
          // (no target!)
        },
        mouseup: {
          // Assign the position
          actions: assign({
            x: context => context.x + context.dx,
            y: context => context.y + context.dy,
            dx: 0,
            dy: 0,
            px: 0,
            py: 0,
          }),
          target: 'idle',
        },
        'keyup.escape': {
          target: 'idle',
          actions: assign({
            dx: 0,
            dy: 0,
            px: 0,
            py: 0,
          })
        }
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    //data-state="dragging"
    elBox.dataset.state = state.value;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

// Add event listeners for:
// - mousedown on elBox
elBox.addEventListener('mousedown', service.send);
elBody.addEventListener('mousemove', service.send);
elBody.addEventListener('mouseup', service.send);
// - mousemove on elBody
// - mouseup on elBody

//Keep track of whether the user hit escape or not
elBody.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') service.send('keyup.escape');
});
/*
[00:00:00]
>> Needly, this was one of the harder exercises, not because of assignment hopefully, but because of all the math involved. It's basic arithmetic, but it's easy to get things screwed up and going the wrong direction. So the first thing we are going to do to make this drag and drop machine is we are going to set our initial context.

[00:00:22]
And so that's going to be here. So this is specified directly on the machine. And we're gonna see how to customize this in a later lesson. So at first, everything starts at 0. Now on mousedown, we want to assign the point that we clicked on the box just like before.

[00:00:45]
But instead of doing this as an in-peer side effect, we're going to be doing this as an assign action. So we're gonna say actions: assign, and since we're only assigning px and py, We are going to get event.clientX. And py is going to be same thing, event.clientY. Now doing this, let's make sure that works.

[00:01:21]
We're gonna be logging the state.context only if the state has changed. Cool. So when we do that, we see that we do get our updated context. And you could see that, Just kidding. This is Exercise 05. Okay, so once we click, nothing is happening and that's because we need to add our event listeners.

[00:01:51]
I was sort of mean and I took those off for you because you have to add those yourself. But thankfully, it's not too hard. eLBox.addEventListener. And we're going to add a mouseDown eventListener. And we're just going to send that directly to the service. So we're going to say service.send.

[00:02:09]
We're gonna be doing the same thing for mousemove and mouseup. And so we'll just do that over here, elBody. Also keep in mind that we're using elBody and not elBox. And that's because in the browser, the mouse could move faster than the elements. So it's very easy for you to escape the elements and all of a sudden you're no longer dragging.

[00:02:31]
And that's why we're adding an eventListener on the body itself for mousemove and for mouseup. Okay, so let's take a look at that again. When we click, now we get our updated context, we see that we have px and py set to be clientX and clientY of where we clicked.

[00:02:53]
So that works out pretty well. Now we also want to keep track of mousemove, and we want to do something with that. So we're going to be assigning the delta. So let's go ahead and do that. Actions: assign. We're gonna be assigning to things, dx and dy. So dx is going to be, we don't need the x, I'm sorry, we do need the context.

[00:03:19]
So context, event. And so the delta, I'm going to cheat here a little bit and cuz I always get these mixed up. And if you did too, don't feel bad. It's a very common thing to get mixed up what subtracts from what. So we're going to return the clientX minus the original point.

[00:03:40]
Okay, great. So we return event.clientX- the context original point x value. And so we're going to be doing this for dy as well. So clientY- context.py. So for example, if we started at x10 and we move to 30, that would be 30 minus 10, which is positive 20, so we know that we've moved 20 pixels to the right.

[00:04:11]
And the same thing with dy. So now let's make sure that that works. Okay, great. Now here's an interesting note too. Notice how we're not console logging when I move my mouse even though we're still listening on the body. And that's because of this state.changed. Now if I move it outside of the state.changed, all of a sudden, our console becomes a lot noisier and we don't really want that.

[00:04:43]
We only want it to update when a state change actually occurred. So the way that state.changed works is that we're checking, did the finite state change? So did we move, for example, from idle to dragging? If so, then yes, the state did change. If the state didn't change, we ask, did any side effects occur such as assignments, or any other action?

[00:05:08]
And if we have any actions that occurred, then the state did change. And those are the only two criteria. Notice that we're not doing a deep or a shallow check of the context objects to make sure it changed. We're not doing any of that because we know we could only change the context in an assign action.

[00:05:28]
So even if the finite state stays the same, and the context is changed due to an assigned action. We know that the state has changed without having to do shallow or deep property checks, which makes it really, really, really fast to check if the state changed. In fact, that's probably one of the fastest ways because we're directly saying, I'll tell you when the state changes or not, instead of us having to figure it out by doing a shallow object equality check.

[00:05:58]
All right, cool. So we have our dx, and we have our px and py. Notice over here that we are assigning dx and dy as CSS variables directly on the box. What this is going to do is it's going to move the box, To exactly where we want.

[00:06:19]
How about you see we have a little bit of an issue over here. When we click, the box sort of does a jarring motion, and that's because we forgot to do our last thing, which is assigning the position. [COUGH] So we're gonna do actions: assign. And when we go back to idle, we want to zero out a few things first.

[00:06:41]
So our dx should be 0, our dy should be 0, and we're taking advantage of static assignments over here. Our px should be 0. Our py should be 0. But we want to assign the x and y values which represents the resting position of the elements as the last resting position plus the delta.

[00:07:08]
So we could say x: (context) return context.x + context.dx. And we could do the same for y. So, oops, y: (context) return context.y + context.dy. Now, don't worry, it's not like these are going to influence the other ones. So even though we're zeroing these out, that's not going to affect the context values in here.

[00:07:49]
So now let's make sure that that works. And there we go. We have drag and drop. Just pretty nice. If you did the extra credit, you'll see that we have something else, which is, let's say that we want to add the behavior. And this is one of the benefits of state charts is that you could do this and you could add behavior and features and know exactly how it interacts with the current logic.

[00:08:22]
So let's say that we want to keep track of whether the user has pressed Escape or not. And if we press Escape, we want things to go back to the way they were before. So in this case, I'm going to send an event which I'm calling keyup.escape. And with this, let's actually make a new transition.

[00:08:42]
So I'm gonna put keyup.escape. And here, I also wanna go to the idle state. But I want slightly different behavior. I wants to assign, well, we're not gonna be changing x and y because we want it to move to its original position. But we're still going to be zeroing out everything else.

[00:09:08]
So let's see how that looks. When we drag, And we press Escape, notice how it's skewed back to its original position. And you saw how effortless it was to add that behavior. It's just another transition. And so if someone says, hey, we don't actually want that behavior, it's just as easy as commenting it out or better yet deleting it completely.

[00:09:33]
Some people are asking you about the relationship between data set and CSS variables and how they interact with the elements. How exactly that works, it's not magic. So first thing we're doing is we are setting state to the state.value which is going to be a string. At least for now.

[00:09:52]
And so in our elements, that means we're going to have data-state = "dragging" or idle or something like that. These data attributes are something that you could look up on NDN and they're extremely useful, especially for doing state-based style. So I'm gonna post that in the chat. Okay, so when we do that, we are styling the box, and those styles are coming from index.scss.

[00:10:31]
And so the way that we could select those states is, just like here, I could say, if the state is idle, then we have a transition. So wherever it was before, that's how you saw it smoothly transition. When we press the Escape, it transitions to that original value.

[00:10:49]
And see we have a couple of other things. So if I go into style over here, we see for example, when data state is active, the opacity is 1. So, if you're not using sass, this is exactly the same as box(data-state = 'active') opacity : 1. And that's because whenever we set those states, those are going to be directly on the elements.

[00:11:19]
So when we drag, you see that data-state is changing. And in line, we are adding those dx dy, a and y values too. How did I send keyup.escape? Okay, so you have to do a little bit of work for this. When you listen for keyup, you can't listen listen for specific keyups on the body, you're going to be given the keyup for absolutely every event.

[00:11:47]
So instead, you want to say, I only want to listen for the Escape key. And that's done by having the event.key and checking if it's escape. So if it is escape, we could send our custom events, which remember, this is the same as type: keyup.escape. This is an important note too.

[00:12:10]
You will see in a lot of state machine and state chart literature and other examples that using dots s a way of specifying what a particular event means. So for example if we have a keyup event, we know that anything starting with keyup dot is related to keyup event.

[00:12:29]
And then we could go down further, we could have keyup.shift, keyup.escape, and so on. In future versions of Xstate, you are going to be able to define transitions as partial wildcard transitions, which means that you could do keyup.*. And what that means is any event that starts with keyup, is going to select that transition.

[00:12:57]
So that's gonna be a really useful feature.


*/