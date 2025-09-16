import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserCheck, UserX, Mail, Shield } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  roles: string[];
  email_confirmed_at: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, verificationFilter]);

  const fetchUsers = async () => {
    try {
      // Fetch all users with their roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Get unique user IDs
      const userIds = [...new Set(rolesData?.map(r => r.user_id) || [])];
      
      // Fetch user details from auth.users via RPC or service role
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        // Fallback to using user_roles data only
        const usersMap = new Map<string, UserData>();
        
        rolesData?.forEach(roleData => {
          if (!usersMap.has(roleData.user_id)) {
            usersMap.set(roleData.user_id, {
              id: roleData.user_id,
              email: `User ${roleData.user_id.slice(0, 8)}`,
              created_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              roles: [],
              email_confirmed_at: null
            });
          }
          usersMap.get(roleData.user_id)?.roles.push(roleData.role);
        });

        setUsers(Array.from(usersMap.values()));
      } else {
        // Map auth users with their roles
        const usersWithRoles = authUsers?.map(user => {
          const userRoles = rolesData?.filter(r => r.user_id === user.id).map(r => r.role) || [];
          return {
            id: user.id,
            email: user.email || "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at || "",
            roles: userRoles,
            email_confirmed_at: user.email_confirmed_at
          };
        }) || [];

        setUsers(usersWithRoles);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.roles.includes(roleFilter));
    }

    // Verification filter
    if (verificationFilter === "verified") {
      filtered = filtered.filter(user => user.email_confirmed_at !== null);
    } else if (verificationFilter === "unverified") {
      filtered = filtered.filter(user => user.email_confirmed_at === null);
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const handleAddRole = async (userId: string, role: "admin" | "seller" | "buyer") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as "admin" | "seller" | "buyer" });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role added successfully"
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Total Users: {users.length} | Verified: {users.filter(u => u.email_confirmed_at).length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Verification status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No users found</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.roles.map((role) => (
                              <Badge key={role} variant={role === 'admin' ? 'destructive' : 'default'}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.email_confirmed_at ? (
                            <Badge variant="outline" className="text-green-600">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600">
                              <UserX className="h-3 w-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!user.roles.includes('admin') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddRole(user.id, 'admin')}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;