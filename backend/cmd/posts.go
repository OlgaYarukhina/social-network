package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
	"github.com/gofrs/uuid"
)

func (app *application) PostsHandler(w http.ResponseWriter, r *http.Request) {
	var posts []models.Post

	stmt := `SELECT postId, userId, content, COALESCE(img, ""), privacy, created FROM posts ORDER BY created DESC LIMIT 200`
	
	rows, err := app.db.Query(stmt)
	defer rows.Close()

	for rows.Next() {
		post := models.Post{}
		var img sql.NullString
		err = rows.Scan(&post.PostID, &post.UserID, &post.Content, &img, &post.Privacy, &post.CreatedAt)
		if err != nil {
			log.Fatalf("Err: %s", err)
		}
		if img.Valid {
			post.Img = img.String
		} else {
			post.Img = ""
		}

		err = app.db.QueryRow("SELECT COUNT(*) FROM comments WHERE postId = ?", post.PostID).Scan(&post.CommentAmount)
		if err != nil {
			log.Println(err)
			return
		}

		var nickname string
		var firstName string
		var lastName string
		if err := app.db.QueryRow(`SELECT COALESCE(nickname, ""), firstName, lastName, profilePic from users WHERE userId = ?`, post.UserID).Scan(&nickname, &firstName, &lastName, &post.ProfilePic); err != nil {
			if err == sql.ErrNoRows {
				log.Println(err)
			}
			log.Fatalf(err.Error())
		}

		if nickname == "" {
			post.DisplayName = firstName + " " + lastName
		} else {
			post.DisplayName = nickname
		}

		posts = append(posts, post)
	}
	jsonResp, err := json.Marshal(posts)
	if err != nil {
		log.Fatalf("Err: %s", err)
	}

	w.Write(jsonResp)
	return
}

func (app *application) CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20) // 10 MB max memory

	var post models.Post
	post.Img = "" 

	file, handler, err := r.FormFile("img")
	if err == nil { 
		defer file.Close()

		imgDir := "backend/media/posts"

		imgName := uuid.Must(uuid.NewV4()).String() + filepath.Ext(handler.Filename)

		newFile, err := os.Create(imgDir + "/" + imgName)
		if err != nil {
			log.Println(err)
			return
		}
		defer newFile.Close()

		_, err = io.Copy(newFile, file)
		if err != nil {
			log.Println(err)
			return
		}

		post.Img = imgName
	}

	userIDStr := r.FormValue("userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		log.Printf("Error converting userId to int: %s", err)
		return
	}

	post.UserID = userID
	post.Content = r.FormValue("content")
	post.Privacy = r.FormValue("privacy")
	post.CreatedAt = time.Now()

		stmt := `INSERT INTO posts (userId, content, img, privacy, created) VALUES (?, ?, ?, ?, ?)`
		_, err = app.db.Exec(stmt, post.UserID, post.Content, post.Img, post.Privacy, post.CreatedAt)
	

	if err != nil {
		log.Printf("Err: %s", err)
	}

	w.WriteHeader(http.StatusOK)
	return
}

func (app *application) LikeHandler(w http.ResponseWriter, r *http.Request) {
	var likeInfo models.Like

	err := json.NewDecoder(r.Body).Decode(&likeInfo)
	if err != nil {
		log.Println(err)
		return
	}

	result, err := app.db.Exec("DELETE FROM post_likes WHERE postId = ? AND userId = ?", likeInfo.PostId, likeInfo.UserId)
	if err != nil {
		log.Println(err)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println(err)
		return
	}

	if rowsAffected == 0 {
		app.db.Exec("INSERT INTO post_likes (postId, userId) VALUES (?, ?)", likeInfo.PostId, likeInfo.UserId)
	}
	
	w.WriteHeader(http.StatusOK)
}

func (app *application) GetLikesHandler(w http.ResponseWriter, r *http.Request) {
	var likers = []models.User{}
	currentUserId := r.URL.Query().Get("userId")
	postId := r.URL.Query().Get("postId")

	query := `
		SELECT u.userId, u.firstName, u.lastName, u.profilePic, u.public
		FROM users AS u
		INNER JOIN post_likes AS pl ON u.userId = pl.userId
		WHERE pl.postId = ? 
	`

	rows, err := app.db.Query(query, postId)
	if err != nil {
		log.Println(err)
	}

	for rows.Next() {
		var liker models.User
		err := rows.Scan(&liker.UserId, &liker.FirstName, &liker.LastName, &liker.ProfilePic, &liker.Public)
		if err != nil {
			log.Println(err)
		}

		liker.CurrentUserFollowStatus = getCurrentUserFollowStatus(strconv.Itoa(liker.UserId), currentUserId, app.db)

		likers = append(likers, liker)
	}

	jsonData, err := json.Marshal(likers)

	if err != nil {
		log.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}



