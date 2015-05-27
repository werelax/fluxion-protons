# Dividing the Atom: Protons, Neutrons and Electrons

Some of us have been using [redflow](https://github.com/redradix/redflow) for some time now. Not too long, but enough to have felt a family of pains related to rendering performance and state management within the atom. This friction has been the spark that have ignited a few independent efforts to improve our current stack. I've gathered you all here to talk about my own proposal, which I have christened `Fission` (or some clever word play with `Fission`, `Flux` or `Redflow`  like `Red Flixion` or `Flixflow`, or maybe something sounding a little less stupid).

The objective of this particular flavor of `redflow` is to solve the mentioned performance problems by trying to enrich the semantics of the framework introducing new concepts to model our interactions with the atom in a meaningful way. I belive the benefits of these new concepts will extend beyond the rendering issues and will improve our stores' code substantially.

# Oh, my! Another layer of indirection!

The fundamental tool and the keystone of my approach is the `proton` as a *pointer to a subtree of the atom*. Its only purpose is to encapsulate and manipulate references (paths) to parts of the atom. We can perform four fundamental operations with a proton:

## Creating a proton

To create a proton we need a snapshot of the whole atom state, a path and, optionally, a default value. For example:

```javascript
var p = proton.protonize(atom.get(), mori.vector('data', 'username'));
```

Would get me a proton `p` *poiting* to the path `['data', 'username']` inside a fresh atom snapshot. We can omit the path parameter to create a proton wrapping the whole atom.

## Deriving a proton

If I have a proton `a`, *deriving* it means creating another proton pointing to a *subtree* of `a`. For example, If I start wrapping the whole `atom` inside a proton with:

```javascript
var rootProton = proton.protonize(atom.get()),
    dataProton = proton.derive(rootProton, 'data'),
    usernameProton = proton.derive(dataProton, 'username');
```

In this example, `usernameProton` will end poiting to `['data', 'username']`.

## Dereferencing a proton

If we want to access to the *value pointed by the proton*, we need to *dereference it*:

```javascript
var username = proton.deref(usernameProton);
```

`proton.deref` will dig into the captured state snapshot, access the wrapped path and return the actual value stored there.

## Assimilating a proton

After we have applied some alterations to the value pointed by the proton, we can reinsert the updated value back into the atom *assimilating* the new value.

```javascript

var userProton = proton.protonize(atom.get(), mori.vector('data', 'user'));

// later...

var user = proton.deref(userProton);
user = mori.assoc(user, 'name', 'Tomahawk');

atom.assimilate(userProton, user);

```

With `atom.assimilate` we are telling the atom to reassign the new value to the path wrapped by `userProton`.

# Oh my Lord, how do we love boilerplate!

So. Four new functions to memorize, with added boilerplate around our already quite ceremonious mori data manipulation. Great, right? Just what we needed. Before you decide to hate the thing unconditionally, let me show you how it can be used in it's natural habitat: the *component*. In the land of the happy protons, a component would be created with a `s` property (because I'm tired of writing `state` for the millionth time), and that `s` property would be a proton to some *unknown* path of the atom with all the relevant information it needs. For example:

```javascript

module.exports = React.createClass({
  render: function() {
    var myProton = this.props.s,
        myData = proton.deref(myProton);
    return (<h1>{mori.get(myData, 'heading')}</h1>);
  }
});

```

It doesn't look like much. Actually, it looks like a step back, with that extra `deref` line. But don't be decieved: we already have achieved a **BIG** win. We *know exactly which path of the atom this components depends on*. What does it mean? You are already guessing it, right? I bet you do! *Automatic `shouldComponentUpdate` render optimization!* Because  now that we have the *pointer to the relevant data* for this particular component, we can pinpoint with 100% certainty if it has changed in the last `atom.swap` or not. We can easily write a mixin to speed up our apps.

# Seventh son of the seventh son

In a more realistic example, our component will have some offspring to fed. It cannot pass the same proton it got from its father, because then everyone would end up getting a proton of the whole atom and no optimization would be possible. That's why we `derive` our proton, to break it down and fed all the children:

```javascript
module.exports = React.createClass({
  render() {
    var todos = proton.derive(this.props.s, ['data', 'todos']),
        form = proton.derive(this.props.s, ['session', 'ui', 'form'], mori.hashMap());
    return (
        <section id="todoapp">
            <TodoForm s={form} todos={todos}/>
            <TodoList s={todos} />
            <TodoFooterSelector s={todos} />
        </section>
    );
  }
});
```

In this snipppet, `todos` will point to a subtree of `this.props.s`. We don't know *where* `this.props.s` points, and *we don't care*. We don't need to know. That's the responsibility of this component's father. This line of thought allows us design much more reusable components. We could take this whole thing and mount it in any other point of the application as long as the father provide a suitable piece of it's own subtree.

As you can imagine, `deriving` a proton creates a new proton descendant with an accumulative path. For example, look at the previous snippet and imagine that `this.props.s` points to `['application']`, for example. After the derivation, `todos` will point to `['application', 'data', 'todos']`, because the path is *appended* to the path of the original proton we are deriving.

# The putrid zombie way

Components are the pretty face of React. But you and I, we both know where all the nasty code goes to hide at night. That dark, convoluted corner where no one wants to look for too long. Yes, yes, the stores!

Talking about component reuse is really an exercise in futility unless we figure out a way to *really* reuse the *whole* thing, not just the view. After all, the components of the current version of `redflow` are perfectly reusable: they just pass the whole `this.props.state` and look the other way. What's dragging us down here is the store logic. Because if a component emits the `'DO:SOMETHING'` action, some store has to respond. What does that mean? Changing the state. What does that mean? Modifying some subtree of the atom. And what does *that* mean? **Paths!!!** Absolute paths!! Our stores are littered with fixed, hard-wired routes to the relevant data for its operation.

Imagine you have a form in your app. Innocent, right? A form, with an input. And, client requirement, the users must be able to *type* in the input. Damn clients... How do you tackle this? Now, suppose you want to avoid ugly-ass `.setState()` calls and you are determine to defend and preserve the beauty of the single state atom. You would be more or  less force to write a store similar to this one:

```javascript
module.exports = {
  onUsernameChange: listen('ON:INPUT:USERNAME:CHANGE', function(value) {
    atom.assocIn(['ui', 'forms', 'login', 'username'], value);
  })
};
```

Which is not so terrible *per se*. Just a few lines, no big deal. But the client goes crazy and asks for a `password` input field. You endure and grow you store:

```javascript
module.exports = {
  onUsernameChange: listen('ON:INPUT:USERNAME:CHANGE', function(value) {
    atom.assocIn(['ui', 'forms', 'login', 'username'], value);
  }),
  onPasswordChange: listen('ON:INPUT:PASSWORD:CHANGE', function(value) {
    atom.assocIn(['ui', 'forms', 'login', 'password'], value);
  })
};
```

Which still is not *that* terrible, but *stinks like a putrid zombie's ass*. We are starting to see a pattern of doom and damnation here. Three lines, plus one more action, plus one more path to maintain, **FOR EVERY DAMNED INPUT FIELD!!**. Now go and imagine how the `registerStore` would look.

# Blessed with ignorance

Let's step back for a minute and rethink our problem. Ideally, we would like to write a reusable, generic way to handle updates on input fields. What is holding us back? We have to trigger different events to signal updates on different fields. Why? Because *every little update handler needs to know the **path** where we are storing our input values*. This. Is. Very. Bad. Idea.

If only we had a way to encapsulate paths in a simple and elegant way! We could write all our code path-agnostic by dereferencing and assimilating some black-boxed pointers! If only!

Hold your horses right there, because we do have something *that* awesome. Let's `protonize` our example and rejoice:


```javascript
module.exports = {
  onChange: listen('INPUT:UPDATE', function(inputProton, value) {
    var input = proton.deref(inputProton);
    atom.assimilate(inputProton, mori.assoc(input, 'value', value));
  })
};
```

There you go. A **generic**, **perfectly reusable** and really shiny solution. You can save that snippet as `inputStore` and use it *for every input field on your project*. You can even copy it to your next project without modification. It doesn't care about *where* your input fields are stored. That's the input's daddy's problem. Your store reflects an abstract domain operation: updating the value of an input hash. As long as you inputs are represented with hashes and emit `INPUT:UPDATE` along with its proton with every `onChange`, you're good to go!

# Disclaimer

Proton usage is dangerous. Is another layer of indirection, and that *always* is a endless source of headaches. Is specially fun when you mix `protons` and mori's `seq`, but I will leave that for another episode. For now, I want to point out that a proton *has to be* a pointer to a `mori.hashMap` or a `mori.vector`. Not only that, but also *every step in the path to the cursor* also has to be a `hashMap` or a `vector`. Because it has to have an indexed path suitable to access with `getIn` and `assocIn`, which are the actors behind all the magic. You cannot protonize a primitive value, nor a `list`, nor a `set`, nor a native array or object. Sad, but true.

# The weird cousins

Automatic render optimization and store reuse. Two pretty big wins, if you ask me. Worth the extra line of boilerplate? Well, I think it does. But I hate typing as much as the next guy, so I've tried to compensate cutting a few extra lines with what I call `neutrons`. Which doesn't have anything to do with the purpose of the code, but fits the theme.

If you want that sweet automatic `shouldComponentUpdate` optimization, you must include `mixin/with_proton` as a mixin. All the time, on every component. What a pain, huh? How could we wrap the `React.createClass` call and the mixin inclusion?

What about a function?

```javascript
var N = require('../../lib/neutron');

module.exports = N(function(p) {
  var title = mori.get(proton.deref(p), 'title');
  return (<h1>{title}</h1>);
});
```

You call `N` with a function, and `N` will create the react component, include the mixin and call *your* function to do render, *passing the proton as the first parameter* (that little `p` in the snippet). Succinct or what?


> But, but.. where are my component lifecycle methods??

Gone. For good. They're for grownups. If you follow the *one-atom-to-rule-all-state* commandment and don't store shit in your component, you will rarely need them. Very rarely. And when you need, is mostly for setup. For that case, `N` is kind enough to let you (optionally) *return a function from your function*. If you do return a function, that function will be used for rendering. For example:

```javascript
var N = require('../../lib/neutron');

module.exports = N(function(p) {
  // initialization code
  var id = window.setTimeout(() => alert('I hate alert boxes. And you?'), 1000);
  // the returned function will be used for render
  return function() {
    var title = mori.get(proton.deref(p), 'title');
    return (<h1>{title}</h1>);
  };
});
```

You want initialization? Great, do it now and return a function for the actual render. That `setTimeout` will be called only once at mount time, and the returned function will be called once per update. This idea is shamelessly stolen from the incredibly gorgeous [Reagent](http://holmsand.github.io/reagent/). The most beautiful and minimalist React wrapper I've seen yet.

For the corner cases when you need to access all the lifecycle methods, go with the good old `React.createClass`. They can mingle safely.

# Some people know when to stop, others don't

We have 'atoms', 'protons, 'neutrons'. I had to invent something else. It can't be left like that. Enter `electrons`.

The `proton` idea of wrapping and passing around subpaths is great because we can cut the rendering time considerably. When the root component triggers a render cycle, *every component* first checks its `proton` to see if it has really changed. If that's the case, then we go ahead with the render. But if the `proton` `mori.equals` the previous component's proton, then we just shortcircuit the rendering and leave the component as is. *Every* component? No! We don't need to check them all. If a *parent* skips its rendering, all its children skip the rendering too. And that is safe, because a children can only depend of data `derive`d from its parent's `proton`, so if the parent's `proton` is unchanged, the children's are unchanged too. How peachy!

The flip side is: if you modify the proton of a deeply nested component, *all its ancestors must be re-rendered to propagate the update*. If a tiny little input updates its proton which happens to live in `['data', 'user', 'username']`, then *every component* which proton poitns to `[]`, `['data']`, `['data', 'user']` or `['data', 'user', 'username']` **has to be updated** too. I mean virtual-DOM-diffing updating. So it may not be altered at all, but React has to do the heavy lifting. In real life, that's **not** a big deal, because our data tree and our component tree are usually much more wide than deep, so an upwards path from the modified proton doesn't cross that many nodes. But can we do better?

# The electron challenge

Electrons are small components that updates abnormally fast. Think: form fields, animated transitions, websockets. *If* we are updating our atom *many times per second*, they ancestor-render-cascade may become a performance problem. How can we update those (and only those) components directly without affecting its ancestors?

I haven't found a clean and reliable way yet. I've seen [an interesting approach from @migueldelmazo](https://bitbucket.org/migueldelmazo/redflow-poc), but not mature enough to adopt it yet. Can *you* help?
