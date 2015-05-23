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

  insertTodo: listen('TODO:LIST:INSERT', (proton, text) => {
    var todos = _.deref(proton),
        id = m.get(todos, 'id', 0),
        item = todoItem.create(text, id),
        list = m.conj(m.get(todos, 'list'), item);
    atom.assimilate(proton, m.assoc(todos, 'list', list, 'id', ++id));
  }),
  applyFilter: listen('TODO:LIST:FILTER', (proton, filter) => {
    var todos = _.deref(proton);
    atom.assimilate(proton, m.assoc(todos, 'filter', filter));
  }),
  selectAll: listen('TODO:LIST:SELECT:ALL', (proton, toggle) => {
    var listProton = _.derive(proton, 'list'),
        list = _.deref(listProton);
    list = m.into(m.vector(),
                  m.map(todoItem.check, _.deref(listProton)));
    atom.assimilate(listProton, list);
  }),
  clearCompleted: listen('TODO:LIST:CLEAR:COMPLETED', (proton) => {
    var listProton = _.derive(proton, 'list'),
        list = _.deref(listProton);
    list = m.into(m.vector(),
                  m.remove(todoItem.isChecked, _.deref(listProton)));
    atom.assimilate(listProton, list);
  }),
  delete: listen('TODO:LIST:DELETE', (itemProton, todosProton) => {
    var listProton = _.derive(todosProton, 'list'),
        list = _.deref(listProton),
        pred = m.partial(m.equals, _.deref(itemProton));
    list = m.into(m.vector(), m.remove(pred, list));
    atom.assimilate(listProton, list);
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
