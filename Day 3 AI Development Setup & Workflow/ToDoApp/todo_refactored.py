"""
Refactored ToDo Application

This module provides a clean, efficient, and well-structured ToDo application
with improved error handling, type hints, and better separation of concerns.
"""

from __future__ import annotations
from typing import List, Optional, Iterator, Union
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
import logging


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TaskStatus(Enum):
    """Enumeration for task statuses to prevent invalid states."""
    PENDING = "pending"
    COMPLETED = "completed"
    IN_PROGRESS = "in_progress"
    CANCELLED = "cancelled"


@dataclass
class Task:
    """
    A data class representing a task with name, status, and metadata.
    
    Attributes:
        name: The name/description of the task
        status: The current status of the task
        created_at: Timestamp when the task was created
        updated_at: Timestamp when the task was last modified
        priority: Priority level (1-5, where 5 is highest)
    """
    name: str
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = None
    updated_at: datetime = None
    priority: int = 3
    
    def __post_init__(self):
        """Initialize timestamps and validate data after object creation."""
        now = datetime.now()
        if self.created_at is None:
            self.created_at = now
        if self.updated_at is None:
            self.updated_at = now
        
        # Validate priority
        if not 1 <= self.priority <= 5:
            raise ValueError("Priority must be between 1 and 5")
    
    def __str__(self) -> str:
        """String representation of the task."""
        return f"[{self.status.value.upper()}] {self.name} (Priority: {self.priority})"
    
    def __repr__(self) -> str:
        """Developer representation of the task."""
        return f"Task(name='{self.name}', status={self.status}, priority={self.priority})"
    
    def mark_completed(self) -> None:
        """Mark the task as completed."""
        self._update_status(TaskStatus.COMPLETED)
    
    def mark_pending(self) -> None:
        """Mark the task as pending."""
        self._update_status(TaskStatus.PENDING)
    
    def mark_in_progress(self) -> None:
        """Mark the task as in progress."""
        self._update_status(TaskStatus.IN_PROGRESS)
    
    def mark_cancelled(self) -> None:
        """Mark the task as cancelled."""
        self._update_status(TaskStatus.CANCELLED)
    
    def _update_status(self, new_status: TaskStatus) -> None:
        """Update the task status and timestamp."""
        if self.status != new_status:
            self.status = new_status
            self.updated_at = datetime.now()
            logger.info(f"Task '{self.name}' status changed to {new_status.value}")
    
    def set_priority(self, priority: int) -> None:
        """Set the task priority."""
        if not 1 <= priority <= 5:
            raise ValueError("Priority must be between 1 and 5")
        self.priority = priority
        self.updated_at = datetime.now()
    
    def is_completed(self) -> bool:
        """Check if the task is completed."""
        return self.status == TaskStatus.COMPLETED
    
    def is_pending(self) -> bool:
        """Check if the task is pending."""
        return self.status == TaskStatus.PENDING


class ToDoList:
    """
    A class to manage a collection of tasks with advanced functionality.
    """
    
    def __init__(self, name: str = "My ToDo List"):
        """
        Initialize a new todo list.
        
        Args:
            name: Name of the todo list
        """
        self.name = name
        self._tasks: List[Task] = []
        self._task_id_counter = 0
    
    def __len__(self) -> int:
        """Return the number of tasks in the list."""
        return len(self._tasks)
    
    def __iter__(self) -> Iterator[Task]:
        """Allow iteration over tasks."""
        return iter(self._tasks)
    
    def __str__(self) -> str:
        """String representation of the todo list."""
        return f"{self.name} ({len(self._tasks)} tasks)"
    
    def add_task(self, name: str, status: Union[TaskStatus, str] = TaskStatus.PENDING, 
                 priority: int = 3) -> Task:
        """
        Add a new task to the list.
        
        Args:
            name: The name/description of the task
            status: The status of the task
            priority: Priority level (1-5)
            
        Returns:
            The created Task object
            
        Raises:
            ValueError: If name is empty or priority is invalid
        """
        if not name or not name.strip():
            raise ValueError("Task name cannot be empty")
        
        # Convert string status to enum if needed
        if isinstance(status, str):
            try:
                status = TaskStatus(status.lower())
            except ValueError:
                raise ValueError(f"Invalid status: {status}. Must be one of {[s.value for s in TaskStatus]}")
        
        task = Task(name.strip(), status, priority=priority)
        self._tasks.append(task)
        logger.info(f"Added task: {task.name}")
        return task
    
    def remove_task(self, name: str) -> bool:
        """
        Remove a task from the list by name (case-insensitive).
        
        Args:
            name: The name of the task to remove
            
        Returns:
            True if task was found and removed, False otherwise
        """
        for i, task in enumerate(self._tasks):
            if task.name.lower() == name.lower():
                removed_task = self._tasks.pop(i)
                logger.info(f"Removed task: {removed_task.name}")
                return True
        logger.warning(f"Task not found: {name}")
        return False
    
    def remove_task_by_index(self, index: int) -> Optional[Task]:
        """
        Remove a task by its index in the list.
        
        Args:
            index: The index of the task to remove
            
        Returns:
            The removed Task object, or None if index is invalid
        """
        try:
            removed_task = self._tasks.pop(index)
            logger.info(f"Removed task by index {index}: {removed_task.name}")
            return removed_task
        except IndexError:
            logger.warning(f"Invalid task index: {index}")
            return None
    
    def find_task(self, name: str) -> Optional[Task]:
        """
        Find a task by name (case-insensitive).
        
        Args:
            name: The name of the task to find
            
        Returns:
            The Task object if found, None otherwise
        """
        for task in self._tasks:
            if task.name.lower() == name.lower():
                return task
        return None
    
    def find_tasks_by_status(self, status: Union[TaskStatus, str]) -> List[Task]:
        """
        Find all tasks with a specific status.
        
        Args:
            status: The status to filter by
            
        Returns:
            List of tasks with the specified status
        """
        if isinstance(status, str):
            try:
                status = TaskStatus(status.lower())
            except ValueError:
                return []
        
        return [task for task in self._tasks if task.status == status]
    
    def mark_task_completed(self, name: str) -> bool:
        """
        Mark a specific task as completed.
        
        Args:
            name: The name of the task to mark as completed
            
        Returns:
            True if task was found and marked, False otherwise
        """
        task = self.find_task(name)
        if task:
            task.mark_completed()
            return True
        logger.warning(f"Task not found for completion: {name}")
        return False
    
    def mark_task_pending(self, name: str) -> bool:
        """
        Mark a specific task as pending.
        
        Args:
            name: The name of the task to mark as pending
            
        Returns:
            True if task was found and marked, False otherwise
        """
        task = self.find_task(name)
        if task:
            task.mark_pending()
            return True
        logger.warning(f"Task not found for pending: {name}")
        return False
    
    def get_task_count(self) -> int:
        """Get the total number of tasks."""
        return len(self._tasks)
    
    def get_completed_count(self) -> int:
        """Get the number of completed tasks."""
        return len(self.find_tasks_by_status(TaskStatus.COMPLETED))
    
    def get_pending_count(self) -> int:
        """Get the number of pending tasks."""
        return len(self.find_tasks_by_status(TaskStatus.PENDING))
    
    def get_in_progress_count(self) -> int:
        """Get the number of in-progress tasks."""
        return len(self.find_tasks_by_status(TaskStatus.IN_PROGRESS))
    
    def get_cancelled_count(self) -> int:
        """Get the number of cancelled tasks."""
        return len(self.find_tasks_by_status(TaskStatus.CANCELLED))
    
    def get_tasks_by_priority(self, priority: int) -> List[Task]:
        """
        Get all tasks with a specific priority.
        
        Args:
            priority: The priority level (1-5)
            
        Returns:
            List of tasks with the specified priority
        """
        return [task for task in self._tasks if task.priority == priority]
    
    def sort_tasks_by_priority(self, reverse: bool = True) -> None:
        """
        Sort tasks by priority (highest first by default).
        
        Args:
            reverse: If True, sort in descending order (highest priority first)
        """
        self._tasks.sort(key=lambda task: task.priority, reverse=reverse)
        logger.info("Tasks sorted by priority")
    
    def sort_tasks_by_name(self, reverse: bool = False) -> None:
        """
        Sort tasks by name alphabetically.
        
        Args:
            reverse: If True, sort in reverse alphabetical order
        """
        self._tasks.sort(key=lambda task: task.name.lower(), reverse=reverse)
        logger.info("Tasks sorted by name")
    
    def sort_tasks_by_created_date(self, reverse: bool = False) -> None:
        """
        Sort tasks by creation date.
        
        Args:
            reverse: If True, sort newest first
        """
        self._tasks.sort(key=lambda task: task.created_at, reverse=reverse)
        logger.info("Tasks sorted by creation date")
    
    def clear_completed_tasks(self) -> int:
        """
        Remove all completed tasks from the list.
        
        Returns:
            Number of tasks removed
        """
        initial_count = len(self._tasks)
        self._tasks = [task for task in self._tasks if not task.is_completed()]
        removed_count = initial_count - len(self._tasks)
        logger.info(f"Cleared {removed_count} completed tasks")
        return removed_count
    
    def get_statistics(self) -> dict:
        """
        Get comprehensive statistics about the todo list.
        
        Returns:
            Dictionary containing various statistics
        """
        total = len(self._tasks)
        completed = self.get_completed_count()
        pending = self.get_pending_count()
        in_progress = self.get_in_progress_count()
        cancelled = self.get_cancelled_count()
        
        return {
            'total_tasks': total,
            'completed': completed,
            'pending': pending,
            'in_progress': in_progress,
            'cancelled': cancelled,
            'completion_rate': (completed / total * 100) if total > 0 else 0,
            'priority_distribution': {
                str(i): len(self.get_tasks_by_priority(i)) for i in range(1, 6)
            }
        }
    
    def display_tasks(self, status_filter: Optional[Union[TaskStatus, str]] = None, 
                     show_statistics: bool = False) -> None:
        """
        Display all tasks in the list with optional filtering.
        
        Args:
            status_filter: Filter tasks by status
            show_statistics: Whether to show statistics
        """
        tasks_to_show = self._tasks
        
        if status_filter:
            if isinstance(status_filter, str):
                try:
                    status_filter = TaskStatus(status_filter.lower())
                except ValueError:
                    print(f"Invalid status filter: {status_filter}")
                    return
            tasks_to_show = [task for task in self._tasks if task.status == status_filter]
        
        if not tasks_to_show:
            print(f"No tasks found{' for the specified status' if status_filter else ''}!")
            return
        
        print(f"\n{'='*60}")
        print(f"{self.name.upper()}")
        if status_filter:
            print(f"Filtered by: {status_filter.value.upper()}")
        print(f"{'='*60}")
        
        for i, task in enumerate(tasks_to_show, 1):
            print(f"{i:2d}. {task}")
        
        print(f"{'='*60}")
        print(f"Total: {len(tasks_to_show)} tasks")
        
        if show_statistics:
            stats = self.get_statistics()
            print(f"\nStatistics:")
            print(f"  Completed: {stats['completed']} ({stats['completion_rate']:.1f}%)")
            print(f"  Pending: {stats['pending']}")
            print(f"  In Progress: {stats['in_progress']}")
            print(f"  Cancelled: {stats['cancelled']}")
    
    def export_to_list(self) -> List[dict]:
        """
        Export tasks to a list of dictionaries for serialization.
        
        Returns:
            List of task dictionaries
        """
        return [
            {
                'name': task.name,
                'status': task.status.value,
                'priority': task.priority,
                'created_at': task.created_at.isoformat(),
                'updated_at': task.updated_at.isoformat()
            }
            for task in self._tasks
        ]
    
    def import_from_list(self, task_data: List[dict]) -> int:
        """
        Import tasks from a list of dictionaries.
        
        Args:
            task_data: List of task dictionaries
            
        Returns:
            Number of tasks imported
        """
        imported_count = 0
        for data in task_data:
            try:
                status = TaskStatus(data.get('status', 'pending'))
                priority = data.get('priority', 3)
                task = Task(data['name'], status, priority=priority)
                self._tasks.append(task)
                imported_count += 1
            except (KeyError, ValueError) as e:
                logger.error(f"Failed to import task: {e}")
                continue
        
        logger.info(f"Imported {imported_count} tasks")
        return imported_count


def create_sample_todo_list() -> ToDoList:
    """
    Create a sample todo list for demonstration purposes.
    
    Returns:
        A ToDoList with sample tasks
    """
    todo_list = ToDoList("Sample Project Tasks")
    
    # Add sample tasks with different priorities and statuses
    todo_list.add_task("Design database schema", TaskStatus.COMPLETED, priority=5)
    todo_list.add_task("Implement user authentication", TaskStatus.IN_PROGRESS, priority=4)
    todo_list.add_task("Write unit tests", TaskStatus.PENDING, priority=3)
    todo_list.add_task("Create API documentation", TaskStatus.PENDING, priority=2)
    todo_list.add_task("Deploy to staging", TaskStatus.PENDING, priority=4)
    todo_list.add_task("Code review", TaskStatus.PENDING, priority=3)
    todo_list.add_task("Update README", TaskStatus.PENDING, priority=1)
    
    return todo_list


def main():
    """
    Main function to demonstrate the refactored ToDo application.
    """
    print("="*70)
    print("           REFACTORED TODO APPLICATION DEMONSTRATION")
    print("="*70)
    print()
    
    # Create a sample todo list
    print("📝 Creating sample todo list...")
    todo_list = create_sample_todo_list()
    print(f"Created: {todo_list}")
    print()
    
    # Display all tasks
    print("📋 All tasks:")
    todo_list.display_tasks(show_statistics=True)
    print()
    
    # Show tasks by status
    print("📋 Pending tasks only:")
    todo_list.display_tasks(status_filter=TaskStatus.PENDING)
    print()
    
    # Sort and display by priority
    print("📋 Tasks sorted by priority (highest first):")
    todo_list.sort_tasks_by_priority()
    todo_list.display_tasks()
    print()
    
    # Mark some tasks as completed
    print("✅ Marking tasks as completed...")
    todo_list.mark_task_completed("Write unit tests")
    todo_list.mark_task_completed("Code review")
    print()
    
    # Show updated statistics
    print("📊 Updated statistics:")
    stats = todo_list.get_statistics()
    for key, value in stats.items():
        if key != 'priority_distribution':
            print(f"  {key.replace('_', ' ').title()}: {value}")
    
    print(f"\n  Priority Distribution:")
    for priority, count in stats['priority_distribution'].items():
        print(f"    Priority {priority}: {count} tasks")
    print()
    
    # Show high priority tasks
    print("📋 High priority tasks (priority 4-5):")
    high_priority_tasks = [task for task in todo_list if task.priority >= 4]
    for i, task in enumerate(high_priority_tasks, 1):
        print(f"  {i}. {task}")
    print()
    
    # Export/Import demonstration
    print("💾 Export/Import demonstration:")
    exported_data = todo_list.export_to_list()
    print(f"Exported {len(exported_data)} tasks")
    
    # Create a new list and import the data
    new_todo_list = ToDoList("Imported Tasks")
    imported_count = new_todo_list.import_from_list(exported_data)
    print(f"Imported {imported_count} tasks to new list")
    print()
    
    print("="*70)
    print("           DEMONSTRATION COMPLETED")
    print("="*70)


if __name__ == "__main__":
    main()
