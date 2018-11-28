# Spécifications techniques
Le kiff, histoire de disparitions


## Contexte du projet

### Une expérience interactive en 3D
“Le kiff” est une expérience interactive en 3D, sur desktop et navigateur uniquement, retraçant la vie d’un caillou de crack depuis sa naissance sous forme de feuille jusqu’à sa consommation par un addicte pour documenter l’ensemble des étapes de vie de cet objet ainsi que toute l'économie et la société qui gravite autour.

### Système d’échelles
L’expérience est vécue du point de vue subjectif de l’objet mais apporte aussi des points de vue plus génériques. L’histoire peut se vivre sous 3 échelles différentes de la plus petite à la plus grande : micro, humaine ou macro afin de permettre à l'utilisateur d'accéder à différents niveaux d’informations selon ses intérêts. La vue micro permettra principalement de représenter des mollécules, la vue humaine, des visuels réalistes visibles par un humain et enfin la vue macro un globe terrestre et des cartes (cf : visuels à déterminer avec les DA).

### Participation de l’utilisateur
Tout au long de son expérience, l’utilisateur va être amené s’il le souhaite, à découvrir des informations complémentaires au sujet, grâce à des points d’intérêts, ou à questionner ses connaissances et les comparer à celles des autres utilisateurs, grâce à des points de question. Il aura alors accès à des réponses toutes faites de type QCM, puis à des statistiques lui indiquant dans quelle tranche de la population il se situe.

<br><br><br>

## Arborescence
Le projet est découpé en 2 parties, d'un côté l'expérience, de l'autre les pages complémentaires. Chaque arrivée d'utilisateur sur le site l'emmène vers un écran d'introduction puis de chargement. Il arrive ensuite sur un chapitre à la première étape (selon l'url qu'il a entré). Il est ensuite libre de naviguer entre les différentes échelles lorsqu'il en a la possibilité. Aux côtés de l'expérience, vont exister des pages statiques qui seront accessibles depuis le menu et permettra de sourcer les propos de l'expérience ou d'en savoir plus sur le sujet.

[![](https://drive.google.com/thumbnail?id=1DPwD9jKKsSq8glnal_ESc8RsGGCtmbTU&sz=w1200)](https://drive.google.com/open?id=1DPwD9jKKsSq8glnal_ESc8RsGGCtmbTU)

<br><br><br>

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

<br><br><br>

## Réflexion d'architecture (UML)
[![](https://drive.google.com/thumbnail?id=1xQk6T3v2vEBAYC2bnpS929hUsa5QCrQK&sz=w1200)](https://drive.google.com/open?id=1xQk6T3v2vEBAYC2bnpS929hUsa5QCrQK)

<br><br><br>

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

<br><br><br>

## Scope fonctionnel
La charge de travail se découpe en plusieurs aspects : 

- Un aspect contenu : avec des sons d'ambiance, un texte principal par étape, des points d'intérêts ou de questions différents par étape et échelle. Il y a donc une partie de recherche de contenus, de synthétisation et de scénarisation à travers les textes et un storyboard, notamment pour créer des effets de suspens, ce qui demande un travail particulier.

- Un aspect design : avec une réflexion sur la direction artistique et sur l'UX de l'expérience ainsi qu'un design sonore à créer. Il y aura également une grosse partie du travail consacrée à la réalisation d'assets et animations sur C4D ou Blender, ce qui va représenter unn challenge important. 

- Un aspect développement : avec d'une part un back pour créer les contenus bruts et d'une autre part le front, où il faudra intégrer les maquettes réalisées par les designers avec des components. Le point d'attention est encore une fois sur la 3D, où l'intégration des assets 3D, leur chargement ainsi que l'optimisation du rendu et des effets de post processing va être conséquente. 

[![](https://drive.google.com/thumbnail?id=1sD8sBs_0xL48vq25iV5bmCT3nieNS1vD&sz=w1200)](https://drive.google.com/open?id=1sD8sBs_0xL48vq25iV5bmCT3nieNS1vD)

<br><br><br>

## Workflow designer / Développeurs

<br><br><br>

## Performances

### Compression
Etant donné que l'essentiel de l'application est basée sur un rendu WebGL, la question des performances est primordiale et cette question influe l'ensemble de la production des assets. 
Afin d'optimiser les chargements des assets nous utilisons DRACO et les formats GLB pour permettre de compresser et limiter au maximum les ressources demandées au chargement de la page. 

### Context
Pour limiter le nombre de draw call au contexte webgl nous séparons les différentes échelles en groupe. Nous utilisons donc un seul context WebGL pour rendre nos trois échelles. 

### Géometries d'Instances 
Certains éléments 3D sont identiques dans leur logique, c'est le cas de toute la partie moléculaire et macro. L'utilisation des instances nous permettent de rendre un ensemble d'éléments avec le même draw call (ex: tous les atomes de toutes les molécules peuvent être rendus en une seule géométrie)

### Animation
Tous les calculs de rendu et les animations seront calculés sur C4D et Blender afin de limiter le nombre de calculs côté JS. 

### Postprocessing 
Le Composer habituel de THREE est très peu performant, afin d'améliorer le rendu de nos scènes nous passons par du postprocessing en utilisant un principe de ping-pong afin de manipuler au maximum deux FBO (frame buffer object).
