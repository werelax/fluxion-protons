var React = require('react'),
    N = require('../../lib/neutron'),
    sender = require('../../lib/dispatcher').sender,
    todoItemStore = require('../../stores/todo_item');

module.exports = N(function(proton, props) {
  console.log('~~~~> render item!');
  var text = todoItemStore.getText(proton),
      checked = todoItemStore.isChecked(proton),
      list = props.list;
  return (
    <li className={checked && "completed"}>
        <div className="view">
            <input className="toggle" type="checkbox" checked={checked}
                   onChange={sender('TODO:ITEM:TOGGLE', proton, list)} />
            <label>{text}</label>
            <button className="destroy"
                    onClick={sender('TODO:LIST:DELETE', proton, list)}/>
        </div>
    </li>
  );
});
