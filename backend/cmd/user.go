package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
)

func (app *application) GetUserInfoHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("userId")
	currentUserId := r.URL.Query().Get("currentUserId")
	jsonData, err := json.Marshal(getUserInfo(userId, currentUserId, app.db))

	if err != nil {
		log.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func getUserInfo(userId, currentUserId string, db *sql.DB) models.User {
	var user models.User
	row := db.QueryRow("SELECT firstName, lastName, email, nickname, dateOfBirth, profilePic, aboutMe, public, online FROM users WHERE userId = ?", userId)
	err := row.Scan(&user.FirstName, &user.LastName, &user.Email, &user.Nickname, &user.DateOfBirth, &user.ProfilePic, &user.AboutMe, &user.Public, &user.Online)
	if err != nil {
		log.Println(err)
	}

	user = getCurrentUserFollowStatus(userId, currentUserId, db, user)
	user = getViewedUserFollowStatus(userId, currentUserId, db, user)
	user = getUserFollowers(userId, currentUserId, db, user)
	user = getUserFollowing(userId, currentUserId, db, user)

	return user
}

func getCurrentUserFollowStatus(userId, currentUserId string, db *sql.DB, user models.User) models.User {
	var isRequest bool
	// checks if current user is following viewed user
	err := db.QueryRow("SELECT isRequest FROM followers WHERE userId = ? AND followerId = ?", userId, currentUserId).Scan(&isRequest)
	if err != nil {
		if err == sql.ErrNoRows {
			user.CurrentUserFollowStatus = "Follow"
		} else {
			log.Println(err)
		}
	} else {
		if isRequest {
			user.CurrentUserFollowStatus = "Requested"
		} else {
			user.CurrentUserFollowStatus = "Following"
		}
	}

	return user
}

func getViewedUserFollowStatus(userId, currentUserId string, db *sql.DB, user models.User) models.User {
	var isRequest bool
	// checks if viewed user is following current user
	err := db.QueryRow("SELECT isRequest FROM followers WHERE userId = ? AND followerId = ?", currentUserId, userId).Scan(&isRequest)
	if err != nil {
		if err == sql.ErrNoRows {
			user.FollowsCurrentUser = false
		} else {
			log.Println(err)
		}
	} else {
		if isRequest {
			user.FollowsCurrentUser = false
		} else {
			user.FollowsCurrentUser = true
		}
	}

	return user
}

func getUserFollowers(userId, currentUserId string, db *sql.DB, user models.User) models.User {
	user.Followers = []models.User{}

	query := `
		SELECT u.userId, u.firstName, u.lastName, u.profilePic, u.public
		FROM users AS u
		INNER JOIN followers AS f ON u.userId = f.followerId
		WHERE f.userId = ? 
	`

	rows, err := db.Query(query, userId)
	if err != nil {
		log.Println(err)
	}

	for rows.Next() {
		var follower models.User
		err := rows.Scan(&follower.UserId, &follower.FirstName, &follower.LastName, &follower.ProfilePic, &follower.Public)
		if err != nil {
			log.Println(err)
		}

		follower = getCurrentUserFollowStatus(strconv.Itoa(follower.UserId), currentUserId, db, follower)

		user.Followers = append(user.Followers, follower)
	}

	return user
}

func getUserFollowing(userId, currentUserId string, db *sql.DB, user models.User) models.User {
	user.Following = []models.User{}

	query := `
		SELECT u.userId, u.firstName, u.lastName, u.profilePic, u.public
		FROM users AS u
		INNER JOIN followers AS f ON u.userId = f.userId
		WHERE f.followerId = ?
	`

	rows, err := db.Query(query, userId)
	if err != nil {
		log.Println(err)
	}

	for rows.Next() {
		var following models.User
		err := rows.Scan(&following.UserId, &following.FirstName, &following.LastName, &following.ProfilePic, &following.Public)
		if err != nil {
			log.Println(err)
		}

		following = getCurrentUserFollowStatus(strconv.Itoa(following.UserId), currentUserId, db, following)

		user.Following = append(user.Following, following)
	}
	return user
}
