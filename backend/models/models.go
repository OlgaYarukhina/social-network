package models

import (
	"time"
)

type User struct {
	UserId                  int    `json:"userId,omitempty"`
	FirstName               string `json:"firstName"`
	LastName                string `json:"lastName"`
	Email                   string `json:"email,omitempty"`
	Nickname                string `json:"nickname,omitempty"`
	DateOfBirth             string `json:"dateOfBirth,omitempty"`
	Password                string `json:"password,omitempty"`
	ProfilePic              string `json:"profilePic"`
	AboutMe                 string `json:"aboutMe,omitempty"`
	Public                  bool   `json:"public,omitempty"`
	Online                  bool   `json:"online,omitempty"`
	CurrentUserFollowStatus string `json:"currentUserFollowStatus,omitempty"`
	FollowsCurrentUser      bool   `json:"followsCurrentUser,omitempty"`
	Followers               []User `json:"followers"`
	Following               []User `json:"following"`
}

type LoginResponse struct {
	UserId   int    `json:"userId"`
	CookieId string `json:"cookieId"`
}

type FollowRequest struct {
	UserId     int    `json:"userId"`
	FollowerId int    `json:"followerId"`
	FollowType string `json:"followType"`
}

type Post struct {
	PostID    int       `json:"postId,string"`
	UserID    int       `json:"userId,string"`
	Nickname  string    `json:"nickname"`
	Content   string    `json:"content"`
	Img       string    `json:"img"`
	Likes     int       `json:"likes"`
	Privacy   string    `json:"privacy"`
	CreatedAt time.Time `json:"createdAt"`
}
