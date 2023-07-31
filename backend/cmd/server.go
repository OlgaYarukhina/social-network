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
	mux.HandleFunc("/get-cookie", app.CookieHandler)
	mux.HandleFunc("/logout", app.LogOutHandler)
	mux.HandleFunc("/posts", app.PostsHandler)
	mux.HandleFunc("/poster", app.CreatePostHandler)

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
