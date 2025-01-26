use solana_program::program_error::ProgramError;

/// Custom errors for the Todo program
#[derive(Debug)]
pub enum TodoError {
    InvalidInstruction,
    TaskNotFound,
    TaskAlreadyExists,
    TaskUpdateFailed,
    TaskDeletionFailed,
    ProcessingError,
    NewErrorType, // Add any additional error types as needed
}

impl From<TodoError> for ProgramError {
    fn from(e: TodoError) -> Self {
        match e {
            TodoError::InvalidInstruction => ProgramError::InvalidArgument,
            TodoError::TaskNotFound => ProgramError::InvalidArgument,
            TodoError::TaskAlreadyExists => ProgramError::InvalidArgument,
            TodoError::TaskUpdateFailed => ProgramError::InvalidArgument,
            TodoError::TaskDeletionFailed => ProgramError::InvalidArgument,
            TodoError::ProcessingError => ProgramError::InvalidArgument, 
            TodoError::NewErrorType => ProgramError::InvalidArgument, 
        }
    }
}
