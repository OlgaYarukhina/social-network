package main

import "encoding/json"

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type EventHandler func(event Event, c *Client) error

type SendMessageEvent struct {
	Content    string `json:"content"`
	SenderId   int    `json:"senderId"`
	ReceiverId int    `json:"receiverId"`
}

type ReturnMessageEvent struct {
	MessageId int `json:"messageId"`
	SendMessageEvent
	Sent string `json:"sent"`
}

type ReturnChatDataEvent struct {
	CurrentChatterDisplayname string               `json:"currentChatterDisplayname"`
	OtherChatterDisplayname   string               `json:"otherChatterDisplayname"`
	Messages                  []ReturnMessageEvent `json:"messages"`
}

type SendChatDataEvent struct {
	CurrentChatterId int `json:"currentChatterId"`
	OtherChatterId   int `json:"otherChatterId"`
	Amount           int `json:"amount"`
}

const (
	EventSendMessage = "send_message"
	EventNewMessage  = "new_message"
	EventGetMessages = "get_messages"
)
