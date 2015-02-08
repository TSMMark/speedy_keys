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
    if (!record) {
      throw new Models.MissingRecordError();
    }
    return klass.initRaw(record);
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

  klass.prototype.save = function () {
    var rawData = klass.propsToRaw(this.props);

    rawData = _.omit(rawData, "_id")

    klass.collection.update(
      { _id: this.props._id },
      { $set: rawData });
  }

  klass.prototype.propsToRaw = function () {
    return klass.propsToRaw(this.props);
  }

}
