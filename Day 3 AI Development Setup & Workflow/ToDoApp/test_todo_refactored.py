"""
Unit tests for the refactored ToDo application.

This module contains comprehensive tests for the refactored Task and ToDoList classes.
"""

import unittest
from datetime import datetime
from todo_refactored import Task, TaskStatus, ToDoList, create_sample_todo_list


class TestTaskStatus(unittest.TestCase):
    """Test the TaskStatus enum."""
    
    def test_task_status_values(self):
        """Test that TaskStatus has correct values."""
        self.assertEqual(TaskStatus.PENDING.value, "pending")
        self.assertEqual(TaskStatus.COMPLETED.value, "completed")
        self.assertEqual(TaskStatus.IN_PROGRESS.value, "in_progress")
        self.assertEqual(TaskStatus.CANCELLED.value, "cancelled")
    
    def test_task_status_from_string(self):
        """Test creating TaskStatus from string."""
        self.assertEqual(TaskStatus("pending"), TaskStatus.PENDING)
        self.assertEqual(TaskStatus("COMPLETED"), TaskStatus.COMPLETED)
        self.assertEqual(TaskStatus("In_Progress"), TaskStatus.IN_PROGRESS)
    
    def test_invalid_task_status(self):
        """Test that invalid status raises ValueError."""
        with self.assertRaises(ValueError):
            TaskStatus("invalid_status")


class TestTask(unittest.TestCase):
    """Unit tests for the Task class."""
    
    def test_task_creation_with_defaults(self):
        """Test creating a task with default values."""
        task = Task("Test task")
        self.assertEqual(task.name, "Test task")
        self.assertEqual(task.status, TaskStatus.PENDING)
        self.assertEqual(task.priority, 3)
        self.assertIsInstance(task.created_at, datetime)
        self.assertIsInstance(task.updated_at, datetime)
    
    def test_task_creation_with_custom_values(self):
        """Test creating a task with custom values."""
        task = Task("Test task", TaskStatus.COMPLETED, priority=5)
        self.assertEqual(task.name, "Test task")
        self.assertEqual(task.status, TaskStatus.COMPLETED)
        self.assertEqual(task.priority, 5)
    
    def test_task_creation_with_string_status(self):
        """Test creating a task with string status."""
        task = Task("Test task", "completed")
        self.assertEqual(task.status, TaskStatus.COMPLETED)
    
    def test_invalid_priority(self):
        """Test that invalid priority raises ValueError."""
        with self.assertRaises(ValueError):
            Task("Test task", priority=0)
        with self.assertRaises(ValueError):
            Task("Test task", priority=6)
    
    def test_task_string_representation(self):
        """Test the string representation of a task."""
        task = Task("Test task", TaskStatus.PENDING, priority=4)
        expected = "[PENDING] Test task (Priority: 4)"
        self.assertEqual(str(task), expected)
    
    def test_task_repr(self):
        """Test the repr representation of a task."""
        task = Task("Test task", TaskStatus.COMPLETED, priority=2)
        expected = "Task(name='Test task', status=TaskStatus.COMPLETED, priority=2)"
        self.assertEqual(repr(task), expected)
    
    def test_mark_completed(self):
        """Test marking a task as completed."""
        task = Task("Test task", TaskStatus.PENDING)
        original_updated_at = task.updated_at
        
        task.mark_completed()
        self.assertEqual(task.status, TaskStatus.COMPLETED)
        self.assertGreater(task.updated_at, original_updated_at)
    
    def test_mark_pending(self):
        """Test marking a task as pending."""
        task = Task("Test task", TaskStatus.COMPLETED)
        original_updated_at = task.updated_at
        
        task.mark_pending()
        self.assertEqual(task.status, TaskStatus.PENDING)
        self.assertGreater(task.updated_at, original_updated_at)
    
    def test_mark_in_progress(self):
        """Test marking a task as in progress."""
        task = Task("Test task", TaskStatus.PENDING)
        task.mark_in_progress()
        self.assertEqual(task.status, TaskStatus.IN_PROGRESS)
    
    def test_mark_cancelled(self):
        """Test marking a task as cancelled."""
        task = Task("Test task", TaskStatus.PENDING)
        task.mark_cancelled()
        self.assertEqual(task.status, TaskStatus.CANCELLED)
    
    def test_set_priority(self):
        """Test setting task priority."""
        task = Task("Test task")
        original_updated_at = task.updated_at
        
        task.set_priority(5)
        self.assertEqual(task.priority, 5)
        self.assertGreater(task.updated_at, original_updated_at)
    
    def test_set_invalid_priority(self):
        """Test setting invalid priority raises ValueError."""
        task = Task("Test task")
        with self.assertRaises(ValueError):
            task.set_priority(0)
        with self.assertRaises(ValueError):
            task.set_priority(6)
    
    def test_is_completed(self):
        """Test is_completed method."""
        task = Task("Test task", TaskStatus.PENDING)
        self.assertFalse(task.is_completed())
        
        task.mark_completed()
        self.assertTrue(task.is_completed())
    
    def test_is_pending(self):
        """Test is_pending method."""
        task = Task("Test task", TaskStatus.COMPLETED)
        self.assertFalse(task.is_pending())
        
        task.mark_pending()
        self.assertTrue(task.is_pending())
    
    def test_status_change_updates_timestamp(self):
        """Test that status changes update the timestamp."""
        task = Task("Test task", TaskStatus.PENDING)
        original_updated_at = task.updated_at
        
        # Small delay to ensure timestamp difference
        import time
        time.sleep(0.001)
        
        task.mark_completed()
        self.assertGreater(task.updated_at, original_updated_at)


class TestToDoList(unittest.TestCase):
    """Unit tests for the ToDoList class."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.todo_list = ToDoList("Test List")
    
    def test_empty_todo_list_creation(self):
        """Test creating an empty todo list."""
        self.assertEqual(len(self.todo_list), 0)
        self.assertEqual(self.todo_list.get_task_count(), 0)
        self.assertEqual(self.todo_list.name, "Test List")
    
    def test_add_task_with_defaults(self):
        """Test adding a task with default values."""
        task = self.todo_list.add_task("Test task")
        self.assertEqual(len(self.todo_list), 1)
        self.assertEqual(task.name, "Test task")
        self.assertEqual(task.status, TaskStatus.PENDING)
        self.assertEqual(task.priority, 3)
    
    def test_add_task_with_custom_values(self):
        """Test adding a task with custom values."""
        task = self.todo_list.add_task("Test task", TaskStatus.COMPLETED, priority=5)
        self.assertEqual(task.status, TaskStatus.COMPLETED)
        self.assertEqual(task.priority, 5)
    
    def test_add_task_with_string_status(self):
        """Test adding a task with string status."""
        task = self.todo_list.add_task("Test task", "completed")
        self.assertEqual(task.status, TaskStatus.COMPLETED)
    
    def test_add_empty_task_name(self):
        """Test that adding empty task name raises ValueError."""
        with self.assertRaises(ValueError):
            self.todo_list.add_task("")
        with self.assertRaises(ValueError):
            self.todo_list.add_task("   ")
    
    def test_add_task_with_invalid_status(self):
        """Test that adding task with invalid status raises ValueError."""
        with self.assertRaises(ValueError):
            self.todo_list.add_task("Test task", "invalid_status")
    
    def test_add_task_with_invalid_priority(self):
        """Test that adding task with invalid priority raises ValueError."""
        with self.assertRaises(ValueError):
            self.todo_list.add_task("Test task", priority=0)
    
    def test_remove_task_existing(self):
        """Test removing an existing task."""
        self.todo_list.add_task("Task 1")
        self.todo_list.add_task("Task 2")
        
        result = self.todo_list.remove_task("Task 1")
        self.assertTrue(result)
        self.assertEqual(len(self.todo_list), 1)
        self.assertEqual(self.todo_list._tasks[0].name, "Task 2")
    
    def test_remove_task_non_existing(self):
        """Test removing a non-existing task."""
        self.todo_list.add_task("Task 1")
        
        result = self.todo_list.remove_task("Non-existent task")
        self.assertFalse(result)
        self.assertEqual(len(self.todo_list), 1)
    
    def test_remove_task_case_insensitive(self):
        """Test removing a task with case insensitive matching."""
        self.todo_list.add_task("Task 1")
        
        result = self.todo_list.remove_task("task 1")
        self.assertTrue(result)
        self.assertEqual(len(self.todo_list), 0)
    
    def test_remove_task_by_index(self):
        """Test removing a task by index."""
        self.todo_list.add_task("Task 1")
        self.todo_list.add_task("Task 2")
        
        removed_task = self.todo_list.remove_task_by_index(0)
        self.assertEqual(removed_task.name, "Task 1")
        self.assertEqual(len(self.todo_list), 1)
    
    def test_remove_task_by_invalid_index(self):
        """Test removing a task by invalid index."""
        removed_task = self.todo_list.remove_task_by_index(0)
        self.assertIsNone(removed_task)
    
    def test_find_task(self):
        """Test finding a task by name."""
        self.todo_list.add_task("Task 1")
        self.todo_list.add_task("Task 2")
        
        task = self.todo_list.find_task("Task 1")
        self.assertIsNotNone(task)
        self.assertEqual(task.name, "Task 1")
        
        task = self.todo_list.find_task("Non-existent")
        self.assertIsNone(task)
    
    def test_find_task_case_insensitive(self):
        """Test finding a task with case insensitive matching."""
        self.todo_list.add_task("Task 1")
        
        task = self.todo_list.find_task("task 1")
        self.assertIsNotNone(task)
        self.assertEqual(task.name, "Task 1")
    
    def test_find_tasks_by_status(self):
        """Test finding tasks by status."""
        self.todo_list.add_task("Task 1", TaskStatus.PENDING)
        self.todo_list.add_task("Task 2", TaskStatus.COMPLETED)
        self.todo_list.add_task("Task 3", TaskStatus.PENDING)
        
        pending_tasks = self.todo_list.find_tasks_by_status(TaskStatus.PENDING)
        self.assertEqual(len(pending_tasks), 2)
        
        completed_tasks = self.todo_list.find_tasks_by_status(TaskStatus.COMPLETED)
        self.assertEqual(len(completed_tasks), 1)
    
    def test_find_tasks_by_string_status(self):
        """Test finding tasks by string status."""
        self.todo_list.add_task("Task 1", "pending")
        self.todo_list.add_task("Task 2", "completed")
        
        pending_tasks = self.todo_list.find_tasks_by_status("pending")
        self.assertEqual(len(pending_tasks), 1)
    
    def test_mark_task_completed(self):
        """Test marking a task as completed."""
        self.todo_list.add_task("Task 1", TaskStatus.PENDING)
        
        result = self.todo_list.mark_task_completed("Task 1")
        self.assertTrue(result)
        self.assertEqual(self.todo_list._tasks[0].status, TaskStatus.COMPLETED)
    
    def test_mark_task_completed_non_existing(self):
        """Test marking a non-existing task as completed."""
        result = self.todo_list.mark_task_completed("Non-existent task")
        self.assertFalse(result)
    
    def test_mark_task_pending(self):
        """Test marking a task as pending."""
        self.todo_list.add_task("Task 1", TaskStatus.COMPLETED)
        
        result = self.todo_list.mark_task_pending("Task 1")
        self.assertTrue(result)
        self.assertEqual(self.todo_list._tasks[0].status, TaskStatus.PENDING)
    
    def test_get_task_counts(self):
        """Test getting various task counts."""
        self.todo_list.add_task("Task 1", TaskStatus.PENDING)
        self.todo_list.add_task("Task 2", TaskStatus.COMPLETED)
        self.todo_list.add_task("Task 3", TaskStatus.IN_PROGRESS)
        self.todo_list.add_task("Task 4", TaskStatus.CANCELLED)
        
        self.assertEqual(self.todo_list.get_task_count(), 4)
        self.assertEqual(self.todo_list.get_completed_count(), 1)
        self.assertEqual(self.todo_list.get_pending_count(), 1)
        self.assertEqual(self.todo_list.get_in_progress_count(), 1)
        self.assertEqual(self.todo_list.get_cancelled_count(), 1)
    
    def test_get_tasks_by_priority(self):
        """Test getting tasks by priority."""
        self.todo_list.add_task("Task 1", priority=1)
        self.todo_list.add_task("Task 2", priority=3)
        self.todo_list.add_task("Task 3", priority=5)
        self.todo_list.add_task("Task 4", priority=3)
        
        priority_3_tasks = self.todo_list.get_tasks_by_priority(3)
        self.assertEqual(len(priority_3_tasks), 2)
        
        priority_5_tasks = self.todo_list.get_tasks_by_priority(5)
        self.assertEqual(len(priority_5_tasks), 1)
    
    def test_sort_tasks_by_priority(self):
        """Test sorting tasks by priority."""
        self.todo_list.add_task("Task 1", priority=3)
        self.todo_list.add_task("Task 2", priority=1)
        self.todo_list.add_task("Task 3", priority=5)
        
        self.todo_list.sort_tasks_by_priority()
        
        priorities = [task.priority for task in self.todo_list]
        self.assertEqual(priorities, [5, 3, 1])
    
    def test_sort_tasks_by_name(self):
        """Test sorting tasks by name."""
        self.todo_list.add_task("Charlie")
        self.todo_list.add_task("Alice")
        self.todo_list.add_task("Bob")
        
        self.todo_list.sort_tasks_by_name()
        
        names = [task.name for task in self.todo_list]
        self.assertEqual(names, ["Alice", "Bob", "Charlie"])
    
    def test_sort_tasks_by_created_date(self):
        """Test sorting tasks by creation date."""
        import time
        
        self.todo_list.add_task("Task 1")
        time.sleep(0.001)
        self.todo_list.add_task("Task 2")
        time.sleep(0.001)
        self.todo_list.add_task("Task 3")
        
        self.todo_list.sort_tasks_by_created_date()
        
        names = [task.name for task in self.todo_list]
        self.assertEqual(names, ["Task 1", "Task 2", "Task 3"])
    
    def test_clear_completed_tasks(self):
        """Test clearing completed tasks."""
        self.todo_list.add_task("Task 1", TaskStatus.PENDING)
        self.todo_list.add_task("Task 2", TaskStatus.COMPLETED)
        self.todo_list.add_task("Task 3", TaskStatus.COMPLETED)
        self.todo_list.add_task("Task 4", TaskStatus.PENDING)
        
        removed_count = self.todo_list.clear_completed_tasks()
        self.assertEqual(removed_count, 2)
        self.assertEqual(len(self.todo_list), 2)
        
        remaining_names = [task.name for task in self.todo_list]
        self.assertEqual(set(remaining_names), {"Task 1", "Task 4"})
    
    def test_get_statistics(self):
        """Test getting comprehensive statistics."""
        self.todo_list.add_task("Task 1", TaskStatus.PENDING, priority=1)
        self.todo_list.add_task("Task 2", TaskStatus.COMPLETED, priority=3)
        self.todo_list.add_task("Task 3", TaskStatus.IN_PROGRESS, priority=5)
        
        stats = self.todo_list.get_statistics()
        
        self.assertEqual(stats['total_tasks'], 3)
        self.assertEqual(stats['completed'], 1)
        self.assertEqual(stats['pending'], 1)
        self.assertEqual(stats['in_progress'], 1)
        self.assertEqual(stats['cancelled'], 0)
        self.assertAlmostEqual(stats['completion_rate'], 33.33, places=1)
        
        expected_priority_dist = {'1': 1, '2': 0, '3': 1, '4': 0, '5': 1}
        self.assertEqual(stats['priority_distribution'], expected_priority_dist)
    
    def test_export_to_list(self):
        """Test exporting tasks to a list of dictionaries."""
        self.todo_list.add_task("Task 1", TaskStatus.PENDING, priority=3)
        self.todo_list.add_task("Task 2", TaskStatus.COMPLETED, priority=5)
        
        exported = self.todo_list.export_to_list()
        
        self.assertEqual(len(exported), 2)
        self.assertEqual(exported[0]['name'], "Task 1")
        self.assertEqual(exported[0]['status'], "pending")
        self.assertEqual(exported[0]['priority'], 3)
        self.assertIn('created_at', exported[0])
        self.assertIn('updated_at', exported[0])
    
    def test_import_from_list(self):
        """Test importing tasks from a list of dictionaries."""
        task_data = [
            {
                'name': 'Imported Task 1',
                'status': 'pending',
                'priority': 3,
                'created_at': '2023-01-01T00:00:00',
                'updated_at': '2023-01-01T00:00:00'
            },
            {
                'name': 'Imported Task 2',
                'status': 'completed',
                'priority': 5,
                'created_at': '2023-01-01T00:00:00',
                'updated_at': '2023-01-01T00:00:00'
            }
        ]
        
        imported_count = self.todo_list.import_from_list(task_data)
        self.assertEqual(imported_count, 2)
        self.assertEqual(len(self.todo_list), 2)
        
        task_names = [task.name for task in self.todo_list]
        self.assertEqual(set(task_names), {"Imported Task 1", "Imported Task 2"})
    
    def test_import_invalid_data(self):
        """Test importing tasks with invalid data."""
        invalid_data = [
            {'name': 'Valid Task', 'status': 'pending'},
            {'invalid': 'data'},  # Missing required fields
            {'name': 'Another Task', 'status': 'invalid_status'}
        ]
        
        imported_count = self.todo_list.import_from_list(invalid_data)
        self.assertEqual(imported_count, 1)  # Only the first valid task
        self.assertEqual(len(self.todo_list), 1)
    
    def test_iteration(self):
        """Test that ToDoList is iterable."""
        self.todo_list.add_task("Task 1")
        self.todo_list.add_task("Task 2")
        
        task_names = [task.name for task in self.todo_list]
        self.assertEqual(task_names, ["Task 1", "Task 2"])
    
    def test_string_representation(self):
        """Test string representation of ToDoList."""
        self.todo_list.add_task("Task 1")
        self.todo_list.add_task("Task 2")
        
        expected = "Test List (2 tasks)"
        self.assertEqual(str(self.todo_list), expected)


class TestCreateSampleTodoList(unittest.TestCase):
    """Test the create_sample_todo_list function."""
    
    def test_create_sample_todo_list(self):
        """Test creating a sample todo list."""
        todo_list = create_sample_todo_list()
        
        self.assertIsInstance(todo_list, ToDoList)
        self.assertEqual(todo_list.name, "Sample Project Tasks")
        self.assertGreater(len(todo_list), 0)
        
        # Check that it has tasks with different statuses and priorities
        statuses = set(task.status for task in todo_list)
        priorities = set(task.priority for task in todo_list)
        
        self.assertIn(TaskStatus.COMPLETED, statuses)
        self.assertIn(TaskStatus.IN_PROGRESS, statuses)
        self.assertIn(TaskStatus.PENDING, statuses)
        self.assertGreater(len(priorities), 1)


class TestIntegration(unittest.TestCase):
    """Integration tests for the complete refactored ToDo application."""
    
    def test_complete_workflow(self):
        """Test a complete workflow with the refactored application."""
        # Create todo list
        todo_list = ToDoList("Integration Test")
        
        # Add tasks with different priorities and statuses
        todo_list.add_task("High priority task", TaskStatus.PENDING, priority=5)
        todo_list.add_task("Low priority task", TaskStatus.PENDING, priority=1)
        todo_list.add_task("In progress task", TaskStatus.IN_PROGRESS, priority=3)
        
        # Verify initial state
        self.assertEqual(todo_list.get_task_count(), 3)
        self.assertEqual(todo_list.get_pending_count(), 2)
        self.assertEqual(todo_list.get_in_progress_count(), 1)
        
        # Mark high priority task as completed
        todo_list.mark_task_completed("High priority task")
        self.assertEqual(todo_list.get_completed_count(), 1)
        self.assertEqual(todo_list.get_pending_count(), 1)
        
        # Sort by priority and verify
        todo_list.sort_tasks_by_priority()
        priorities = [task.priority for task in todo_list]
        self.assertEqual(priorities, [5, 3, 1])
        
        # Clear completed tasks
        removed_count = todo_list.clear_completed_tasks()
        self.assertEqual(removed_count, 1)
        self.assertEqual(todo_list.get_task_count(), 2)
        
        # Export and import
        exported_data = todo_list.export_to_list()
        new_todo_list = ToDoList("Imported List")
        imported_count = new_todo_list.import_from_list(exported_data)
        self.assertEqual(imported_count, 2)
        self.assertEqual(len(new_todo_list), 2)


if __name__ == '__main__':
    # Create a test suite
    test_suite = unittest.TestSuite()
    
    # Add test cases
    test_suite.addTest(unittest.makeSuite(TestTaskStatus))
    test_suite.addTest(unittest.makeSuite(TestTask))
    test_suite.addTest(unittest.makeSuite(TestToDoList))
    test_suite.addTest(unittest.makeSuite(TestCreateSampleTodoList))
    test_suite.addTest(unittest.makeSuite(TestIntegration))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # Print summary
    print(f"\n{'='*70}")
    print(f"REFACTORED TODO APPLICATION - TEST SUMMARY")
    print(f"{'='*70}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print(f"\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print(f"\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
