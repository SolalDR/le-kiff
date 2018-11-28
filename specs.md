# Spécifications techniques
Le kiff, histoire de disparitions


## Contexte du projet

### Une expérience interactive en 3D
“Le kiff” est une expérience interactive en 3D, sur desktop et navigateur uniquement, retraçant la vie d’un caillou de crack depuis sa naissance sous forme de feuille jusqu’à sa consommation par un addicte pour documenter l’ensemble des étapes de vie de cet objet ainsi que toute l'économie et la société qui gravite autour.

### Système d’échelles
L’expérience est vécue du point de vue subjectif de l’objet mais apporte aussi des points de vue plus génériques. L’histoire peut se vivre sous 3 échelles différentes de la plus petite à la plus grande : micro, humaine ou macro afin de permettre à l'utilisateur d'accéder à différents niveaux d’informations selon ses intérêts. La vue micro permettra principalement de représenter des mollécules, la vue humaine, des visuels réalistes visibles par un humain et enfin la vue macro un globe terrestre et des cartes (cf : visuels à déterminer avec les DA).

### Participation de l’utilisateur
Tout au long de son expérience, l’utilisateur va être amené s’il le souhaite, à découvrir des informations complémentaires au sujet, grâce à des points d’intérêts, ou à questionner ses connaissances et les comparer à celles des autres utilisateurs, grâce à des points de question. Il aura alors accès à des réponses toutes faites de type QCM, puis à des statistiques lui indiquant dans quelle tranche de la population il se situe.



## Arborescence
Le projet est découpé en 2 parties, d'un côté l'expérience, de l'autre les pages complémentaires. Chaque arrivée d'utilisateur sur le site l'emmène vers un écran d'introduction puis de chargement. Il arrive ensuite sur un chapitre et une étape (selon l'url qu'il a entré). Il est ensuite libre de naviguer entre les différentes échelles lorsqu'il en a la possibilité. Aux côtés de l'expérience, vont exister des pages statiques qui seront accessibles depuis le menu et permettra de sourcer les propos de l'expérience ou d'en savoir plus sur le sujet.

[![](https://drive.google.com/thumbnail?id=1DPwD9jKKsSq8glnal_ESc8RsGGCtmbTU&sz=w1200)](https://drive.google.com/open?id=1DPwD9jKKsSq8glnal_ESc8RsGGCtmbTU)



## Environnement technique

### API Wordpress
Wordpress est utilisé en tant que headless CMS. L’interface admin est donc la même que Wordpress et va permettre de modifier facilement les contenus (textes principaux, points d’intérêts, point de question). Wordpress permet de créer une API REST facilement. Nous créons donc nos propres routes pour faciliter l’utilisation côté client. 
Uniquement une requête sera en POST, pour pouvoir mettre à jour les statistiques utilisateurs des réponses aux points de question. 
Nous utilisons ACF qui permet de réaliser facilement des liaisons entre les modèles afin de reproduire les relations d’une base de données classique.

Récupération d’un chapitre
```
.../wp-json/v1/chapters/{id}
```

Récupération des étapes d’un chapitre
```
.../wp-json/v1/chapters/{id}/steps
```

Récupération des informations d’une étapes
```
.../wp-json/v1/steps/{id}/infos
```

### React
React sera utilisé pour la structure de l'application et notamment avec son système de components. Il reste encore à décider jusqu'à quel niveau ils seront utilisés (voir si les components seront utiles aussi pour instancier des objets 3D, comme des flux par exemple.) 
    
### Store custom / Redux
Nous utiliserons un store pour l'application afin d'avoir accès aux données (notamment celles retournées par l'API) depuis n'importe quel composant et pour les mettre à jour. Nous réflechissons à utiliser Redux pour sa rigourisité ou de créer un store custom.

### ThreeJS
Nous avons choisi d'utiliser la librairie ThreeJS pour la 3D, qui nous permettra de gagner du temps grace aux nombreuses abstractions. Cependant, il faudra aussi être vigileant au niveau des performances du projet. Nous souhaitons avoir au coeur de chaque écran un objet principal, et y ajouter des effets de profondeur afin d'avoir un leger parallax au hover de la souris.   

<br><br>

## Réflexion d'architecture (UML)
[![](https://drive.google.com/thumbnail?id=1xQk6T3v2vEBAYC2bnpS929hUsa5QCrQK&sz=w1200)](https://drive.google.com/open?id=1xQk6T3v2vEBAYC2bnpS929hUsa5QCrQK)

<br><br>

## Architecture Temporaire

``` yaml
/src

  # Global components (can be reused in all the app)
  /components          
    /Scene 
      /components      
        HumanScale
        MicroScale
        MacroScale
      Scene

  # Single components (used in router)
  /pages               
    /Chapter1 
      /pages
        Step1
        Step2
    /Chapter2
    /Chapter3
    /Chapter4
    /Intro
    /Outro
    /Source
    /About

  # Services to manage storage, asynchronous loading, call to the wordpress api
  /services
    api
    loader
    store

  /utils
    /molecules
    /maths
```

## Scope fonctionnel
[![](https://drive.google.com/thumbnail?id=1sD8sBs_0xL48vq25iV5bmCT3nieNS1vD&sz=w1200)](https://drive.google.com/open?id=1sD8sBs_0xL48vq25iV5bmCT3nieNS1vD)

<br><br>

## Workflow designer / Développeurs

<br><br>

## SEO
Un utilisateur pourra s'il le souhaite arriver sur n'importe quel chapitre et étape grâce à une url qui génerera le contenu en fonction de. Des liens de partage seront d'ailleurs à sa disposition tout au long de l'expérience. 
Pour les crawlers SEO, il faudra également mettre un système qui ne retourne uniquement du contenu texte brut afin que l'expérience soit référencée, malgré que tout soit généré en 3D et donc non parsable.

<br><br>

## Performances
