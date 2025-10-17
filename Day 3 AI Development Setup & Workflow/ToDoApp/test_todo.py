import unittest
from ToDo import Task, ToDoList


class TestTask(unittest.TestCase):
    """
    Unit tests for the Task class.
    """
    
    def test_task_creation_with_default_status(self):
        """Test creating a task with default status."""
        task = Task("Test task")
        self.assertEqual(task.name, "Test task")
        self.assertEqual(task.status, "pending")
    
    def test_task_creation_with_custom_status(self):
        """Test creating a task with custom status."""
        task = Task("Test task", "completed")
        self.assertEqual(task.name, "Test task")
        self.assertEqual(task.status, "completed")
    
    def test_task_string_representation(self):
        """Test the string representation of a task."""
        task = Task("Test task", "pending")
        self.assertEqual(str(task), "[PENDING] Test task")
        
        task_completed = Task("Completed task", "completed")
        self.assertEqual(str(task_completed), "[COMPLETED] Completed task")
    
    def test_mark_completed(self):
        """Test marking a task as completed."""
        task = Task("Test task", "pending")
        task.mark_completed()
        self.assertEqual(task.status, "completed")
    
    def test_mark_pending(self):
        """Test marking a task as pending."""
        task = Task("Test task", "completed")
        task.mark_pending()
        self.assertEqual(task.status, "pending")
    
    def test_mark_pending_when_already_pending(self):
        """Test marking a task as pending when it's already pending."""
        task = Task("Test task", "pending")
        task.mark_pending()
        self.assertEqual(task.status, "pending")
    
    def test_mark_completed_when_already_completed(self):
        """Test marking a task as completed when it's already completed."""
        task = Task("Test task", "completed")
        task.mark_completed()
        self.assertEqual(task.status, "completed")


class TestToDoList(unittest.TestCase):
    """
    Unit tests for the ToDoList class.
    """
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.todo_list = ToDoList()
    
    def test_empty_todo_list_creation(self):
        """Test creating an empty todo list."""
        self.assertEqual(len(self.todo_list.tasks), 0)
        self.assertEqual(self.todo_list.get_task_count(), 0)
    
    def test_add_task_with_default_status(self):
        """Test adding a task with default status."""
        self.todo_list.add_task("Test task")
        self.assertEqual(len(self.todo_list.tasks), 1)
        self.assertEqual(self.todo_list.tasks[0].name, "Test task")
        self.assertEqual(self.todo_list.tasks[0].status, "pending")
    
    def test_add_task_with_custom_status(self):
        """Test adding a task with custom status."""
        self.todo_list.add_task("Test task", "completed")
        self.assertEqual(len(self.todo_list.tasks), 1)
        self.assertEqual(self.todo_list.tasks[0].name, "Test task")
        self.assertEqual(self.todo_list.tasks[0].status, "completed")
    
    def test_add_multiple_tasks(self):
        """Test adding multiple tasks."""
        self.todo_list.add_task("Task 1")
        self.todo_list.add_task("Task 2", "completed")
        self.todo_list.add_task("Task 3")
        
        self.assertEqual(len(self.todo_list.tasks), 3)
        self.assertEqual(self.todo_list.tasks[0].name, "Task 1")
        self.assertEqual(self.todo_list.tasks[1].name, "Task 2")
        self.assertEqual(self.todo_list.tasks[2].name, "Task 3")
    
    def test_remove_existing_task(self):
        """Test removing an existing task."""
        self.todo_list.add_task("Task 1")
        self.todo_list.add_task("Task 2")
        
        result = self.todo_list.remove_task("Task 1")
        self.assertTrue(result)
        self.assertEqual(len(self.todo_list.tasks), 1)
        self.assertEqual(self.todo_list.tasks[0].name, "Task 2")
    
    def test_remove_non_existing_task(self):
        """Test removing a non-existing task."""
        self.todo_list.add_task("Task 1")
        
        result = self.todo_list.remove_task("Non-existent task")
        self.assertFalse(result)
        self.assertEqual(len(self.todo_list.tasks), 1)
    
    def test_remove_task_case_insensitive(self):
        """Test removing a task with case insensitive matching."""
        self.todo_list.add_task("Task 1")
        
        result = self.todo_list.remove_task("task 1")
        self.assertTrue(result)
        self.assertEqual(len(self.todo_list.tasks), 0)
    
    def test_mark_task_completed_existing(self):
        """Test marking an existing task as completed."""
        self.todo_list.add_task("Task 1", "pending")
        
        result = self.todo_list.mark_task_completed("Task 1")
        self.assertTrue(result)
        self.assertEqual(self.todo_list.tasks[0].status, "completed")
    
    def test_mark_task_completed_non_existing(self):
        """Test marking a non-existing task as completed."""
        result = self.todo_list.mark_task_completed("Non-existent task")
        self.assertFalse(result)
    
    def test_mark_task_completed_case_insensitive(self):
        """Test marking a task as completed with case insensitive matching."""
        self.todo_list.add_task("Task 1", "pending")
        
        result = self.todo_list.mark_task_completed("task 1")
        self.assertTrue(result)
        self.assertEqual(self.todo_list.tasks[0].status, "completed")
    
    def test_get_task_count(self):
        """Test getting the total task count."""
        self.assertEqual(self.todo_list.get_task_count(), 0)
        
        self.todo_list.add_task("Task 1")
        self.assertEqual(self.todo_list.get_task_count(), 1)
        
        self.todo_list.add_task("Task 2")
        self.assertEqual(self.todo_list.get_task_count(), 2)
    
    def test_get_completed_count(self):
        """Test getting the completed task count."""
        self.assertEqual(self.todo_list.get_completed_count(), 0)
        
        self.todo_list.add_task("Task 1", "pending")
        self.todo_list.add_task("Task 2", "completed")
        self.todo_list.add_task("Task 3", "completed")
        
        self.assertEqual(self.todo_list.get_completed_count(), 2)
    
    def test_get_pending_count(self):
        """Test getting the pending task count."""
        self.assertEqual(self.todo_list.get_pending_count(), 0)
        
        self.todo_list.add_task("Task 1", "pending")
        self.todo_list.add_task("Task 2", "completed")
        self.todo_list.add_task("Task 3", "pending")
        
        self.assertEqual(self.todo_list.get_pending_count(), 2)
    
    def test_display_tasks_empty_list(self):
        """Test displaying an empty task list."""
        # This test checks that display_tasks doesn't crash with empty list
        # We can't easily test the output, but we can ensure no exceptions are raised
        try:
            self.todo_list.display_tasks()
        except Exception as e:
            self.fail(f"display_tasks() raised an exception with empty list: {e}")
    
    def test_display_tasks_with_tasks(self):
        """Test displaying a task list with tasks."""
        self.todo_list.add_task("Task 1", "pending")
        self.todo_list.add_task("Task 2", "completed")
        
        # This test checks that display_tasks doesn't crash with tasks
        try:
            self.todo_list.display_tasks()
        except Exception as e:
            self.fail(f"display_tasks() raised an exception with tasks: {e}")
    
    def test_complex_workflow(self):
        """Test a complex workflow with multiple operations."""
        # Add tasks
        self.todo_list.add_task("Learn Python", "pending")
        self.todo_list.add_task("Write tests", "pending")
        self.todo_list.add_task("Deploy app", "pending")
        
        # Verify initial state
        self.assertEqual(self.todo_list.get_task_count(), 3)
        self.assertEqual(self.todo_list.get_pending_count(), 3)
        self.assertEqual(self.todo_list.get_completed_count(), 0)
        
        # Mark one as completed
        self.todo_list.mark_task_completed("Learn Python")
        self.assertEqual(self.todo_list.get_pending_count(), 2)
        self.assertEqual(self.todo_list.get_completed_count(), 1)
        
        # Remove a task
        self.todo_list.remove_task("Write tests")
        self.assertEqual(self.todo_list.get_task_count(), 2)
        self.assertEqual(self.todo_list.get_pending_count(), 1)
        
        # Mark remaining pending as completed
        self.todo_list.mark_task_completed("Deploy app")
        self.assertEqual(self.todo_list.get_pending_count(), 0)
        self.assertEqual(self.todo_list.get_completed_count(), 2)
    
    def test_duplicate_task_names(self):
        """Test handling of duplicate task names."""
        self.todo_list.add_task("Duplicate task")
        self.todo_list.add_task("Duplicate task")
        
        # Should allow duplicate names
        self.assertEqual(self.todo_list.get_task_count(), 2)
        
        # Removing should remove the first occurrence
        result = self.todo_list.remove_task("Duplicate task")
        self.assertTrue(result)
        self.assertEqual(self.todo_list.get_task_count(), 1)
    
    def test_empty_task_name(self):
        """Test handling of empty task names."""
        self.todo_list.add_task("")
        self.assertEqual(self.todo_list.get_task_count(), 1)
        self.assertEqual(self.todo_list.tasks[0].name, "")
    
    def test_whitespace_task_name(self):
        """Test handling of whitespace-only task names."""
        self.todo_list.add_task("   ")
        self.assertEqual(self.todo_list.get_task_count(), 1)
        self.assertEqual(self.todo_list.tasks[0].name, "   ")


class TestIntegration(unittest.TestCase):
    """
    Integration tests for the complete ToDo application.
    """
    
    def test_task_and_todolist_integration(self):
        """Test integration between Task and ToDoList classes."""
        todo_list = ToDoList()
        
        # Create individual tasks
        task1 = Task("Individual task 1", "pending")
        task2 = Task("Individual task 2", "completed")
        
        # Add tasks to list
        todo_list.add_task("List task 1")
        todo_list.add_task("List task 2", "completed")
        
        # Verify both types of tasks work
        self.assertEqual(todo_list.get_task_count(), 2)
        self.assertEqual(todo_list.get_completed_count(), 1)
        
        # Test individual task operations
        task1.mark_completed()
        self.assertEqual(task1.status, "completed")
        
        task2.mark_pending()
        self.assertEqual(task2.status, "pending")
    
    def test_large_number_of_tasks(self):
        """Test performance with a large number of tasks."""
        todo_list = ToDoList()
        
        # Add many tasks
        for i in range(100):
            todo_list.add_task(f"Task {i}")
        
        self.assertEqual(todo_list.get_task_count(), 100)
        
        # Mark half as completed
        for i in range(50):
            todo_list.mark_task_completed(f"Task {i}")
        
        self.assertEqual(todo_list.get_completed_count(), 50)
        self.assertEqual(todo_list.get_pending_count(), 50)
        
        # Remove some tasks
        for i in range(25):
            todo_list.remove_task(f"Task {i}")
        
        self.assertEqual(todo_list.get_task_count(), 75)


if __name__ == '__main__':
    # Create a test suite
    test_suite = unittest.TestSuite()
    
    # Add test cases
    test_suite.addTest(unittest.makeSuite(TestTask))
    test_suite.addTest(unittest.makeSuite(TestToDoList))
    test_suite.addTest(unittest.makeSuite(TestIntegration))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"TEST SUMMARY")
    print(f"{'='*60}")
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
