
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Loader } from 'lucide-react';
import { createTasks, deleteTask, fetchPaginatedTasks } from '@/store/slices/taskSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskRequest, TaskStatus } from '@/types/task.types';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar28 } from '@/components/ui/calendar28';
import { TaskForm, TaskFormValues } from '@/components/task/TaskForm';




const Tasks = () => {


  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, pagination, hasMore } = useSelector((state: RootState) => state.tasks);

  const scrollRef = useRef<HTMLDivElement>(null); 

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(fetchPaginatedTasks({ page: currentPage, pageSize: pagination.pageSize }));
  }, [dispatch, currentPage, pagination.pageSize]);


  // Handle scroll event
  const handleScroll = () => {
    if (loading || !hasMore || !scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDelete = (taskId: number, taskName: string) => {
    
    if (window.confirm(`Are you sure you want to delete task "${taskName}"?`)) {
      dispatch(deleteTask(taskId))
        .unwrap()
        .then(() => {
          toast.success(`Task "${taskName}" has been deleted.` ,
            {
            style: {
              background: '#10B981',
              color: 'white',
            },
            }
          );
        })
        .catch((error) => {
          toast.error(`Failed to delete task: ${error}` , {

          style: {
            background: '#EF4444',
            color: 'white',
          },
          });
        });
    }
  };


  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL': return 'bg-red-200 text-red-900';
    case 'HIGH': return 'bg-red-100 text-red-800';
    case 'MEDIUM': return 'bg-orange-100 text-orange-800';
    case 'LOW': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
  };


  // form

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRequest | null>(null);

  const [formData, setFormData] = useState<TaskRequest>({
    name: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    description: '',
    estimateDate: 0,
    assignToUserId: '',
    userName: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (data: TaskFormValues) => {
  try {
    if (editingTask) {
      // Handle update case (when you implement updateTask thunk)
      // const loadingToast = toast.loading('Updating task...');
      // await dispatch(updateTask({ ...data, id: editingTask.id })).unwrap();
      // toast.success('Task updated successfully', { id: loadingToast });
      console.log('Update not implemented yet');
    } else {
      // Handle create case
      const loadingToast = toast.loading('Creating task...');
      
      // Convert TaskFormValues to TaskRequest format
      const taskRequest: TaskRequest = {
        name: data.name,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        description: data.description,
        estimateDate: data.estimateDate, // Assuming this is already a timestamp
        assignToUserId: data.assignToUserId,
        userName: data.userName,
      };
      
      // Create array since backend expects a list
      const result = await dispatch(createTasks([taskRequest])).unwrap();
      
      toast.success('Task created successfully', { 
        id: loadingToast ,
        style: {
          background: '#10B981',
          color: 'white',
        },
      });

      setIsDialogOpen(false)
      setEditingTask(undefined)

    }
    
    // Close dialog and reset state on success
    // setDialogOpen(false);
    // setEditingTask(undefined);
    
    } catch (error) {
      // Handle error case
      const errorMessage = error as string || 'An unexpected error occurred';
      toast.error(errorMessage);
      console.error('Form submission error:', error);
      
      // Keep dialog open on error so user can retry
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage and track your team's tasks and progress</p>
        </div>
        {/* Add Task Dialog Trigger + Dialog */}
        <TaskForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingTask={editingTask}
          onSubmit={handleFormSubmit}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Circle className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'OPEN').length}</p>
                <p className="text-gray-600 text-sm">To Do</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
                <p className="text-gray-600 text-sm">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'DONE').length}</p>
                <p className="text-gray-600 text-sm">Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'BLOCKED').length}</p>
                <p className="text-gray-600 text-sm">Blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card className="h-[600px] overflow-y-auto"  ref={scrollRef}>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Track and manage all tasks across your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900">{task.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {new Date(task.estimateDate).toLocaleDateString()}</span>
                      </div>
                      <span>Assigned to: {task.userName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getPriorityBadgeColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusBadgeColor(task.status)}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(task.id, task.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && <p className="text-center py-4">Loading more tasks...</p>}
          {!hasMore && <p className="text-center py-4 text-gray-500">No more tasks to load</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
