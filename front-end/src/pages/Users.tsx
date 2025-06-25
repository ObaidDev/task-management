import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Mail, Phone, User, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchUsers, inviteUsersBulk, toggleStatus ,toggleUserStatus} from '@/store/slices/usersSlice';
import EmailTagifyInput from '@/components/EmailTagifyInput';
import { InviteUserRequest } from '@/types/user.types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  createdAt: string;
}

const Users = () => {

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-orange-100 text-orange-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInviteSubmit = (e: any) => {
    e.preventDefault();

    const inviteUserRequests: InviteUserRequest[] = emails.map(email => ({ email }));

    console.log('🐛 inviteUserRequests:', inviteUserRequests);

    dispatch(inviteUsersBulk(inviteUserRequests)) ;
  };

  // ********************************************//
  const [emails, setEmails] = React.useState<string[]>([]);

  const handleEmailsChange = (newEmails: string[]) => {
    setEmails(newEmails);
  };


  // ********************************************//
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading, error } = useSelector((state: RootState) => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage your team members and their permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-500 hover:bg-primary-600">
              <Plus className="w-4 h-4 mr-2" />
              Invite Users
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Users</DialogTitle>
              <DialogDescription>
                Enter one or more email addresses to invite users. Press Enter or comma to add each email.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleInviteSubmit}>
              <div className="space-y-2">
                <Label htmlFor="emails">Emails</Label>
                <EmailTagifyInput
                  onEmailsChange={handleEmailsChange}
                  placeholder="Enter email addresses..."
                />

              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary-500 hover:bg-primary-600">
                  Invite
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-gray-600 text-sm">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.enabled === true).length}</p>
                <p className="text-gray-600 text-sm">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.firstName === 'admin').length}</p>
                <p className="text-gray-600 text-sm">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.firstName === 'manager').length}</p>
                <p className="text-gray-600 text-sm">Managers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Created</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                      {/* {user.phone && ( */}
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>+967 873 537 6406</span>
                        </div>
                      {/* )} */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.firstName)}>
                      {user.firstName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.enabled ? 'active' : 'inactive')}>
                      {user.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="text-sm text-gray-500">
                    {user.createdAt}
                  </TableCell> */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch(toggleUserStatus({ 
                          userId: user.id, 
                          newStatus: !user.enabled 
                        }))}
                        className={user.enabled === true ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {user.enabled === true ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
