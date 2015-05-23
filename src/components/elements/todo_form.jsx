var N = require('../../lib/neutron'),
    React = require('react'),
    _ = require('../../lib/proton'),
    m = require('mori'),
    r = require('ramda'),
    emit = require('../../lib/dispatcher').emit;

function onChange(proton, e) {
  emit('INPUT:CHANGE', proton, e.target.value);
}
function onKey(proton, e) {
  var text = _.deref(proton, 'value');
  if (e.keyCode === 13 && text.length > 0) {
    emit('TODO:LIST:INSERT', text);
    emit('INPUT:CLEAR', proton);
  }
}

module.exports = N(function(proton) {
  console.log('~~~> render form!');
  var value = m.get(_(proton), 'value', '');
  return (
    <header id="header">
	<h1>todos</h1>
	<input id="new-todo" placeholder="What needs to be done?" autofocus
               value={value}
               onChange={r.partial(onChange, proton)}
               onKeyUp={r.partial(onKey, proton)}/>
    </header>
  );
});
