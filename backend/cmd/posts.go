package main

import (
	"encoding/json"
	"log"
	"net/http"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
)

func (app *application) PostsHandler(w http.ResponseWriter, r *http.Request) {
	var posts []models.Post

	stmt := `SELECT * FROM posts ORDER BY created_at ASC LIMIT 200`
	rows, err := app.db.Query(stmt)
	defer rows.Close()

	for rows.Next() {
		post := models.Post{}
		err = rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.UserID)
		posts = append(posts, post)
	}

	jsonResp, err := json.Marshal(posts)
	if err != nil {
		log.Fatalf("Err: %s", err)
	}
	w.Write(jsonResp)
	return
}
