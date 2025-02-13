package backend

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {

	dsn := "host=localhost user=postgres password=olzhas202 dbname=todo_db port=5431 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect db", err)
	}

	if err := db.AutoMigrate(&Task{}); err != nil {
		log.Fatal("AutoMigrate error", err)
	}

	return db

}
