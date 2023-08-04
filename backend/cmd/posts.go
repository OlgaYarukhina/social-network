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

	stmt := `SELECT postId, userId, content, COALESCE(img, ""), likes, privacy, created FROM posts ORDER BY created DESC LIMIT 200`
	
	rows, err := app.db.Query(stmt)
	defer rows.Close()

	for rows.Next() {
		post := models.Post{}
		var img sql.NullString
		err = rows.Scan(&post.PostID, &post.UserID, &post.Content, &img, &post.Likes, &post.Privacy, &post.CreatedAt)
		if err != nil {
			log.Fatalf("Err: %s", err)
		}
		if img.Valid {
			post.Img = img.String
		} else {
			post.Img = ""
		}

		var nickname string
		if err := app.db.QueryRow("SELECT nickname from users WHERE userId = ?", post.UserID).Scan(&nickname); err != nil {
			if err == sql.ErrNoRows {
				log.Println(err)
			}
			log.Fatalf(err.Error())
		}

		var likes int
		if err := app.db.QueryRow("SELECT likes from posts WHERE postId = ?", post.PostID).Scan(&likes); err != nil {
			if err == sql.ErrNoRows {
				log.Println(err)
			}
			log.Fatalf(err.Error())
		}

		post.Nickname = nickname
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
	post.Img = "" // Initialize the image to an empty string

	file, handler, err := r.FormFile("img")
	if err == nil { // Check if an image is uploaded
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

	post.Content = r.FormValue("content")
	post.UserID = userID
	post.CreatedAt = time.Now()

		stmt := `INSERT INTO posts (userId, content, img, created) VALUES (?, ?, ?, ?)`
		_, err = app.db.Exec(stmt, post.UserID, post.Content, post.Img, post.CreatedAt)
	

	if err != nil {
		log.Printf("Err: %s", err)
	}

	w.WriteHeader(http.StatusOK)
	return
}
