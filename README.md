Unfortunatelly the PR this package depended on was rejected, but all described features are implemented in another package called [anti:modules](https://github.com/anticoders/meteor-modules).


meteor-layers
=============

~~This is a proof-of-concept package designed to work with experimental meteor lazy loading feature.~~

The basic idea is that everything you define under `/client/layers/` gets squashed into independent layers, which you can download on demand. For example, if your project structure looks lie:
```
client
  layers
    dashboard
      admin.html
      admin.js
    someModule
      file1.js
      file2.js
  ...
```
you will get two layers called `dashboard` and `someModule`. They will be served on `/client/layers/dashboard.js` and `/client/layers/module.js` respectively, but they won't be included as `<script>` tags in the initial page.

Also packages can define their own layers by specyfying it in `fileOptions` object on call to `add_files`, e.g.
```javascript
    api.add_files([ /* ... */ ], 'client', { layer: 'someOptionalFeature' });
```
On the client, there is a global array called `layers` containing a list of all layers defined for the app. Eg.
```javascript
__atmosphere_layers__ = [
  { name: 'dashboard'  , path: '/client/layers/dashboard?[hash]' },
  { name: 'someModule' , path: '/client/layers/someModule?[hash]' },
  /* ... */
];
```
This object is used by the `layers` package that provides a convenient amd-style API for loading individual layers.
So for example if you need the `dashboard` layer, you only need to do something like this:
```javascript
Layers.require('dashboard', function () {
  console.log('ready! dashboard is loaded');
});
```
