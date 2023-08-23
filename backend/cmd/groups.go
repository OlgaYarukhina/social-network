package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"01.kood.tech/git/aaaspoll/social-network/backend/models"
	"github.com/gofrs/uuid"
)

func (app *application) CreateGroupHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20) 

	var group models.Group

	group.GroupPic = "defaultProfilePic.png"

	file, handler, err := r.FormFile("img")
	if err == nil {
		defer file.Close()

		imgDir := "backend/media/groups"

		imgName := uuid.Must(uuid.NewV4()).String() + filepath.Ext(handler.Filename)

		newFile, err := os.Create(imgDir + "/" + imgName)
		if err != nil {
			log.Println(err)
			return
		}
		defer newFile.Close()

		_, err = io.Copy(newFile, file)
		if err != nil {
			log.Println(err)
			return
		}
		group.GroupPic = imgName
	}

	userIDStr := r.FormValue("userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		log.Println(err)
		return
	}

	group.UserID = userID
	group.Title = r.FormValue("groupTitle")
	group.Description = r.FormValue("groupDescription")

	stmt := `INSERT INTO groups (userId, title, description, img) VALUES (?, ?, ?, ?)`
	id, err := app.db.Exec(stmt, group.UserID, group.Title, group.Description, group.GroupPic)
	if err != nil {
		log.Println(err)
	}

	groupId, err := id.LastInsertId()
	group.GroupID = int(groupId)

	jsonResponse, err := json.Marshal(group)
	if err != nil {
		http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(jsonResponse)

}


func (app *application) GetGroupDataHandler(w http.ResponseWriter, r *http.Request) {
	
	groupId := r.URL.Query().Get("groupId")
	groupData := make(map[string]interface{})
	var group models.Group
	row := app.db.QueryRow("SELECT userId, title, description, img FROM `groups` WHERE groupId = ?", groupId)
	err := row.Scan(&group.UserID, &group.Title, &group.Description, &group.GroupPic)
	if err != nil {
		log.Println(err)
	}

	var nickname string
	var firstName string
	var lastName string
		if err := app.db.QueryRow(`SELECT COALESCE(nickname, ""), firstName, lastName from users WHERE userId = ?`, group.UserID).Scan(&nickname, &firstName, &lastName); err != nil {
			if err == sql.ErrNoRows {
				log.Println(err)
			}
			log.Fatalf(err.Error())
		}

		if nickname == "" {
			groupData["owner"] = firstName + " " + lastName
		} else {
			groupData["owner"] = nickname
		}

	var members []int
	var memberId int

	stmt := `SELECT memberId FROM group_members WHERE groupId = ?`
	rows, err := app.db.Query(stmt, groupId)
	if err != nil {
		log.Fatalf("Err: %s", err)
	}
	defer rows.Close()

	for rows.Next() {
		err = rows.Scan(&memberId)
		if err != nil {
			log.Fatalf("Err: %s", err)
		}
		members = append(members, memberId)
	}

	groupData["general"] = group
	groupData["numberOfMembers"] = len(members)
	groupData["members"] = "[]"        // not sure if we need it here
	

	jsonData, err := json.Marshal(groupData)
	if err != nil {
		log.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}




func (app *application) GetGroupsHandler(w http.ResponseWriter, r *http.Request) {
	currentUserId := r.URL.Query().Get("userId")
	groups := make(map[string]interface{})
	var userGroups []models.Group
	var memberGroups []models.Group

	// get user's groups
	stmt := `
		SELECT groupId, userId, title, img
		FROM groups
		WHERE userId = ?
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
