var React = require('react'),
    N = require('../../lib/neutron'),
    sender = require('../../lib/dispatcher').sender,
    todoItemStore = require('../../stores/todo_item');

function onChange(proton) {
  dispatcher.emit('TODO:ITEM:TOGGLE', this.proton());
}
function onDestroy() {
  dispatcher.emit('TODO:LIST:DELETE', this.proton())
}

module.exports = N(function(proton) {
  console.log('~~~~> render item!');
  var text = todoItemStore.getText(proton),
      checked = todoItemStore.isChecked(proton);
  return (
    <li className={checked && "completed"}>
        <div className="view">
            <input className="toggle" type="checkbox" checked={checked}
                   onChange={sender('TODO:ITEM:TOGGLE', proton)} />
            <label>{text}</label>
            <button className="destroy"
                    onClick={sender('TODO:LIST:DELETE', proton)}/>
        </div>
    </li>
  );
});
