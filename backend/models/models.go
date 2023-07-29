package models

import "time"

type RegisterInfo struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Email       string `json:"email"`
	Nickname    string `json:"nickname"`
	DateOfBirth string `json:"dateOfBirth"`
	Password    string `json:"password"`
	ProfilePic  string `json:"profilePic"`
	AboutMe     string `json:"aboutMe"`
}

type LoginInfo struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
}

type LoginResponse struct {
	UserId      int    `json:"userId"`
	CookieId    string `json:"cookieId"`
}

type Post struct {
	PostID       int       `json:"postId,string"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	CreatedAt    time.Time `json:"createdAt"`
	UserID       int   
}