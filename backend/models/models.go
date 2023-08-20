package models

import (
	"time"
)

type User struct {
	UserId                  int            `json:"userId,omitempty"`
	FirstName               string         `json:"firstName"`
	LastName                string         `json:"lastName"`
	Email                   string         `json:"email,omitempty"`
	Nickname                string         `json:"nickname,omitempty"`
	DateOfBirth             string         `json:"dateOfBirth,omitempty"`
	Password                string         `json:"password,omitempty"`
	ProfilePic              string         `json:"profilePic"`
	AboutMe                 string         `json:"aboutMe,omitempty"`
	Public                  bool           `json:"public,omitempty"`
	Online                  bool           `json:"online,omitempty"`
	CurrentUserFollowStatus string         `json:"currentUserFollowStatus,omitempty"`
	FollowsCurrentUser      bool           `json:"followsCurrentUser,omitempty"`
	Followers               []User         `json:"followers"`
	Following               []User         `json:"following"`
	ChattableUsers          []User         `json:"chattableUsers"`
	Notifications           []Notification `json:"notifications"`
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
	PostID        int       `json:"postId,string"`
	UserID        int       `json:"userId,string"`
	DisplayName   string    `json:"displayName"`
	ProfilePic    string    `json:"profilePic"`
	Content       string    `json:"content"`
	Img           string    `json:"img"`
	Privacy       string    `json:"privacy"`
	CreatedAt     time.Time `json:"createdAt"`
	CommentAmount int       `json:"commentAmount"`
}

type Comment struct {
	CommentId   int       `json:"commentId,string"`
	PostID      int       `json:"postId,string"`
	UserID      int       `json:"userId,string"`
	DisplayName string    `json:"displayName"`
	ProfilePic  string    `json:"profilePic"`
	Content     string    `json:"content"`
	Img         string    `json:"img"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Like struct {
	PostId    int `json:"postId"`
	CommentId int `json:"commentId"`
	UserId    int `json:"userId"`
}

type SearchResponse struct {
	Users []User `json:"users"`
}

type Notification struct {
	NotificationId   int       `json:"notificationId"`
	SourceId         int       `json:"sourceId"`
	ReceiverId       int       `json:"receiverId,omitempty"`
	NotificationType string    `json:"notificationType"`
	Seen             bool      `json:"seen"`
	ClickedOn        bool      `json:"clickedOn"`
	Created          time.Time `json:"created"`
}

type Group struct {
	GroupID       int       `json:"groupId,string"`
	UserID        int       `json:"userId,string"`
	Title         string    `json:"groupTitle"`
	GroupPic      string    `json:"groupPic"`
	Privacy       string    `json:"privacy"`
	CreatedAt     time.Time `json:"createdAt"`
}