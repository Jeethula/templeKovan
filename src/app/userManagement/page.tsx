import { getAllUsers } from './actions';
import { UserGrid } from './UserGrid';

export default async function PersonalInfoPage() {

  const users = await getAllUsers();
  const mappedUsers = users.map(user => ({
    ...user,
    unique_id: String(user.unique_id),
    relationships: user.relationships.map(rel => ({
      ...rel,
      lastName: rel.lastName || undefined
    }))
  }));

  return (
    <div className="min-h-screen bg-[#fdf0f4]">
      <UserGrid initialUsers={mappedUsers} />
    </div>
  );
}

