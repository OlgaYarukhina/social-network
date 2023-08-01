package main

import (
	"encoding/json"
	"log"
	"net/http"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
)

func (app *application) CreateFollowHandler(w http.ResponseWriter, r *http.Request) {
	var followReq models.FollowRequest

	err := json.NewDecoder(r.Body).Decode(&followReq)
	if err != nil {
		log.Println(err)
		return
	}

	if followReq.FollowType == "Follow" || followReq.FollowType == "RequestFollow" {
		var isRequest = false
		if followReq.FollowType == "RequestFollow" {
			isRequest = true
		}

		statement, err := app.db.Prepare("INSERT INTO followers (userId, followerId, isRequest) VALUES (?, ?, ?)")
		if err != nil {
			log.Println(err, "4")
			return
		}

		_, err = statement.Exec(followReq.UserId, followReq.FollowerId, isRequest)
		if err != nil {
			log.Println(err, "5")
			return
		}
	} else {
		app.db.Exec("DELETE FROM followers WHERE userId = ? AND followerId = ?", followReq.UserId, followReq.FollowerId)
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Follow status successfully changed"))
}
