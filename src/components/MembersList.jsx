function MembersList({ users }) {
  if (!users || users.length === 0) {
    return (
      <div className="dashboard-members">
        <div className="dashboard-members-header">Members</div>
      </div>
    );
  }

  return (
    <div className="dashboard-members">
      <div className="dashboard-members-header">Members — {users.length}</div>
      <div className="dashboard-members-list">
        {users.map((user) => (
          <div className="dashboard-members-user" key={user.username}>
            <div className="dashboard-members-avatar noselect">{user.emoji || '👤'}</div>
            <div className="dashboard-members-username">{user.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersList;