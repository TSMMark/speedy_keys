var eachCons = function(obj, consSize, iterator, context) {
  var i, slice, stop, _i, _ref, _results;
  _results = [];
  for (i = _i = 0, _ref = obj.length - consSize; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    stop = i + consSize;
    if (stop > obj.length) {
      stop = obj.length;
    }
    slice = obj.slice(i, stop);
    _results.push(iterator.call(context, slice, i, obj));
  }
  return _results;
};

_.mixin({
  "eachCons": eachCons
});
