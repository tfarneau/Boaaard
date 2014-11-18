Boaaard server
===================

Chaque retour contient une variable "status", égale à true si c'est bon, ou à un tableau d'erreurs si c'est pas bon. 

## Routes ##

**/validate_youtube/video_id:string (GET)**
Valider un ID de vidéo youtube

### Blocks ###

Pour chaque route, retourne un objet avec :
- title : titre du block
- description : description du block
- fromCache : est-ce que c'est du live ou du cache
- content : le contenu du block 

**/block/news/query:string (GET)**
Block de news venant de l'api google

**/block/wiki/query:string (GET)**
Article wikipedia

**/block/twitter/userTimeline/username:string (GET)**
Timeline d'un utilisateur twitter (donner l'username)

**/block/twitter/search/query:string (GET)**
Recherche twitter (mot clé, hashtag ...)

**/block/facebook/infos/page_id:int (GET)**
Infos sur une page facebook (donner l'id de la page)

**/block/content/id:string (GET)**
**/block/image/id:string (GET)**
**/block/link/id:string (GET)**
Custom block (l'id est donné dans les infos sur le board)

### Boards ###

**/board/slug:string (GET)**
Récupère des infos sur un board

**/board (POST)** 
Ajoute un board

**/board (GET)**
Récupère une liste de boards