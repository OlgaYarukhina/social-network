package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

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
	input := r.FormValue("selectedFollowers") // if we add followers directly in popup?

	stmt := `INSERT INTO groups (userId, title, description, img) VALUES (?, ?, ?, ?)`
	id, err := app.db.Exec(stmt, group.UserID, group.Title, group.Description, group.GroupPic)
	if err != nil {
		log.Println(err)
	}

	groupId, err := id.LastInsertId()

	if input != "" {
		input = strings.ReplaceAll(input, "[", "")
		input = strings.ReplaceAll(input, "]", "")
		input = strings.ReplaceAll(input, " ", "")
		values := strings.Split(input, ",")

		var arrayFollowersId []int
		for _, value := range values {
			if value != "" {
				num, err := strconv.Atoi(value)
				if err != nil {
					log.Println(err)
					return
				}
				arrayFollowersId = append(arrayFollowersId, num)
			}
		}
		for _, selectedUserId := range arrayFollowersId {
			stmt := `INSERT INTO group_request (groupId, selectedUserId) VALUES (?, ?)`
			_, err = app.db.Exec(stmt, groupId, selectedUserId)

			if err != nil {
				log.Println(err)
			}
		}
		if err != nil {
			log.Println(err)
		}
	}

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
