# README

# To-Do List Desktop Application

This is a cross-platform desktop application for managing a list of tasks. It allows users to make crud operations like create read update delete with their tasks

## Features

- **User Interface**  
  - For the frontend i used react.js to 
  - thei are input fields for task description, due date/time, and priority.
  - also added priority like High , Low , Meduim and each of them have color

- **Task Management**  
  - **Create Tasks:** Users can add new tasks with a description, due date/time, and priority.
  - **Display Tasks:** All tasks are shown in a table with clear status and action buttons.
  - **Edit Tasks:** Users can update a task’s description, due date/time, and priority.
  - **Delete Tasks:** Tasks can be deleted with a confirmation modal.
  - **Toggle Task Status:** Mark tasks as completed (which will strike through the text) or uncompleted.

- **State Persistence**  
  - Task data is saved to a database so that tasks persist between application restarts.

## Technologies Used

- **Backend:**  
  - [Gin] i used framework gin for creating RESTful API endpoints.  
  - [GORM] gorm - for ORM and database interactions.
  
- **Frontend:**  
  - [React.js] for frontend react.js - for building the user interface.
  
- **Database:**  
  - So for database i user postgres(pgadmin) So please if you want to run database change port from 5431 to 5432 also  you postgres username and password
 
 Why i used the react.js cause we had elective frontend and we completed React.js



