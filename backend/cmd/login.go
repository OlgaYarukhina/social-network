package main

import (
	"encoding/json"
	"log"
	"net/http"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func (app *application) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var loginInfo models.User

	err := json.NewDecoder(r.Body).Decode(&loginInfo)
	if err != nil {
		log.Println(err, "1")
		return
	}

	var passwordQ string
	app.db.QueryRow("SELECT password FROM users WHERE email = ?", loginInfo.Email).Scan(&passwordQ)

	err = verifyPassword(passwordQ, loginInfo.Password)
	if err == nil {
		userId := app.getUserId(loginInfo.Email)
		sessionId := app.createCookie(w, userId)

		response := models.LoginResponse{
			UserId:   userId,
			CookieId: sessionId,
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Login unsuccessful"))
		return
	}
}

func (app *application) createCookie(w http.ResponseWriter, userId int) string {
	sessionValue := uuid.Must(uuid.NewV4()).String()
	app.db.Exec("DELETE FROM sessions WHERE userId=?", userId) // deletes previous session from the same user to avoid double sessions from one user
	statement, err := app.db.Prepare("INSERT INTO sessions (sessionKey, userId) VALUES (?, ?)")
	if err != nil {
		log.Println(err)
	}
	statement.Exec(sessionValue, userId)
	return sessionValue
}

func verifyPassword(hashedPassword, passwordToVerify string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(passwordToVerify))
}

func (app *application) getUserId(email string) int {
	var userId int
	app.db.QueryRow("SELECT userId FROM users WHERE email = ?", email).Scan(&userId)
	return userId
}

func (app *application) LogOutHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("userId")
	_, err := app.db.Exec("DELETE FROM sessions WHERE userId = ?", userId) // deletes session when user logs out
	if err != nil {
		log.Println(err)
		return
	} 
		w.WriteHeader(http.StatusOK)
	   // w.Write([]byte("Ended session for user with ID: " + userId))      // Do we need it?
}

func (app *application) CookieHandler(w http.ResponseWriter, r *http.Request) {
	
	cookieId := r.URL.Query().Get("cookieId")
	// check if a session exists for the given cookieId
	var exists bool
	err := app.db.QueryRow("SELECT EXISTS(SELECT 1 FROM sessions WHERE sessionKey = ?)", cookieId).Scan(&exists)
	if err != nil {
		log.Println(err)
		return
	}
	if exists {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Session exists for user"))
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session does not exist for user"))
	}
}
