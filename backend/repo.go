package backend

import "gorm.io/gorm"

type TaskRepo struct {
	db *gorm.DB
}

func NewTaskRepo(db *gorm.DB) *TaskRepo {
	return &TaskRepo{db: db}
}

func (r *TaskRepo) GetAllTasks() ([]Task, error) {
	var tasks []Task
	result := r.db.Find(&tasks)
	return tasks, result.Error
}

func (r *TaskRepo) CreateTask(task *Task) error {
	return r.db.Create(task).Error
}

func (r *TaskRepo) UpdateTask(task *Task) error {
	return r.db.Save(task).Error
}

func (r *TaskRepo) DeleteTask(id uint) error {
	return r.db.Delete(&Task{}, id).Error
}

func (r *TaskRepo) GetTaskById(id uint) (*Task, error) {
	var task Task
	result := r.db.First(&task, id)

	return &task, result.Error

}
