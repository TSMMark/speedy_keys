Models = {};

Models.MissingRecordError = function () {}
Models.MissingRecordError.prototype = Object.create(Error.prototype);

// @option collection [Meteor.Collection]
// @option attributes [Object]
// @option oneToMany [Object]
// @option instanceMethods [Object]
// @option propsToRaw [Function]
// @option rawToProps [Function]
Models.createClass = function (klass, options) {
  _.extend(klass, {
    attributes: {},
    oneToMany: {}
  }, options);

  klass.initRaw = function (rawData) {
    var instance = new klass(rawData);
    instance.props || (instance.props = {});

    _.extend(instance.props, klass.rawToProps(rawData));
    return instance;
  }

  klass.createRaw = function (rawData) {
    rawData = klass.parseRaw(rawData);
    rawData._id = klass.collection.insert(rawData);
    return klass.initRaw(rawData);
  }

  klass.findById = function (id) {
    var record = klass.collection.findOne(id);
    return record && klass.initRaw(record);
  }

  if (options.instanceMethods) {
    _.extend(klass.prototype, options.instanceMethods);
  }

  klass.parseRaw = function (rawData) {
    return _.reduce(rawData, function (memo, value, key) {
      if (this.oneToMany.hasOwnProperty(key)) {
        var assocOptions = this.oneToMany[key]
          , nestedAttributes = _.keys(assocOptions.attributes)
          , assocsIds = []
          , assocsData = value.map(function (rawAssoc) {
              assocsIds.push(rawAssoc._id);
              var args = [rawAssoc].concat(nestedAttributes)
              return _.pick.apply(rawAssoc, args);
            });

        memo[key] = assocsData;
        memo[key + "Ids"] = assocsIds;
      }
      else if (this.attributes.hasOwnProperty(key)) {
        memo[key] = value;
      }

      return memo;
    }, {}, this);
  }

  klass.propsToRaw = function (props) {
    return _.reduce(this.oneToMany, function (memo, options, assocName) {
      var modelName = options.modelName
        , assocsIds = [];

      memo[assocName] = memo[assocName].map(function (assoc) {
        assocsIds.push(assoc.props._id);
        return assoc.props;
      });
      memo[assocName + "Ids"] = assocsIds;

      return memo;
    }, props, this);
  }

  klass.rawToProps = function (rawData) {
    rawData = this.parseRaw(rawData);
    return this.instantiatedAssocs(rawData);
  }

  klass.instantiatedAssocs = function (rawData) {
    return _.reduce(this.oneToMany, function (memo, options, assocName) {
      var modelName = options.modelName;

      memo[assocName] = memo[assocName].map(function (rawAssoc) {
        return Models[modelName].initRaw(rawAssoc);
      });

      return memo;
    }, rawData, this);
  }

  // TODO: finish this method.
  //
  // Set a value and mark dirty.
  //
  // Example:
  //   model.set("personsNames", 3, "Person's Name");
  klass.prototype.set = function (/* args */) {
    var args = Array.prototype.slice.call(arguments)
      , value = args.pop();

    if (args.length == 0) throw new ArgumentError("Requires minimum of 2 arguments.");

    var lastKey = args[args.length - 1]
      , setMe = this.props
      , self = this;

    _.eachCons(args, 2, function (slice, i) {
      var curr = slice[0]
        , next = slice[1];

      if (setMe[curr] === undefined) {
        console.log(curr + " is undefined.", "array?", typeof next === "number");
        setMe[curr] = typeof next === "number" ? [] : {};
      }

      setMe = setMe[curr];
    });

    // TODO: Set dirty.

    setMe[lastKey] = value;

    return this;
  }

  klass.prototype.save = function () {
    var rawData = klass.propsToRaw(this.props);

    rawData = _.omit(rawData, "_id")

    this.saveOnly(rawData);
  }

  klass.prototype.destroy = function () {
    return klass.collection.remove({ _id: this.props._id });
  }

  klass.prototype.saveOnly = function ($set) {
    this.updateCollection({ $set: $set });
  }

  klass.prototype.updateCollection = function (operators) {
    klass.collection.update(
      { _id: this.props._id },
      operators);
  }

  klass.prototype.propsToRaw = function () {
    return klass.propsToRaw(this.props);
  }

}
