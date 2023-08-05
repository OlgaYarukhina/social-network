package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
)

func (app *application) GetChatbarDataHandler(w http.ResponseWriter, r *http.Request) {
	currentUserId := r.URL.Query().Get("userId")

	var chattableUsers = []models.User{}

	query := `
		SELECT u.userId, u.firstName, u.lastName, u.nickname, u.profilePic, u.public
		FROM users AS u
		INNER JOIN followers AS f ON u.userId = f.userId
		WHERE f.followerId = ?
	`

	rows, err := app.db.Query(query, currentUserId)
	if err != nil {
		log.Println(err)
	}

	for rows.Next() {
		var chattableUser models.User
		err := rows.Scan(&chattableUser.UserId, &chattableUser.FirstName, &chattableUser.LastName, &chattableUser.Nickname, &chattableUser.ProfilePic, &chattableUser.Public)
		if err != nil {
			log.Println(err)
		}

		if chattableUser.Public || getViewedUserFollowStatus(strconv.Itoa(chattableUser.UserId), currentUserId, app.db) {
			chattableUsers = append(chattableUsers, chattableUser)
		}
	}

	jsonData, err := json.Marshal(chattableUsers)

	if err != nil {
		log.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
