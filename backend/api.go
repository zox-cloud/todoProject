package backend

import "time"

type API struct {
	repo *TaskRepo
}

func NewApi() (*API, error) {
	db := ConnectDB()
	repo := NewTaskRepo(db)
	return &API{repo: repo}, nil
}

func (a *API) GetTasks() ([]Task, error) {
	return a.repo.GetAllTasks()
}

func (a *API) CreateTask(description string, dueDate time.Time, priority string) (*Task, error) {

	task := Task{
		Description: description,
		Completed:   false,
		DueDate:     dueDate,
		Priority:    priority,
	}

	err := a.repo.CreateTask(&task)

	if err != nil {
		return nil, err
	}

	return &task, nil

}

func (a *API) UpdateTask(id uint, description string, completed bool, dueDate time.Time, priority string) (*Task, error) {

	task, err := a.repo.GetTaskById(id)

	if err != nil {
		return nil, err
	}

	task.Description = description
	task.Completed = completed
	task.DueDate = dueDate
	task.Priority = priority
	err = a.repo.UpdateTask(task)

	if err != nil {
		return nil, err
	}

	return task, nil

}

func (a *API) DeleteTask(id uint) error {
	return a.repo.DeleteTask(id)
}
