// TODO: Team collaboration feature - partially designed but not implemented
// This is a stub for future multi-user functionality

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'member' | 'viewer'
}

interface TeamMemberProps {
  member: TeamMember
}

// Feature stub - not integrated into main app
// Decision needed: Should this be a separate page or modal?
function TeamMember({ member }: TeamMemberProps) {
  return (
    <div>
      <h3>{member.name}</h3>
      <p>{member.email}</p>
      <span>{member.role}</span>
    </div>
  )
}

export default TeamMember

// TODO: Need to decide on:
// - How to handle permissions
// - Real-time updates (WebSocket? Polling?)
// - Conflict resolution when multiple users edit same task

