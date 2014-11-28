Boaaaard
===================
Accéder au projet : [hetic.10.30.2.64.xip.io](hetic.10.30.2.64.xip.io)

### Technologies utilisées

##### Serveur
API NodeJS.
Dépendances principales : express, socket.io, fs, diverses API (twitter, youtube, google feed, freebase ...) 

##### Client
Application AngularJS. 
Dépendances principales : gridster, ngRoutes, svgInjector, momentJS ...

##### Outils / autres
Chrome extension, Gulp, SASS, svg

### Arborescence
- server : serveur node
- client : client angular
- extension : extension google chrome

### Installation
- `npm install` dans le dossier `server/`
- modifier la variable `SERVER_URL` (dans `js/app.min.js`) par votre url locale
- modifier l'url de connexion à la socket dans le fichier `remote.html` (l.100, `io.connect('VOTRE_URL')`)
- lancez le serveur (`gulp` dans `server/` ou `node server` dans `server/app`)
- accédez au client (`client/`)