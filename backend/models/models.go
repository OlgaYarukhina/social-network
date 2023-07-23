package models

type RegisterInfo struct {
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	Email string `json:"email"`
	Nickname string `json:"nickname"`
	DateOfBirth string `json:"dateOfBirth"`
	Password string `json:"password"`
	ProfilePic string `json:"profilePic"`
	AboutMe string `json:"aboutMe"`
}

type LoginInfo struct {
	Email string `json:"email"`
	Password        string `json:"password"`
}

type LoginResponse struct {
	UserId   int    `json:"userId"`
	CookieId string `json:"cookieId"`
}