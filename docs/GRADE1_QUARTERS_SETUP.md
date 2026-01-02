# Grade 1 Quarter-Based Quiz System

## Overview
The Mathify application now uses a quarter-based curriculum system for Grade 1 students. Each quarter contains 10-15 quizzes organized by topics.

## Quarter Structure

### Quarter 1 (12 quizzes)
- **Focus**: Basic number recognition, shapes, and patterns
- **Topics**: 
  - Counting Numbers 1-20
  - Number Recognition 1-20
  - Comparing Numbers 1-20
  - Ordering Numbers 1-20
  - Basic Shapes
  - Shape Properties
  - Simple Patterns
  - Counting Objects
  - Number Words 1-10
  - Position Words
  - Grouping Objects
  - Simple Sorting

### Quarter 2 (13 quizzes)
- **Focus**: Addition, subtraction, money, and time basics
- **Topics**:
  - Numbers 21-50
  - Numbers 51-100
  - Addition Facts to 10
  - Addition Facts to 20
  - Subtraction Facts to 10
  - Subtraction Facts to 20
  - Word Problems - Addition
  - Word Problems - Subtraction
  - Ordinal Numbers 1st-10th
  - Philippine Coins
  - Counting Money up to ₱20
  - Time - Hours
  - Time - Half Hours

### Quarter 3 (14 quizzes)
- **Focus**: Advanced operations, fractions, and measurement
- **Topics**:
  - Addition with Regrouping
  - Subtraction within 100
  - Mixed Addition and Subtraction
  - Fractions - Half
  - Fractions - Quarter
  - Comparing Fractions
  - Philippine Bills
  - Money up to ₱100
  - Money Word Problems
  - Length - Non-Standard Units
  - Comparing Lengths
  - Days of the Week
  - Months of the Year
  - Calendar Reading

### Quarter 4 (12 quizzes)
- **Focus**: Data representation, patterns, and review
- **Topics**:
  - Pictographs - Reading
  - Pictographs - Creating
  - Patterns - Colors and Shapes
  - Number Patterns
  - Problem Solving - Addition
  - Problem Solving - Subtraction
  - Problem Solving - Mixed
  - Review - Numbers 1-100
  - Review - Addition and Subtraction
  - Review - Shapes and Patterns
  - Review - Money and Time
  - Final Assessment Prep

## Database Changes

### New Column
- Added `quarter` column to `curriculum_topics` table
- Quarter values: 1, 2, 3, 4

### New Functions
- `getCurriculumTopics(grade, quarter = null)` - Get topics by grade, optionally filtered by quarter
- `getQuartersForGrade(grade)` - Get list of quarters available for a grade

## API Changes

### New IPC Handlers
- `get-quarters-for-grade` - Returns available quarters for a grade
- Updated `get-curriculum-topics` - Now accepts optional quarter parameter

## UI Updates

### Student Dashboard
- Learning path now displays topics grouped by quarters
- Each quarter shows:
  - Quarter header with progress bar
  - Number of completed quizzes
  - Overall quarter progress percentage
  - Individual quiz progress

## Usage

### Seeding Grade 1 Quarters
```bash
node seed-grade1-quarters.js
```

This will:
1. Add the `quarter` column to the curriculum_topics table (if not exists)
2. Clear existing Grade 1 topics
3. Insert 51 new Grade 1 quizzes organized into 4 quarters

### Getting Topics by Quarter
```javascript
// Get all Grade 1 topics
const result = await window.electronAPI.invoke('get-curriculum-topics', 1);

// Get only Quarter 1 topics
const q1Result = await window.electronAPI.invoke('get-curriculum-topics', 1, 1);

// Get available quarters
const quartersResult = await window.electronAPI.invoke('get-quarters-for-grade', 1);
```

## Question Generation

The existing `CurriculumQuestionGenerator` class automatically generates appropriate questions based on:
- Topic learning outcome
- Category (Number Sense, Operations, Geometry, etc.)
- Grade level

Each quiz generates 10 questions by default, but this can be customized per topic.

## Next Steps

To extend this system to other grades:
1. Create similar quarter structures (e.g., `seed-grade2-quarters.js`)
2. Follow the same pattern: 10-15 quizzes per quarter
3. Organize topics progressively by difficulty
4. Update the UI if needed for grade-specific displays

