import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Calendar28 } from '@/components/ui/calendar28';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/types/task.types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { fetchUsers } from '@/store/slices/usersSlice';

// Zod schema
const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  status: z.enum(TASK_STATUSES as unknown as [string, ...string[]], { required_error: 'Status is required' }),
  priority: z.enum(TASK_PRIORITIES as unknown as [string, ...string[]], { required_error: 'Priority is required' }),
  description: z.string().optional(),
  estimateDate: z.number({ required_error: 'Date is required' }),
  assignToUserId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask?: TaskFormValues;
  onSubmit?: (data: TaskFormValues) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onOpenChange, editingTask, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: editingTask || {
      name: '',
      status: TASK_STATUSES[0],
      priority: TASK_PRIORITIES[1],
      description: '',
      estimateDate: Date.now(),
      assignToUserId: '',
      userName: '',
    },
  });

  // Reset form when editingTask changes
  useEffect(() => {
    reset(editingTask || {
      name: '',
      status: TASK_STATUSES[0],
      priority: TASK_PRIORITIES[1],
      description: '',
      estimateDate: Date.now(),
      assignToUserId: '',
      userName: '',
    });
  }, [editingTask, reset]);

  // User state management
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading: usersLoading, error: usersError } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (users.length === 0 && !usersLoading && !usersError) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length, usersLoading, usersError]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="w-4 h-4 mr-2" />
          {editingTask ? 'Edit Task' : 'Add Task'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {editingTask ? 'Update task information' : 'Enter the details for your new task'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input id="name" {...register('name')} placeholder="Enter task name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status - Fixed with Controller */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

            {/* Priority - Fixed with Controller */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea {...register('description')} rows={3} placeholder="Enter task description" />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Estimate Date - Fixed onChange */}
          <div className="space-y-2">
            <Label htmlFor="estimateDate">Estimate Date</Label>
            <Controller
              name="estimateDate"
              control={control}
              render={({ field }) => (
                <Calendar28
                  name={field.name}
                  value={field.value}
                  onChange={(event: { target: { name: string; value: number } }) => field.onChange(event.target.value)}
                />
              )}
            />
            {errors.estimateDate && <p className="text-red-500 text-sm">{errors.estimateDate.message}</p>}
          </div>

          {/* Assign To User */}
          <div className="space-y-2">
            <Label htmlFor="assignToUserId">Assign User</Label>
            <Controller
              control={control}
              name="assignToUserId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(selectedId) => {
                    const selectedUser = users.find((u) => u.id === selectedId);
                    if (selectedUser) {
                      field.onChange(selectedId); // update assignToUserId
                      // also update userName
                      setValue('userName', `${selectedUser.firstName} ${selectedUser.lastName}`, { 
                        shouldValidate: true 
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Users</SelectLabel>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={`https://robohash.org/${user.firstName + user.lastName}.png?size=100x100`}
                                alt={user.firstName}
                              />
                              <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.firstName} {user.lastName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assignToUserId && (
              <p className="text-red-500 text-sm">{errors.assignToUserId.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-500 hover:bg-primary-600">
              {editingTask ? 'Update' : 'Add'} Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};