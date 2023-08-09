package main

import "net/http"

type corsConfig struct {
	AllowedOrigins   []string
	AllowedMethods   string
	AllowedHeaders   string
	AllowCredentials bool
}

func (app *application) server() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/", app.Home)
	mux.HandleFunc("/register", app.RegisterHandler)
	mux.HandleFunc("/login", app.LoginHandler)
	mux.HandleFunc("/check-auth", app.AuthHandler)
	mux.HandleFunc("/logout", app.LogOutHandler)
	mux.HandleFunc("/posts", app.PostsHandler)
	mux.HandleFunc("/poster", app.CreatePostHandler)
	mux.HandleFunc("/get-user-data", app.GetUserInfoHandler)
	mux.HandleFunc("/follow", app.CreateFollowHandler)
	mux.HandleFunc("/followers", app.FollowersHandler)
	mux.HandleFunc("/post-like", app.LikeHandler)
	mux.HandleFunc("/get-post-likes", app.GetPostLikesHandler)
	mux.HandleFunc("/get-chat-data", app.GetChatDataHandler)
	mux.HandleFunc("/create-comment", app.CreateCommentHandler)
	mux.HandleFunc("/get-comments", app.GetCommentsHandler)
	mux.HandleFunc("/get-comment-likes", app.GetCommentLikesHandler)
	mux.HandleFunc("/ws", NewManager().ServeWS)
	mux.HandleFunc("/get-image/", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/get-image/", http.FileServer(http.Dir("backend/media"))).ServeHTTP(w, r)
	})

	return app.handleCORS(mux)
}

func (app *application) handleCORS(h http.Handler) http.Handler {
	config := corsConfig{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowedHeaders:   "Accept, Content-Type, X-CSRF-Token, Authorization",
		AllowCredentials: true,
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		for _, allowedOrigin := range config.AllowedOrigins {
			if allowedOrigin == origin {
				w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
				break
			}
		}

		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Methods", config.AllowedMethods)
			w.Header().Set("Access-Control-Allow-Headers", config.AllowedHeaders)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			return
		}

		h.ServeHTTP(w, r)
	})
}
