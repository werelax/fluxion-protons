/* DOMAIN: handle the collection-level operations of the todo list */

var atom = require('../lib/atom'),
    _ = require('../lib/proton'),
    m = require('mori'),
    listen = require('../lib/dispatcher').listen,
    r = require('ramda'),
    todoItem = require('./todo_item');

var filters = {
  active: r.complement(todoItem.isChecked),
  completed: todoItem.isChecked,
  all: r.identity
};

module.exports = {

  // commands

  insertTodo: listen('TODO:LIST:INSERT', (text) => {
    atom.update(atom => {
      var todos = m.getIn(atom, ['data', 'todos']),
          list = m.get(todos, 'list'),
          id = m.get(todos, 'id', 0),
          item = todoItem.create(text, id);
      todos = m.assoc(todos, 'list', m.conj(list, item),
                      'id', ++id);
      return m.assocIn(atom, ['data', 'todos'], todos);
    });
  }),
  applyFilter: listen('TODO:LIST:FILTER', (proton, filter) => {
    var todos = _.deref(proton);
    atom.assimilate(proton, m.assoc(todos, 'filter', filter));
  }),
  selectAll: listen('TODO:LIST:SELECT:ALL', (proton, toggle) => {
    var todos = m.updateIn(_.deref(proton), ['list'],
                           l => m.into(m.vector(),
                                       m.map(todoItem.check, l)));
    atom.assimilate(proton, todos);
  }),
  clearCompleted: listen('TODO:LIST:CLEAR:COMPLETED', (proton) => {
    var todos = m.updateIn(_.deref(proton), ['list'],
                           l => m.into(m.vector(),
                                       m.remove(todoItem.isChecked, l)));
    atom.assimilate(proton, todos);
  }),
  delete: listen('TODO:LIST:DELETE', (itemProton) => {
    atom.update(atom => {
      var list = m.getIn(atom, ['data', 'todos', 'list']),
          pred = m.partial(m.equals, _.deref(itemProton));
      list = m.into(m.vector(), m.remove(pred, list));
      return m.assocIn(atom, ['data', 'todos', 'list'], list);
    });
  }),

  // queries

  getTodosP(proton) {
    var filter = _.deref(proton, 'filter'),
        fn = r.propOr(filters.all, filter, filters),
        list = _.deriveSeq(proton, 'list');
    return m.filter(fn, list);
  },
  getActiveFilter(proton) {
    return _.deref(proton, 'filter');
  },
  areAllChecked(proton) {
    return m.every(todoItem.isChecked,
                   _.deref(proton, 'list'));
  }

};
