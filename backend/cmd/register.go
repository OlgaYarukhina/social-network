package main

import (
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"01.kood.tech/git/aaaspoll/social-network/backend/models"
)

func (app *application) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var registerInfo models.User

	err := json.NewDecoder(r.Body).Decode(&registerInfo)
	if err != nil {
		log.Println(err, "1")
		return
	}

	var emailExists bool
	err = app.db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE lower(email) = lower(?))", registerInfo.Email).Scan(&emailExists)
	if err != nil {
		log.Println(err, "2")
		return
	}

	if emailExists {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Registration unsuccessful: email already in use"))
		return
	}

	hashedPw, err := hashPassword(registerInfo.Password)
	if err != nil {
		log.Println(err, "3")
		return
	}

	statement, err := app.db.Prepare("INSERT INTO users (firstName, lastName, email, nickname, dateOfBirth, password, profilePic, aboutMe) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		log.Println(err, "4")
		return
	}
	_, err = statement.Exec(registerInfo.FirstName, registerInfo.LastName, registerInfo.Email, registerInfo.Nickname,
		registerInfo.DateOfBirth, hashedPw, registerInfo.ProfilePic, registerInfo.AboutMe)
	if err != nil {
		log.Println(err, "5")
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Registration successful"))
}

func hashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}
