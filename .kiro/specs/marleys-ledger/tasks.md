# Implementation Plan

- [ ] 1. Set up testing infrastructure

  - [ ] 1.1 Install fast-check and testing dependencies
    - Add fast-check, vitest, and @testing-library/react to devDependencies
    - Configure vitest for Next.js environment
    - _Requirements: Testing Strategy_
  - [x] 1.2 Create test utilities and generators

    - Create generators for Task, Subtask, and PersistedState objects
    - Create helper functions for localStorage mocking
    - _Requirements: Testing Strategy_

- [ ] 2. Implement core data types and validation

  - [x] 2.1 Create type definitions

    - Define Task, Subtask, and PersistedState interfaces in src/types/index.ts
    - _Requirements: 1.1, 4.1_

  - [x] 2.2 Implement input validation utilities

    - Create isValidTaskTitle function that rejects empty/whitespace strings
    - Create isValidSubtaskTitle function
    - _Requirements: 1.2_

  - [x] 2.3 Write property test for input validation

    - **Property 2: Empty/whitespace tasks are rejected**
    - **Validates: Requirements 1.2**

- [ ] 3. Implement persistence layer

  - [x] 3.1 Create localStorage utilities

    - Implement saveState function to serialize and store state
    - Implement loadState function to retrieve and parse state
    - Handle localStorage unavailability and corrupted data
    - _Requirements: 7.1, 7.4, 7.5_

  - [x] 3.2 Write property test for serialization round-trip

    - **Property 3: Task persistence round-trip**
    - **Validates: Requirements 1.4, 7.4, 7.5**

  - [x] 3.3 Write property test for full state round-trip

    - **Property 10: Full state persistence round-trip**
    - **Validates: Requirements 5.4, 7.1, 7.2**

- [ ] 4. Implement TaskContext state management

  - [x] 4.1 Create TaskContext with initial state

    - Define context type with tasks, savedSouls, lostSouls
    - Create TaskProvider component
    - Implement useEffect for loading state on mount
    - Implement useEffect for persisting state on change
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 4.2 Implement addTask action

    - Validate input using isValidTaskTitle
    - Create new Task object with unique ID
    - Add to tasks array
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 4.3 Write property test for task addition

    - **Property 1: Adding valid task grows task list**
    - **Validates: Requirements 1.1**

  - [x] 4.4 Implement updateTask action

    - Find task by ID and update properties
    - Persist changes
    - _Requirements: 3.3_

  - [x] 4.5 Write property test for task update persistence

    - **Property 5: Task update persistence**
    - **Validates: Requirements 3.3**

  - [x] 4.6 Implement subtask actions

    - Implement addSubtask to add subtask to task
    - Implement toggleSubtask to flip completion status
    - _Requirements: 4.1, 4.3, 4.5_

  - [x] 4.7 Write property tests for subtask operations

    - **Property 6: Adding subtask grows subtask list**
    - **Validates: Requirements 4.1**
    - **Property 7: Subtask toggle inverts completion**
    - **Validates: Requirements 4.3**

  - [x] 4.8 Implement completeTask action

    - Remove task from tasks array
    - Increment savedSouls or lostSouls based on accomplished flag
    - Persist changes
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.9 Write property tests for soul completion

    - **Property 8: Saving soul removes task and increments saved count**
    - **Validates: Requirements 5.1**
    - **Property 9: Losing soul removes task and increments lost count**
    - **Validates: Requirements 5.2**

- [x] 5. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement UI components

  - [x] 6.1 Implement Header component

    - Display "Marley's Ledger" title with gold color
    - Display soul counter with saved (pale pink) and lost (coral) counts
    - Consume TaskContext for soul counts
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 6.2 Implement TaskInput component

    - Create text input with placeholder "Enter your task..."
    - Handle Enter key and button click for submission
    - Clear input after successful task addition
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 6.3 Implement Ghost component

    - Create ghost visual with body, eyes, and tail
    - Calculate orbital position based on index and total
    - Apply CSS animation for orbiting
    - Handle click to trigger selection
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 6.4 Write property test for orbital distribution

    - **Property 4: Ghost orbital distribution**
    - **Validates: Requirements 2.2**

  - [x] 6.5 Implement GhostArena component

    - Render all ghosts from TaskContext
    - Manage selectedTask state
    - Render TaskModal when task is selected
    - _Requirements: 2.1, 3.1_

  - [x] 6.6 Implement TaskModal component

    - Display modal overlay with task details
    - Editable task title input with save button
    - Subtask list with checkboxes
    - Add subtask input
    - "Saved Soul" and "Lost Soul" action buttons
    - Close button and click-outside-to-close
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2_

- [ ] 7. Implement styling

  - [x] 7.1 Create global CSS with theme variables

    - Define CSS custom properties for color palette
    - Style body with gradient background
    - _Requirements: Visual theme_

  - [ ] 7.2 Style ghost animations
    - Create orbit keyframe animation
    - Create orbitReverse keyframe animation
    - Style ghost-floating class with orbital animation
    - _Requirements: 2.3_
  - [x] 7.3 Style modal and form elements

    - Style modal overlay and content
    - Style input fields, buttons, and subtask list
    - _Requirements: 3.1, 4.2, 4.4_

- [ ] 8. Wire up page component

  - [x] 8.1 Create page.tsx as server component

    - Import and compose Header, TaskInput, GhostArena
    - Wrap with TaskProvider in layout.tsx
    - _Requirements: All_

- [x] 9. Final Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Soul Scale component

  - [x] 10.1 Create scale tilt calculation utility

    - Implement calculateScaleTilt function that returns angle based on saved vs lost ratio
    - Return negative angle for saved > lost, positive for lost > saved, zero for equal
    - _Requirements: 8.2, 8.3, 8.4_

  - [x] 10.2 Write property test for scale tilt

    - **Property 11: Scale tilt direction matches soul balance**
    - **Validates: Requirements 8.2, 8.3, 8.4**

  - [x] 10.3 Implement SoulScale component

    - Create SVG weighing scale graphic with two pans
    - Apply CSS transform rotation based on tilt calculation
    - Add smooth transition animation for tilt changes
    - _Requirements: 8.1, 8.5_

  - [x] 10.4 Integrate SoulScale into Header

    - Add SoulScale above soul counter
    - Pass savedSouls and lostSouls as props
    - _Requirements: 8.1_

- [ ] 11. Implement Ghost Chains visual

  - [x] 11.1 Create chain state calculation utility

    - Implement getChainState function that returns 'chained', 'broken', or 'none'
    - Based on subtask completion status
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 11.2 Write property test for chain visibility

    - **Property 12: Chain visibility matches subtask state**
    - **Validates: Requirements 9.1, 9.2, 9.3**

  - [x] 11.3 Implement GhostChains component

    - Create SVG chain graphics
    - Animate chain breaking when all subtasks complete
    - _Requirements: 9.1, 9.2, 9.4_

  - [x] 11.4 Integrate chains into Ghost component

    - Wrap Ghost with GhostChains based on chain state
    - Update visuals when subtasks change
    - _Requirements: 9.4_

- [ ] 12. Implement Spirit Consultation (AI) feature

  - [x] 12.1 Create AI API route

    - Create /api/spirits route handler
    - Accept POST with goal description
    - Integrate with AI provider (OpenAI/Anthropic)
    - Return array of suggested tasks
    - _Requirements: 10.2, 10.3_

  - [x] 12.2 Implement SpiritConsultation component

    - Create input section with mystical styling
    - "Consult the Spirits" button with crystal ball icon
    - Loading state with spooky animation (floating spirits)
    - _Requirements: 10.1, 10.6_

  - [x] 12.3 Implement suggestion preview list

    - Display AI-generated tasks in styled list
    - Accept button to add task to arena
    - Dismiss button to remove from preview
    - _Requirements: 10.3, 10.4, 10.5_

  - [x] 12.4 Integrate SpiritConsultation into page

    - Add below TaskInput component
    - Wire up to TaskContext for adding accepted tasks
    - _Requirements: 10.1_

- [ ] 13. Style new components

  - [x] 13.1 Style SoulScale

    - Gold/brass colored scale
    - Glowing effect on pans
    - Smooth tilt animation
    - _Requirements: 8.1, 8.5_

  - [x] 13.2 Style GhostChains

    - Metallic chain appearance
    - Breaking animation with particles
    - _Requirements: 9.1, 9.2_

  - [x] 13.3 Style SpiritConsultation

    - Mystical purple/gold theme
    - Crystal ball or ouija board aesthetic
    - Floating spirit loading animation
    - _Requirements: 10.1, 10.6_

- [x] 14. Final Checkpoint - Ensure all new tests pass

  - Ensure all tests pass, ask the user if questions arise.
