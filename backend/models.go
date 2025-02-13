package backend

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	DueDate     time.Time `json:"due_date"`
	Priority    string    `json:"priority"`
}
