# social-network

## About
The project is a social networking platform inspired by Facebook, equipped with features like user profiles, a followers system, content posting, group interactions, real-time chat, and dynamic notifications.

The project instructions and audit questions can be found [here](https://github.com/01-edu/public/tree/master/subjects/social-network).

## Technologies

- Go & Js websockets (Gorilla websocket)
- Javascript
- React
- HTML
- CSS
- Bootstrap
- SQLite (sqlite3)
- docker


## Instructions

### Starting with Docker:

1. Run the Bash Script: Navigate to the root folder and execute `bash start-docker.sh`. If this step fails, then you may need to install docker-compose by running `sudo apt install docker-compose`
2. Access the Application: Open a web browser and visit http://localhost:3000/.
3. Stopping Docker: Once done, don't forget to stop Docker and remove the images. Run `bash stop-docker.sh`

### Manual Start:

To start the backend, you can run `go run ./backend/cmd` in the root directory of the project

To start the frontend, make sure that Node.js is installed. Then navigate to the frontend folder and run `npm install` to install all the necessary packages. After that you can start the program with `npm start` and go to http://localhost:3000/ in your web browser

### Test users logins: 

`johndoe@gmail.com`

`janesmith@gmail.com`

`helloworld@gmail.com`

`lipsum@gmail.com`

All the accounts passwords are `password`

## Authors
[Art Johan Aaspõllu](https://01.kood.tech/git/aaaspoll) | [Olha Yarukhina](https://01.kood.tech/git/oyarukhi)