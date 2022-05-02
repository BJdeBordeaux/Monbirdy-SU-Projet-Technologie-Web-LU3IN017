# Guide de tourner l'application
### par LI Junji 28610187 && Mohamed BABAALI 28601465

********

1. Fichiers et leur rôle
    * Client : `client`
    * Serveur : `server` 
        * À noter que les database se trouve ici, dans le répertoire `mongo`
    * pièces jointes
        * `architecture.jpg` : l'achitecture du Client
        * `structure diagram` : la structure de la base de données.
            * Pour le voir, entrez et cliquez sur `index.html`
        * `monbirdytest.postman_collection.json` : le fichier exporté pour le test postman
        * `README.md` : fichier de présentation.
1. Préparation
    1. Avec terminal, accédez dans le répertoire du projet
    1. Installation des modules
        1. Dans le répertoire du projet, fait
            ```shell
                cd client && npm install
                cd ../server && npm install
            ```
1. Démarrage
    * Dans le répertoire de travail
    1. Ouverture de server de mongoDB
        ```shell
                mongod --dbpath ./server/mongo/mongo --logpath ./server/mongo/mongod.log --fork
        ```
    1. Ouverture de back-end
        ```shell
                cd server && npm start
        ```
    1. Ouverture de front-end
        * ouvrez un autre terminal et fait
        ```shell
            cd client && npm start
        ```
