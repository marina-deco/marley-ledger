# Requirements Document

## Introduction

Marley's Ledger is a themed todo application that combines Charles Dickens' "A Christmas Carol" with Halloween aesthetics. Users create tasks that manifest as floating ghosts orbiting the screen. Tasks can be edited, broken into subtasks, and ultimately resolved by either "saving" the soul (task accomplished) or "losing" the soul (task not accomplished). The application uses a distinctive color palette featuring gold, pale yellow, deep purple, coral, sage, brown, dark green, and pale pink.

## Glossary

- **Task**: A user-created item representing something to be accomplished, visually represented as a ghost
- **Ghost**: The visual representation of a task that floats and orbits around the screen
- **Subtask**: A smaller component of a task that can be individually checked off
- **Saved Soul**: A task that has been marked as accomplished
- **Lost Soul**: A task that has been marked as not accomplished (banished)
- **Soul Counter**: A display showing the cumulative count of saved and lost souls
- **Soul Scale**: A weighing scale graphic that tilts based on the balance of saved vs lost souls
- **Ghost Arena**: The viewport area where ghosts orbit around the central UI elements
- **Task Modal**: A popup dialog for editing task details and subtasks
- **Chains**: Visual elements wrapped around ghosts with incomplete subtasks, representing Marley's burden
- **Spirit Consultation**: AI-powered feature that generates task suggestions from user descriptions

## Requirements

### Requirement 1

**User Story:** As a user, I want to add new tasks to my ledger, so that I can track things that are haunting me.

#### Acceptance Criteria

1. WHEN a user types a task description and presses Enter or clicks the submit button THEN the System SHALL create a new ghost and add it to the ghost arena
2. WHEN a user attempts to add an empty task THEN the System SHALL prevent the addition and maintain the current state
3. WHEN a new task is added THEN the System SHALL clear the input field for the next entry
4. WHEN a task is added THEN the System SHALL persist the task to local storage immediately

### Requirement 2

**User Story:** As a user, I want to see my tasks as floating ghosts, so that the application maintains its spooky theme.

#### Acceptance Criteria

1. WHEN tasks exist THEN the System SHALL display each task as a ghost with a pale yellow body, eyes, and wavy tail
2. WHEN multiple ghosts exist THEN the System SHALL distribute ghosts evenly around an orbital path
3. WHEN ghosts are displayed THEN the System SHALL animate ghosts in circular orbits around the center of the screen
4. WHEN a ghost is hovered THEN the System SHALL provide visual feedback by brightening the ghost

### Requirement 3

**User Story:** As a user, I want to click on a ghost to edit its task, so that I can modify task details or add subtasks.

#### Acceptance Criteria

1. WHEN a user clicks on a ghost THEN the System SHALL open a modal dialog displaying the task details
2. WHEN the modal is open THEN the System SHALL display the task title in an editable input field
3. WHEN a user modifies the task title and saves THEN the System SHALL update the task and persist changes to local storage
4. WHEN a user clicks outside the modal or the close button THEN the System SHALL close the modal without losing unsaved changes to subtasks

### Requirement 4

**User Story:** As a user, I want to add subtasks to a task, so that I can break down complex tasks into smaller steps.

#### Acceptance Criteria

1. WHEN a user enters a subtask description and clicks add or presses Enter THEN the System SHALL create a new subtask under the current task
2. WHEN subtasks exist THEN the System SHALL display each subtask with a checkbox
3. WHEN a user clicks a subtask checkbox THEN the System SHALL toggle the subtask completion status
4. WHEN a subtask is completed THEN the System SHALL display the subtask with strikethrough styling
5. WHEN subtasks are modified THEN the System SHALL persist changes to local storage immediately

### Requirement 5

**User Story:** As a user, I want to resolve tasks by saving or losing souls, so that I can track my accomplishments and failures.

#### Acceptance Criteria

1. WHEN a user clicks "Saved Soul" button THEN the System SHALL remove the ghost, increment the saved souls counter, and persist the change
2. WHEN a user clicks "Lost Soul" button THEN the System SHALL remove the ghost, increment the lost souls counter, and persist the change
3. WHEN a soul is saved or lost THEN the System SHALL update the soul counter display immediately
4. WHEN the application loads THEN the System SHALL restore the saved and lost soul counts from local storage

### Requirement 6

**User Story:** As a user, I want to see my soul statistics, so that I can track my overall progress.

#### Acceptance Criteria

1. WHEN the application loads THEN the System SHALL display the saved souls count in pale pink color
2. WHEN the application loads THEN the System SHALL display the lost souls count in coral color
3. WHEN soul counts change THEN the System SHALL update the display immediately without page refresh

### Requirement 7

**User Story:** As a user, I want my data to persist across sessions, so that I don't lose my tasks and progress.

#### Acceptance Criteria

1. WHEN the application loads THEN the System SHALL restore all tasks from local storage
2. WHEN the application loads THEN the System SHALL restore saved and lost soul counts from local storage
3. WHEN any data changes THEN the System SHALL persist the change to local storage immediately
4. WHEN serializing data to local storage THEN the System SHALL encode tasks using JSON format
5. WHEN deserializing data from local storage THEN the System SHALL parse JSON and restore task objects with all properties

### Requirement 8

**User Story:** As a user, I want to see a visual soul scale that weighs my saved versus lost souls, so that I can see my moral balance at a glance.

#### Acceptance Criteria

1. WHEN the application loads THEN the System SHALL display a weighing scale graphic above the soul counter
2. WHEN saved souls exceed lost souls THEN the System SHALL tilt the scale toward the saved (left) side
3. WHEN lost souls exceed saved souls THEN the System SHALL tilt the scale toward the lost (right) side
4. WHEN saved and lost souls are equal THEN the System SHALL display the scale in a balanced position
5. WHEN soul counts change THEN the System SHALL animate the scale tilt transition smoothly

### Requirement 9

**User Story:** As a user, I want tasks to display chain visuals based on their status, so that the Marley theme is reinforced.

#### Acceptance Criteria

1. WHEN a task has incomplete subtasks THEN the System SHALL display chains wrapped around the ghost
2. WHEN all subtasks of a task are completed THEN the System SHALL display broken chains falling away from the ghost
3. WHEN a task has no subtasks THEN the System SHALL display the ghost without chains
4. WHEN a subtask is toggled THEN the System SHALL update the chain visual immediately

### Requirement 10

**User Story:** As a user, I want to use AI to help generate tasks from a description, so that I can quickly break down complex goals.

#### Acceptance Criteria

1. WHEN the application loads THEN the System SHALL display a "Consult the Spirits" input section below the main task input
2. WHEN a user enters a goal description and clicks the spirit button THEN the System SHALL send the description to an AI service
3. WHEN the AI responds with suggested tasks THEN the System SHALL display the suggestions in a preview list
4. WHEN a user clicks "Accept" on a suggested task THEN the System SHALL add that task to the ghost arena
5. WHEN a user clicks "Dismiss" on a suggested task THEN the System SHALL remove it from the preview list
6. WHEN the AI request is processing THEN the System SHALL display a loading indicator with spooky animation
