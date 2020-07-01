[00:00:00]
>> Tim asks, _say you were refactoring a large app from Redux to Xstate. What would the end result look like? Would it be one large state machine? Or would it be a composition of many smaller state machines?_
 That's a really good question. So one of the big differences between Redux and Xstate is that Redux espouses this idea that there's _one atomic global state_.

[00:00:22]
And so in this global state, this is where you have all of your state updates and u selectors to select slices of that global state that you want to use in your application. Now Redux, especially for React and anything else that uses Redux, has to do a lot of tricks to make sure that any state updates to that global states don't cause wide spread state updates everywhere else.

[00:00:47]
So in _events-driven modelling_, we call this **chatty**. So we could say that the store that Redux has is chatty, because every single update that happens to it is going to tell everything else. Hey, guess what? I have some new states. And so you might not always want that.

[00:01:07]
You might only want to care about a particular piece of that state. The actor model naturally separates those states into separate actors. So because the parents state just spawns those actors, those actors could update their state all they want, they could receive events. They could send events, they could do whatever.

[00:01:26]
And the parents will never know unless the actor explicitly sends an events to the parents. And so, in that way using the actor model is a lot less chatty than using something like Redux. But again, the learning curve is a little bit bigger. 

*Are there any examples of composition of many smaller machines or state charts?*

[00:01:46]
So that goes hand in hand with the previous question. Unlike Redux, where you're combining all of your reducers together, with Xstate, if you could separate behavior out into a separate actor, then that's what you should do. If you've worked in the back end world, you could think of this as monoliths versus micro services microservices.

[00:02:05]
If your monolith gets really, really huge, then chances are you wanna take some of that functionality and separate it into microservices. Now it is possible to go too far on one side of the spectrum and too far on the other side of the spectrum. So this is a modeling problem.

[00:02:21]
It's up to you to determine. Do you want all of your states to be represented in one state chart or in many state charts?

