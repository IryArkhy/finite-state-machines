**The actor model**

An actor is a thing or an entity that could do one of three things:
1. an actor can send a message to another actor,
2. it could create new actors, and so basically have child actors or
3.  it could change its behavior in response to a message.

We don't really know what's inside an actor. We can't read it states and this is on purpose. Actor state is private and local. And this makes it really, really useful for distributed systems and things like that. So an actor state is local, but the actor can eventually send a message back to the parents.

And so if you think about a promise as an actor, it's exactly the same way. You invoke a promise, so you're calling it, it's doing something in the background, maybe calling an API, maybe doing some sort of process, we don't know and we don't care until the promise resolves.

[00:02:01]
And when it resolves, with promises we have dot then and we have a callback. And so that's our way of saying, when you're done, send us back a message using this callback. And so actors could of course call other actors, which could call other actors as well. And so the actor model in x state, one of the ways it's embodied, is using invoke.
