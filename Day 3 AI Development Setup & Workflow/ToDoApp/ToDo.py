"""
ToDo Application - A Simple Task Management System

This module provides a simple but effective task management system with two
main classes: Task and ToDoList. The Task class represents individual tasks
with a name and status, while the ToDoList class manages a collection of tasks.

Classes:
    Task: Represents a single task with name and status attributes
    ToDoList: Manages a collection of Task objects with CRUD operations

Functions:
    example_usage(): Demonstrates various ways to use the classes
    main(): Primary demonstration function with comprehensive examples

The application supports basic task management operations including:
- Creating tasks with custom names and statuses
- Adding and removing tasks from lists
- Marking tasks as completed or pending
- Displaying tasks in formatted tables
- Getting statistics about task completion

Example:
    >>> from ToDo import Task, ToDoList
    >>> 
    >>> # Create a task
    >>> task = Task("Learn Python", "pending")
    >>> print(task)
    [PENDING] Learn Python
    >>> 
    >>> # Create a todo list and add tasks
    >>> todo_list = ToDoList()
    >>> todo_list.add_task("Buy groceries")
    >>> todo_list.add_task("Call mom", "completed")
    >>> todo_list.display_tasks()
    
    ==================================================
    TO-DO LIST
    ==================================================
    1. [PENDING] Buy groceries
    2. [COMPLETED] Call mom
    ==================================================

Author: AI Assistant
Version: 1.0
"""


class Task:
    """
    A class to represent a task with a name and status.
    
    This class provides a simple way to create and manage individual tasks
    in a todo list application. Each task has a name and can be in one of
    two states: pending or completed.
    
    Attributes:
        name (str): The name or description of the task
        status (str): The current status of the task ("pending" or "completed")
    
    Example:
        >>> task = Task("Learn Python", "pending")
        >>> print(task)
        [PENDING] Learn Python
        >>> task.mark_completed()
        >>> print(task)
        [COMPLETED] Learn Python
    """
    
    def __init__(self, name, status="pending"):
        """
        Initialize a new task with a name and optional status.
        
        Args:
            name (str): The name/description of the task. Should be descriptive
                       and clear about what needs to be done.
            status (str, optional): The initial status of the task. Must be either
                                  "pending" or "completed". Defaults to "pending".
        
        Raises:
            None: This method does not raise any exceptions, but invalid status
                  values will be stored as-is and may cause issues with other methods.
        
        Example:
            >>> task1 = Task("Buy groceries")
            >>> task2 = Task("Call mom", "completed")
            >>> print(task1.status, task2.status)
            pending completed
        """
        self.name = name
        self.status = status
    
    def __str__(self):
        """
        Return a string representation of the task.
        
        Returns:
            str: A formatted string showing the task status and name in the format
                 "[STATUS] Task Name" where STATUS is uppercase.
        
        Example:
            >>> task = Task("Learn Python", "pending")
            >>> print(task)
            [PENDING] Learn Python
            >>> task.mark_completed()
            >>> print(task)
            [COMPLETED] Learn Python
        """
        return f"[{self.status.upper()}] {self.name}"
    
    def mark_completed(self):
        """
        Mark the task as completed.
        
        This method changes the task's status from "pending" to "completed".
        It can be called multiple times safely - if the task is already
        completed, calling this method again has no effect.
        
        Returns:
            None
        
        Example:
            >>> task = Task("Learn Python", "pending")
            >>> task.mark_completed()
            >>> print(task.status)
            completed
        """
        self.status = "completed"
    
    def mark_pending(self):
        """
        Mark the task as pending.
        
        This method changes the task's status from "completed" to "pending".
        It can be called multiple times safely - if the task is already
        pending, calling this method again has no effect.
        
        Returns:
            None
        
        Example:
            >>> task = Task("Learn Python", "completed")
            >>> task.mark_pending()
            >>> print(task.status)
            pending
        """
        self.status = "pending"


class ToDoList:
    """
    A class to manage a collection of tasks in a todo list.
    
    This class provides functionality to add, remove, and manage multiple tasks.
    It maintains a list of Task objects and provides methods to manipulate
    them, display them, and get statistics about the task collection.
    
    Attributes:
        tasks (list): A list containing Task objects representing all tasks
                     in the todo list.
    
    Example:
        >>> todo_list = ToDoList()
        >>> todo_list.add_task("Learn Python")
        >>> todo_list.add_task("Write tests", "completed")
        >>> todo_list.display_tasks()
        ==================================================
        TO-DO LIST
        ==================================================
        1. [PENDING] Learn Python
        2. [COMPLETED] Write tests
        ==================================================
    """
    
    def __init__(self):
        """
        Initialize an empty todo list.
        
        Creates a new ToDoList instance with an empty list of tasks.
        The tasks list will be populated using the add_task() method.
        
        Returns:
            None
        
        Example:
            >>> todo_list = ToDoList()
            >>> print(len(todo_list.tasks))
            0
        """
        self.tasks = []
    
    def add_task(self, name, status="pending"):
        """
        Add a new task to the todo list.
        
        Creates a new Task object with the specified name and status,
        adds it to the tasks list, and prints a confirmation message.
        
        Args:
            name (str): The name/description of the task. Should be clear
                       and descriptive about what needs to be done.
            status (str, optional): The initial status of the task. Must be
                                  "pending" or "completed". Defaults to "pending".
        
        Returns:
            None
        
        Side Effects:
            - Adds a new Task object to the self.tasks list
            - Prints a confirmation message to stdout
        
        Example:
            >>> todo_list = ToDoList()
            >>> todo_list.add_task("Buy groceries")
            Task 'Buy groceries' added successfully!
            >>> todo_list.add_task("Call mom", "completed")
            Task 'Call mom' added successfully!
        """
        task = Task(name, status)
        self.tasks.append(task)
        print(f"Task '{name}' added successfully!")
    
    def remove_task(self, name):
        """
        Remove a task from the todo list by name.
        
        Searches for a task with the specified name (case-insensitive) and
        removes it from the tasks list. If found, prints a confirmation
        message and returns True. If not found, prints an error message
        and returns False.
        
        Args:
            name (str): The name of the task to remove. The search is
                       case-insensitive, so "Task" will match "task".
        
        Returns:
            bool: True if the task was found and successfully removed,
                  False if the task was not found.
        
        Side Effects:
            - Removes the matching Task object from self.tasks list
            - Prints a confirmation or error message to stdout
        
        Example:
            >>> todo_list = ToDoList()
            >>> todo_list.add_task("Buy groceries")
            >>> todo_list.add_task("Call mom")
            >>> todo_list.remove_task("buy groceries")
            Task 'Buy groceries' removed successfully!
            True
            >>> todo_list.remove_task("Non-existent task")
            Task 'Non-existent task' not found!
            False
        """
        for i, task in enumerate(self.tasks):
            if task.name.lower() == name.lower():
                removed_task = self.tasks.pop(i)
                print(f"Task '{removed_task.name}' removed successfully!")
                return True
        print(f"Task '{name}' not found!")
        return False
    
    def display_tasks(self):
        """
        Display all tasks in the todo list in a formatted table.
        
        Prints all tasks in the list with their status and name. If the
        list is empty, prints a message indicating no tasks are present.
        Tasks are numbered sequentially starting from 1.
        
        Returns:
            None
        
        Side Effects:
            - Prints formatted output to stdout showing all tasks
            - If no tasks exist, prints "No tasks in the list!"
        
        Example:
            >>> todo_list = ToDoList()
            >>> todo_list.add_task("Learn Python")
            >>> todo_list.add_task("Write tests", "completed")
            >>> todo_list.display_tasks()
            
            ==================================================
            TO-DO LIST
            ==================================================
            1. [PENDING] Learn Python
            2. [COMPLETED] Write tests
            ==================================================
        """
        if not self.tasks:
            print("No tasks in the list!")
            return
        
        print("\n" + "="*50)
        print("TO-DO LIST")
        print("="*50)
        for i, task in enumerate(self.tasks, 1):
            print(f"{i}. {task}")
        print("="*50)
    
    def mark_task_completed(self, name):
        """
        Mark a specific task as completed.
        
        Searches for a task with the specified name (case-insensitive) and
        marks it as completed. If found, prints a confirmation message and
        returns True. If not found, prints an error message and returns False.
        
        Args:
            name (str): The name of the task to mark as completed. The search
                       is case-insensitive, so "Task" will match "task".
        
        Returns:
            bool: True if the task was found and successfully marked as completed,
                  False if the task was not found.
        
        Side Effects:
            - Changes the status of the matching task to "completed"
            - Prints a confirmation or error message to stdout
        
        Example:
            >>> todo_list = ToDoList()
            >>> todo_list.add_task("Learn Python")
            >>> todo_list.mark_task_completed("learn python")
            Task 'Learn Python' marked as completed!
            True
            >>> todo_list.mark_task_completed("Non-existent task")
            Task 'Non-existent task' not found!
            False
        """
        for task in self.tasks:
            if task.name.lower() == name.lower():
                task.mark_completed()
                print(f"Task '{task.name}' marked as completed!")
                return True
        print(f"Task '{name}' not found!")
        return False
    
    def get_task_count(self):
        """
        Get the total number of tasks in the todo list.
        
        Returns the count of all tasks regardless of their status.
        This includes pending, completed, and any other status tasks.
        
        Returns:
            int: The total number of tasks in the list. Returns 0 if
                 the list is empty.
        
        Example:
            >>> todo_list = ToDoList()
            >>> todo_list.get_task_count()
            0
            >>> todo_list.add_task("Task 1")
            >>> todo_list.add_task("Task 2", "completed")
            >>> todo_list.get_task_count()
            2
        """
        return len(self.tasks)
    
    def get_completed_count(self):
        """
        Get the number of completed tasks in the todo list.
        
        Counts all tasks that have a status of "completed" and returns
        the total count. This is useful for tracking progress and
        generating statistics.
        
        Returns:
            int: The number of tasks with status "completed". Returns 0
                 if no tasks are completed.
        
        Example:
            >>> todo_list = ToDoList()
            >>> todo_list.add_task("Task 1", "pending")
            >>> todo_list.add_task("Task 2", "completed")
            >>> todo_list.add_task("Task 3", "completed")
            >>> todo_list.get_completed_count()
            2
        """
        return sum(1 for task in self.tasks if task.status == "completed")
    
    def get_pending_count(self):
        """
        Get the number of pending tasks in the todo list.
        
        Counts all tasks that have a status of "pending" and returns
        the total count. This is useful for tracking remaining work
        and generating statistics.
        
        Returns:
            int: The number of tasks with status "pending". Returns 0
                 if no tasks are pending.
        
        Example:
            >>> todo_list = ToDoList()
            >>> todo_list.add_task("Task 1", "pending")
            >>> todo_list.add_task("Task 2", "completed")
            >>> todo_list.add_task("Task 3", "pending")
            >>> todo_list.get_pending_count()
            2
        """
        return sum(1 for task in self.tasks if task.status == "pending")


def example_usage():
    """
    Demonstrate additional usage examples for the Task and ToDoList classes.
    
    This function provides comprehensive examples of how to use both the Task
    and ToDoList classes, including creating individual tasks, working with
    different statuses, handling error cases, and displaying task information.
    It serves as a tutorial for developers learning to use the todo application.
    
    Returns:
        None
    
    Side Effects:
        - Creates a new ToDoList instance
        - Adds multiple tasks with different statuses
        - Creates individual Task objects
        - Demonstrates status changes
        - Shows error handling for non-existent tasks
        - Prints formatted output to stdout
    
    Example:
        >>> example_usage()
        
        ============================================================
                   ADDITIONAL USAGE EXAMPLES
        ============================================================
        
        📝 Example 1: Adding tasks with different initial statuses
        --------------------------------------------------------
        Task 'Buy groceries' added successfully!
        Task 'Call mom' added successfully!
        Task 'Finish homework' added successfully!
        Task 'Go to gym' added successfully!
        ...
    """
    print("\n" + "="*60)
    print("           ADDITIONAL USAGE EXAMPLES")
    print("="*60)
    print()
    
    # Create a new todo list
    my_todo = ToDoList()
    
    # Example 1: Adding tasks with different statuses
    print("📝 Example 1: Adding tasks with different initial statuses")
    print("-" * 55)
    my_todo.add_task("Buy groceries", "pending")
    my_todo.add_task("Call mom", "pending")
    my_todo.add_task("Finish homework", "completed")  # Already completed
    my_todo.add_task("Go to gym", "pending")
    print()
    
    # Example 2: Working with individual tasks
    print("📝 Example 2: Working with individual Task objects")
    print("-" * 50)
    task1 = Task("Read a book", "pending")
    task2 = Task("Write a blog post", "completed")
    
    print(f"Task 1: {task1}")
    print(f"Task 2: {task2}")
    
    # Change task status
    task1.mark_completed()
    print(f"After marking as completed: {task1}")
    
    task2.mark_pending()
    print(f"After marking as pending: {task2}")
    print()
    
    # Example 3: Error handling
    print("📝 Example 3: Error handling when removing non-existent tasks")
    print("-" * 60)
    my_todo.remove_task("Non-existent task")
    my_todo.mark_task_completed("Another non-existent task")
    print()
    
    # Example 4: Display current state
    print("📝 Example 4: Current state of the todo list")
    print("-" * 45)
    my_todo.display_tasks()
    print()


def main():
    """
    Main function to demonstrate the ToDo application with comprehensive examples.
    
    This function serves as the primary demonstration of the ToDo application,
    showcasing all major features including task creation, status management,
    task removal, and statistics tracking. It provides a complete walkthrough
    of the application's capabilities with detailed output and examples.
    
    The demonstration includes:
    - Creating a new todo list
    - Adding multiple tasks with different statuses
    - Displaying tasks in formatted tables
    - Showing statistics before and after operations
    - Marking tasks as completed
    - Removing tasks (both existing and non-existing)
    - Running additional usage examples
    
    Returns:
        None
    
    Side Effects:
        - Creates multiple ToDoList instances
        - Adds various tasks with different statuses
        - Modifies task statuses
        - Removes tasks from lists
        - Prints extensive formatted output to stdout
        - Calls example_usage() function
    
    Example:
        >>> main()
        ============================================================
                   WELCOME TO THE TODO APPLICATION
        ============================================================
        
        📝 Creating a new ToDo list...
        
        ➕ Adding tasks to the list:
        ------------------------------
        Task 'Learn Python classes' added successfully!
        Task 'Complete project documentation' added successfully!
        ...
    """
    print("="*60)
    print("           WELCOME TO THE TODO APPLICATION")
    print("="*60)
    print()
    
    # Create a new todo list
    print("📝 Creating a new ToDo list...")
    todo_list = ToDoList()
    print()
    
    # Add some sample tasks with detailed feedback
    print("➕ Adding tasks to the list:")
    print("-" * 30)
    todo_list.add_task("Learn Python classes")
    todo_list.add_task("Complete project documentation")
    todo_list.add_task("Review code")
    todo_list.add_task("Test the application")
    todo_list.add_task("Deploy to production")
    print()
    
    # Display all tasks
    print("📋 Current task list:")
    todo_list.display_tasks()
    print()
    
    # Show initial statistics
    print("📊 Initial Statistics:")
    print(f"   Total tasks: {todo_list.get_task_count()}")
    print(f"   Completed: {todo_list.get_completed_count()}")
    print(f"   Pending: {todo_list.get_pending_count()}")
    print()
    
    # Mark some tasks as completed
    print("✅ Marking tasks as completed:")
    print("-" * 35)
    todo_list.mark_task_completed("Learn Python classes")
    todo_list.mark_task_completed("Review code")
    print()
    
    # Display tasks after marking some as completed
    print("📋 Updated task list after marking some as completed:")
    todo_list.display_tasks()
    print()
    
    # Show updated statistics
    print("📊 Updated Statistics:")
    print(f"   Total tasks: {todo_list.get_task_count()}")
    print(f"   Completed: {todo_list.get_completed_count()}")
    print(f"   Pending: {todo_list.get_pending_count()}")
    print()
    
    # Try to remove a task that exists
    print("🗑️  Removing tasks:")
    print("-" * 20)
    todo_list.remove_task("Complete project documentation")
    print()
    
    # Try to remove a task that doesn't exist
    print("🔍 Attempting to remove a non-existent task:")
    todo_list.remove_task("Non-existent task")
    print()
    
    # Final display
    print("📋 Final task list:")
    todo_list.display_tasks()
    print()
    
    # Final statistics
    print("📊 Final Statistics:")
    print(f"   Total tasks: {todo_list.get_task_count()}")
    print(f"   Completed: {todo_list.get_completed_count()}")
    print(f"   Pending: {todo_list.get_pending_count()}")
    print()
    
    print("="*60)
    print("           DEMONSTRATION COMPLETED")
    print("="*60)
    
    # Run additional examples
    example_usage()


if __name__ == "__main__":
    main()
