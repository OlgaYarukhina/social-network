package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
)

func (app *application) PostsHandler(w http.ResponseWriter, r *http.Request) {
	var posts []models.Post

	stmt := `SELECT * FROM posts ORDER BY created ASC LIMIT 200`
	rows, err := app.db.Query(stmt)
	defer rows.Close()

	for rows.Next() {
		post := models.Post{}
		var img sql.NullString
		err = rows.Scan(&post.PostID, &post.UserID, &post.Content, &post.Img, &post.Likes, &post.Privacy, &post.CreatedAt)
		if err != nil {
			log.Fatalf("Err: %s", err)
		}
		if img.Valid {
			post.Img = img.String
		} else {
			post.Img = "" 
		}
		posts = append(posts, post)
	
	}
	fmt.Println(posts)
	jsonResp, err := json.Marshal(posts)
	if err != nil {
		log.Fatalf("Err: %s", err)
	}

	w.Write(jsonResp)
	return
}


func (app *application) CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	var post models.Post

	response, _ := ioutil.ReadAll(r.Body)

	err := json.Unmarshal(response, &post)
	post.UserID = 1                            // what is the best way for you to pass here userId?
	if err != nil {
		log.Fatalf("Err: %s", err)
		return
	}

	stmt := `INSERT INTO posts (userId, content, created) VALUES (?,?, current_date)`
	_, err = app.db.Exec(stmt, post.UserID, post.Content, post.CreatedAt)

	if err != nil {
		log.Fatalf("Err: %s", err)
	}

	w.WriteHeader(http.StatusOK)
	return
}
