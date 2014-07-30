Package.describe({
  summary: "A package for atmosphere layers management"
});

Package.on_use(function (api) {

  api.use(['webapp']);
  api.use(['deps', 'jquery', 'amd-manager'], 'client');

  api.add_files(['layers.js'], 'client');

  api.export('Layers', 'client');
});
