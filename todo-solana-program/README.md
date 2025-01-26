# Todo Solana Program

## Description
The Todo Solana Program is a decentralized application that allows users to manage tasks on the Solana blockchain. It provides functionalities for creating, updating, deleting, and toggling the status of tasks.

## Installation
To set up the project, clone the repository and run the following commands:

```bash
cargo build
```

## Usage
You can interact with the program by sending instructions to create, update, delete, or toggle tasks. The available instructions are:
- **CreateTask**: Create a new task with a title and description.
- **UpdateTask**: Update an existing task's title.
- **DeleteTask**: Remove a task from the list.
- **ToggleTask**: Change the completion status of a task.

## Data Structures
### Task
- `id`: Unique identifier for the task.
- `title`: Title of the task.
- `description`: Description of the task.
- `status`: Current status of the task (Pending, InProgress, Completed, Cancelled).
- `completed`: Boolean indicating if the task is completed.
- `initializer`: The public key of the user who initialized the task.

### UserTasks
- `tasks`: A vector of tasks.
- `next_task_id`: Tracks the next available task ID.

## Error Handling
The program includes custom error handling for various scenarios, such as:
- Invalid instructions
- Task not found
- Task already exists
- Task update and deletion failures

