missingServiceConfig = function () {
  var serviceConfig = ServiceConfiguration.configurations.findOne({
    service: "facebook"
  });
  return !serviceConfig;
}
