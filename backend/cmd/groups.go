package main

import (
	"encoding/json"
	"log"
	"net/http"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
)


func (app *application) GetGroupsHandler(w http.ResponseWriter, r *http.Request) {
	currentUserId := r.URL.Query().Get("userId")
	groups := make(map[string]interface{})
	var userGroups []models.Group
	var memberGroups []models.Group

	// get user's groups
	stmt := `
		SELECT g.groupId, g.userId, g.title, g.img
		FROM groups AS g
		WHERE g.userId = ?
	`

	rows, err := app.db.Query(stmt, currentUserId)
	if err != nil {
		log.Fatalf("Err: %s", err)
	}
	defer rows.Close()

	for rows.Next() {
		group := models.Group{}
		
		err = rows.Scan(&group.GroupID, &group.UserID, &group.Title, &group.GroupPic)
		if err != nil {
			log.Fatalf("Err: %s", err)
		}

		userGroups = append(userGroups, group)
	}

	//get other groups
	stmt = `
	    SELECT g.groupId, g.userId, g.title, g.img
		FROM groups AS g
		INNER JOIN group_members AS m ON m.memberId = g.userId
		WHERE g.userId = ?
	`
	rows, err = app.db.Query(stmt, currentUserId)
	if err != nil {
		log.Fatalf("Err: %s", err)
	}
	defer rows.Close()

	for rows.Next() {
		group := models.Group{}
		
		err = rows.Scan(&group.GroupID, &group.UserID, &group.Title, &group.GroupPic)
		if err != nil {
			log.Fatalf("Err: %s", err)
		}

		memberGroups = append(memberGroups, group)
	}

	groups["userGroups"] = userGroups
	groups["memberGroups"] = memberGroups

	jsonResp, err := json.Marshal(groups)
	if err != nil {
		log.Fatalf("Err: %s", err)
	}
     
	w.Write(jsonResp)
	return
}